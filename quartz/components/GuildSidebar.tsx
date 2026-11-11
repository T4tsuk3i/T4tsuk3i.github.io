import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"

const MAIN: { label: string; target: string; match: string[] }[] = [
  { label: "Overview", target: "index", match: ["index"] },
  { label: "Chronicle", target: "all-posts", match: ["all-posts"] },
  { label: "Ongoing", target: "research", match: ["research"] },
  { label: "Projects", target: "projects", match: ["projects"] },
]

const GuildSidebar: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug!
  return (
    <aside class="et-rail" aria-label="Sections">
      <nav class="et-rail-nav" aria-label="Sections">
        <p class="et-rail-label">Index</p>
        <ol>
          {MAIN.map((item, index) => {
            const active = item.match.includes(slug)
            return (
              <li>
                <a
                  href={resolveRelative(slug, item.target as FullSlug)}
                  class={active ? "is-active" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span class="et-rail-num">{String(index + 1).padStart(2, "0")}</span>
                  <span class="et-rail-text">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      <div class="et-rail-block et-rail-note">
        <p class="et-rail-label">Elsewhere</p>
        <a href="https://github.com/T4tsuk3i" target="_blank" rel="noopener noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <a href={resolveRelative(slug, "index.xml" as FullSlug)}>RSS feed</a>
      </div>
    </aside>
  )
}

export default (() => GuildSidebar) satisfies QuartzComponentConstructor
