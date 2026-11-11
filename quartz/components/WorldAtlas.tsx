import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { getPosts, getTagCounts } from "./ledger"
import { ATLAS_WIDTH, ATLAS_HEIGHT, REGION_POINTS } from "./atlas-geo"
// @ts-ignore
import script from "./scripts/atlas.inline"

type Site = {
  title: string
  href: string
  meta: string
  kind: "post" | "page" | "external"
}

type Region = {
  id: string
  name: string
  kanji: string
  sub: string
  desc: string
  x: number
  y: number
  labelX: number
  labelY: number
  anchor: "start" | "end"
  sites: Site[]
}

const WorldAtlas: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const slug = fileData.slug!
  const posts = getPosts(allFiles)
  const tags = getTagCounts(posts)

  const postSites = (tag: string): Site[] =>
    posts
      .filter((post) => post.tags.includes(tag))
      .map((post) => ({
        title: post.title,
        href: resolveRelative(slug, post.slug),
        meta: `${post.date ? post.date.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Undated"} · ${post.minutes} min`,
        kind: "post",
      }))

  const regions: Region[] = [
    {
      id: "hokkaido",
      name: "Susukino",
      kanji: "ススキノ",
      sub: "Northern guild city",
      desc: "The northern city under snow. Its guild halls keep the systems notes: memory, compilers, and the long rewrite in Rust.",
      ...REGION_POINTS.hokkaido,
      labelX: 778,
      labelY: 58,
      anchor: "start",
      sites: postSites("programming"),
    },
    {
      id: "tohoku",
      name: "Choushi",
      kanji: "チョウシ",
      sub: "Eastern port town",
      desc: "A port town of nets and repeating tides. Pattern work is recorded here — the shapes numbers leave behind.",
      ...REGION_POINTS.tohoku,
      labelX: 744,
      labelY: 208,
      anchor: "start",
      sites: postSites("rust"),
    },
    {
      id: "kanto",
      name: "Akiba",
      kanji: "アキバ",
      sub: "City of scribes",
      desc: "The city of scribes and the round table. Programming notes, profiling runs and the long-form engineering record live here.",
      ...REGION_POINTS.kanto,
      labelX: 702,
      labelY: 338,
      anchor: "start",
      sites: postSites("python"),
    },
    {
      id: "chubu",
      name: "Shibuya",
      kanji: "シブヤ",
      sub: "The crowded wards",
      desc: "The crowded wards where quick experiments begin. Small Python tools, profilers and scripts that outgrow their purpose.",
      ...REGION_POINTS.chubu,
      labelX: 432,
      labelY: 286,
      anchor: "end",
      sites: postSites("mathematics"),
    },
    {
      id: "kansai",
      name: "Minami",
      kanji: "ミナミ",
      sub: "Southern archive",
      desc: "A southern archive of pure reasoning: modular arithmetic, cardioids, symmetry and the geometry of multiplication.",
      ...REGION_POINTS.kansai,
      labelX: 436,
      labelY: 442,
      anchor: "end",
      sites: postSites("art"),
    },
    {
      id: "shikoku",
      name: "Nakasu",
      kanji: "ナカス",
      sub: "Lamplight quarter",
      desc: "The lamplit quarter where the visual notes are kept — generative art, interference patterns and code that draws.",
      ...REGION_POINTS.shikoku,
      labelX: 330,
      labelY: 502,
      anchor: "end",
      sites: postSites("patterns"),
    },
    {
      id: "chugoku",
      name: "Maihama",
      kanji: "マイハマ",
      sub: "The workshop coast",
      desc: "The workshop coast of daily-driver setups: Arch, Fedora, GNOME ricing and tools that stay out of the way.",
      ...REGION_POINTS.chugoku,
      labelX: 300,
      labelY: 360,
      anchor: "end",
      sites: postSites("linux"),
    },
    {
      id: "kyushu",
      name: "Sakae",
      kanji: "サカエ",
      sub: "Forge district",
      desc: "The forge district of half-finished builds: local-first tools, game preservation and the notebook itself.",
      ...REGION_POINTS.kyushu,
      labelX: 252,
      labelY: 584,
      anchor: "end",
      sites: [
        {
          title: "All projects",
          href: resolveRelative(slug, "projects" as FullSlug),
          meta: "Index · builds and experiments",
          kind: "page",
        },
        {
          title: "Project Smriti",
          href: "https://github.com/T4tsuk3i/Project-Smriti",
          meta: "External · local-first journal",
          kind: "external",
        },
        {
          title: "Project Sunrise",
          href: "https://github.com/T4tsuk3i/Sunrise-T4tsuk3i",
          meta: "External · preservation mod",
          kind: "external",
        },
      ],
    },
    {
      id: "okinawa",
      name: "Osaka",
      kanji: "オオサカ",
      sub: "Outer territories",
      desc: "The outer territories. Research notes, CTF material and experiments not yet ready for a full write-up.",
      ...REGION_POINTS.okinawa,
      labelX: 352,
      labelY: 792,
      anchor: "start",
      sites: [
        {
          title: "Research index",
          href: resolveRelative(slug, "research" as FullSlug),
          meta: "Index · long-form exploration",
          kind: "page",
        },
        {
          title: "Ishtar Anomaly CTF",
          href: "https://github.com/T4tsuk3i/ishtar-ctf-archive",
          meta: "External · challenge archive",
          kind: "external",
        },
      ],
    },
  ]

  const withEntries = regions.filter((region) => region.sites.length > 0)
  const links: { a: Region; b: Region; shared: number }[] = []
  for (let i = 0; i < withEntries.length; i++) {
    for (let j = i + 1; j < withEntries.length; j++) {
      const a = withEntries[i]
      const b = withEntries[j]
      const shared = a.sites.filter((site) => b.sites.some((other) => other.href === site.href)).length
      if (shared > 0) links.push({ a, b, shared })
    }
  }

  const totalSites = withEntries.reduce((sum, region) => sum + region.sites.length, 0)
  const data = JSON.stringify({ regions: withEntries, width: ATLAS_WIDTH, height: ATLAS_HEIGHT })

  return (
    <section class="et-atlas" id="atlas" aria-label="Interactive atlas of the notebook">

      <div class="et-atlas-stage">
        <div class="et-atlas-canvas" role="application" aria-label="Map of the notebook">
          <svg
            class="et-atlas-svg"
            viewBox={`0 0 ${ATLAS_WIDTH} ${ATLAS_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="A painted atlas of Japan with markers for each region of the notebook"
          >
            <defs>
              <clipPath id="atlas-clip">
                <rect x="0" y="0" width={ATLAS_WIDTH} height={ATLAS_HEIGHT} />
              </clipPath>
            </defs>

            <g clip-path="url(#atlas-clip)">
              <g class="atlas-world">
                <image
                  href="./static/images/atlas-terrain.jpg"
                  x="0"
                  y="0"
                  width={ATLAS_WIDTH}
                  height={ATLAS_HEIGHT}
                  preserveAspectRatio="none"
                />
                <rect
                  x="0"
                  y="0"
                  width={ATLAS_WIDTH}
                  height={ATLAS_HEIGHT}
                  class="atlas-shade"
                  aria-hidden="true"
                />

                <g class="atlas-detail" aria-live="polite" />

                <g class="atlas-links" aria-hidden="true">
                  {links.map((link) => (
                    <line
                      class="atlas-link"
                      x1={link.a.x}
                      y1={link.a.y}
                      x2={link.b.x}
                      y2={link.b.y}
                      stroke-width={1 + Math.min(link.shared, 3) * 0.5}
                    />
                  ))}
                </g>

                <g class="atlas-nodes">
                  {withEntries.map((region) => (
                    <g
                      class="atlas-node"
                      data-region={region.id}
                      tabindex={0}
                      role="button"
                      aria-label={`${region.name} — ${region.sites.length} entries`}
                      transform={`translate(${region.x} ${region.y})`}
                    >
                      <line
                        class="atlas-leader"
                        x1="0"
                        y1="0"
                        x2={region.labelX - region.x}
                        y2={region.labelY - region.y}
                      />
                      <circle class="atlas-halo" r="15" />
                      <path class="atlas-mark" d="M0 -8 L8 0 L0 8 L-8 0 Z" />

                      {region.sites.map((site, index) => {
                        const angle = (index / Math.max(region.sites.length, 1)) * Math.PI * 2 - Math.PI / 2
                        const radius = 30
                        return (
                          <a
                            class={`atlas-post atlas-post-${site.kind}`}
                            href={site.href}
                            target={site.kind === "external" ? "_blank" : undefined}
                            rel={site.kind === "external" ? "noopener noreferrer" : undefined}
                            transform={`translate(${Math.cos(angle) * radius} ${Math.sin(angle) * radius})`}
                          >
                            <circle r="4.5" />
                            <title>{site.title}</title>
                          </a>
                        )
                      })}
                      {(() => {
                        const plateW = Math.max(74, Math.round(region.name.length * 7.4 + 18))
                        return (
                          <g transform={`translate(${region.labelX - region.x} ${region.labelY - region.y})`}>
                            <rect
                              class="atlas-plate"
                              x={region.anchor === "start" ? 0 : -plateW}
                              y="-26"
                              width={plateW}
                              height="26"
                              rx="1.5"
                            />
                            <text
                              class="atlas-label"
                              x={region.anchor === "start" ? 7 : -7}
                              y="-10"
                              text-anchor={region.anchor}
                            >
                              {region.name}
                            </text>
                            <text
                              class="atlas-kanji"
                              x={region.anchor === "start" ? 7 : -7}
                              y="-1.5"
                              text-anchor={region.anchor}
                            >
                              {region.kanji}
                            </text>
                          </g>
                        )
                      })()}
                    </g>
                  ))}
                </g>
              </g>
            </g>

            {/* fixed atlas furniture */}
            </svg>


          <div class="et-atlas-card" data-atlas-card hidden>
            <button type="button" class="et-atlas-card-close" data-atlas-reset aria-label="Close">×</button>
            <p class="et-atlas-crumb" data-atlas-crumb />
            <h3 class="et-atlas-title" data-atlas-title />
            <p class="et-atlas-desc" data-atlas-desc />
            <ul class="et-atlas-list" data-atlas-list />
          </div>

          <div class="et-atlas-controls">
            <button type="button" data-atlas="in" aria-label="Zoom in">+</button>
            <button type="button" data-atlas="out" aria-label="Zoom out">−</button>
            <button type="button" data-atlas="reset" aria-label="Reset view">⌂</button>
          </div>
        </div>

      </div>

      <script
        type="application/json"
        id="atlas-data"
        dangerouslySetInnerHTML={{ __html: data.replace(/</g, "\\u003c") }}
      />
    </section>
  )
}

WorldAtlas.afterDOMLoaded = script

export default (() => WorldAtlas) satisfies QuartzComponentConstructor
