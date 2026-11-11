type Site = {
  title: string
  href: string
  meta: string
  kind: "post" | "page" | "external"
}

type Region = {
  id: string
  name: string
  sub: string
  desc: string
  x: number
  y: number
  sites: Site[]
}

type AtlasData = { regions: Region[]; width: number; height: number }

const SVG_NS = "http://www.w3.org/2000/svg"

function createEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag)
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
  return el
}

function setupAtlas() {
  const root = document.querySelector<HTMLElement>(".et-atlas")
  if (!root || root.dataset.ready === "1") return

  const cfgEl = root.querySelector<HTMLScriptElement>("#atlas-data")
  const svg = root.querySelector<SVGSVGElement>(".et-atlas-svg")
  const world = root.querySelector<SVGGElement>(".atlas-world")
  const detail = root.querySelector<SVGGElement>(".atlas-detail")
  const titleEl = root.querySelector<HTMLElement>("[data-atlas-title]")
  const descEl = root.querySelector<HTMLElement>("[data-atlas-desc]")
  const crumbEl = root.querySelector<HTMLElement>("[data-atlas-crumb]")
  const listEl = root.querySelector<HTMLElement>("[data-atlas-list]")
  const cardEl = root.querySelector<HTMLElement>("[data-atlas-card]")

  if (!cfgEl || !svg || !world || !detail || !titleEl || !descEl || !crumbEl || !listEl || !cardEl) return

  let data: AtlasData
  try {
    data = JSON.parse(cfgEl.textContent || "{}") as AtlasData
  } catch {
    return
  }
  if (!data.regions || data.regions.length === 0) return

  root.dataset.ready = "1"

  const W = data.width || 1000
  const H = data.height || 900


  const view = { x: 0, y: 0, k: 1 }
  let current: Region | null = null

  const apply = (animate = true) => {
    world.style.transition = animate ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" : "none"
    world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.k})`
    root.dataset.zoom = view.k > 1.05 ? "region" : "world"
  }

  const zoomAt = (px: number, py: number, factor: number) => {
    const next = Math.max(0.9, Math.min(4, view.k * factor))
    const ratio = next / view.k
    view.x = px - (px - view.x) * ratio
    view.y = py - (py - view.y) * ratio
    view.k = next
    apply(false)
  }

  const clearDetail = () => {
    while (detail.firstChild) detail.removeChild(detail.firstChild)
  }

  const sitePositions = (count: number) => {
    const spots: [number, number][] = [
      [0, -64],
      [78, -6],
      [12, 58],
      [-78, 8],
      [62, 62],
      [-62, -52],
      [96, -66],
      [-96, -58],
    ]
    return Array.from({ length: count }, (_, i) => spots[i % spots.length])
  }

  const showRegion = (region: Region) => {
    current = region

    const targetScale = 2.25
    view.k = targetScale
    view.x = W / 2 - region.x * targetScale
    view.y = H / 2 - region.y * targetScale
    apply(true)

    cardEl.hidden = false
    titleEl.textContent = region.name
    descEl.textContent = region.desc
    crumbEl.innerHTML = `WORLD / <button type="button" data-atlas-reset>${region.name.toUpperCase()}</button>`
    listEl.innerHTML = region.sites
      .map(
        (site) =>
          `<li><a href="${site.href}"${site.kind === "external" ? ' target="_blank" rel="noopener noreferrer"' : ""}>` +
          `<span class="et-atlas-list-name">${site.title}</span>` +
          `<span class="et-atlas-list-meta">${site.meta}</span></a></li>`,
      )
      .join("")
  }

  const reset = () => {
    current = null
    view.x = 0
    view.y = 0
    view.k = 1
    apply(true)
    cardEl.hidden = true
    titleEl.textContent = ""
    descEl.textContent = ""
    crumbEl.textContent = ""
    listEl.innerHTML = ""
  }

  const regionById = (id: string | null) => data.regions.find((region) => region.id === id) ?? null

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element
    const regionNode = target.closest<SVGGElement>("[data-region]")
    if (regionNode) {
      event.preventDefault()
      const region = regionById(regionNode.getAttribute("data-region"))
      if (region) showRegion(region)
      return
    }

    const openButton = target.closest<HTMLElement>("[data-atlas-open]")
    if (openButton) {
      event.preventDefault()
      const region = regionById(openButton.getAttribute("data-atlas-open"))
      if (region) showRegion(region)
      return
    }

    if (target.closest("[data-atlas-reset]")) {
      event.preventDefault()
      reset()
      return
    }

    const control = target.closest<HTMLElement>("[data-atlas]")
    if (control) {
      event.preventDefault()
      const action = control.getAttribute("data-atlas")
      if (action === "in") zoomAt(W / 2, H / 2, 1.25)
      if (action === "out") zoomAt(W / 2, H / 2, 0.8)
      if (action === "reset") reset()
    }
  }

  cardEl.addEventListener("pointerdown", (event) => event.stopPropagation())
  root.addEventListener("click", onClick)

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return
    const target = event.target as Element
    const regionNode = target.closest<SVGGElement>("[data-region]")
    if (!regionNode) return
    event.preventDefault()
    const region = regionById(regionNode.getAttribute("data-region"))
    if (region) showRegion(region)
  }

  root.addEventListener("keydown", onKey)

  const canvas = root.querySelector<HTMLElement>(".et-atlas-canvas")
  if (canvas) {
    let drag: { x: number; y: number; vx: number; vy: number } | null = null

    canvas.addEventListener("pointerdown", (event) => {
      const target = event.target as Element
      if (
        target.closest(".atlas-site") ||
        target.closest("[data-region]") ||
        target.closest(".et-atlas-card") ||
        target.closest(".et-atlas-controls")
      ) {
        return
      }
      const rect = svg.getBoundingClientRect()
      drag = { x: event.clientX, y: event.clientY, vx: view.x, vy: view.y }
      canvas.dataset.dragging = "1"
      canvas.setPointerCapture(event.pointerId)
      view.k = view.k
      void rect
    })

    canvas.addEventListener("pointermove", (event) => {
      if (!drag) return
      const rect = svg.getBoundingClientRect()
      const dx = ((event.clientX - drag.x) / rect.width) * W
      const dy = ((event.clientY - drag.y) / rect.height) * H
      view.x = drag.vx + dx
      view.y = drag.vy + dy
      apply(false)
    })

    const endDrag = () => {
      drag = null
      delete canvas.dataset.dragging
    }
    canvas.addEventListener("pointerup", endDrag)
    canvas.addEventListener("pointercancel", endDrag)

    canvas.addEventListener(
      "wheel",
      (event) => {
        // leave plain wheel to the page so the atlas never traps scrolling
        if (!event.ctrlKey && !event.metaKey) return
        event.preventDefault()
        const rect = svg.getBoundingClientRect()
        const px = ((event.clientX - rect.left) / rect.width) * W
        const py = ((event.clientY - rect.top) / rect.height) * H
        zoomAt(px, py, event.deltaY < 0 ? 1.12 : 0.89)
      },
      { passive: false },
    )
  }

  apply(false)

  window.addCleanup?.(() => {
    root.removeEventListener("click", onClick)
    root.removeEventListener("keydown", onKey)
    delete root.dataset.ready
  })
}

document.addEventListener("nav", setupAtlas)
if (document.readyState !== "loading") setupAtlas()
else document.addEventListener("DOMContentLoaded", setupAtlas)
