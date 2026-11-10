import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"

const LINKS: { label: string; target: string }[] = [
  { label: "Home", target: "index" },
  { label: "Notes", target: "all-posts" },
  { label: "Projects", target: "projects" },
  { label: "Research", target: "research" },
  { label: "About", target: "about-me" },
]

const SiteNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug!
  return (
    <nav class="site-nav" aria-label="Primary">
      {LINKS.map((link) => {
        const active = slug === link.target
        return (
          <a
            href={resolveRelative(slug, link.target as FullSlug)}
            class={active ? "active" : undefined}
          >
            {link.label}
          </a>
        )
      })}
    </nav>
  )
}

export default (() => SiteNav) satisfies QuartzComponentConstructor
