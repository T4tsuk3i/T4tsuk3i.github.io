import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"

const LINKS: { label: string; target: string; match: string[] }[] = [
  { label: "Home", target: "index", match: ["index"] },
  { label: "Chronicle", target: "all-posts", match: ["all-posts"] },
  { label: "Projects", target: "projects", match: ["projects"] },
  { label: "Ongoing", target: "research", match: ["research"] },
  { label: "About", target: "about-me", match: ["about-me"] },
]

const SiteNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug!
  return (
    <nav class="et-nav" aria-label="Primary">
      {LINKS.map((link) => {
        const active = link.match.includes(slug)
        return (
          <a
            href={resolveRelative(slug, link.target as FullSlug)}
            class={active ? "is-active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </a>
        )
      })}
    </nav>
  )
}

export default (() => SiteNav) satisfies QuartzComponentConstructor
