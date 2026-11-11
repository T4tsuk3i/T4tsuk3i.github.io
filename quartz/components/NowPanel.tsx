import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { getPosts, getTagCounts } from "./ledger"

const NowPanel: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const slug = fileData.slug!
  const tags = getTagCounts(getPosts(allFiles)).slice(0, 8)

  return (
    <section class="et-now" aria-label="Now">
      <div class="et-now-head">
        <h2>Now</h2>
        <span>updated November 2026</span>
      </div>

      <div class="et-now-grid">
        <div class="et-now-col">
          <h3>Building</h3>
          <ul>
            <li>Local AI assistant, smaller models</li>
            <li>OSINT tools with memory</li>
            <li>Project Smriti — local-first journal</li>
            <li>Project Sunrise — preservation mod</li>
          </ul>
        </div>

        <div class="et-now-col">
          <h3>This notebook</h3>
          <p>
            Notes are written when something is understood well enough to explain. No schedule, no
            series — just the long-form version of figuring things out.
          </p>
        </div>

        <div class="et-now-col">
          <h3>Elsewhere</h3>
          <div class="et-now-links">
            <a href="https://github.com/T4tsuk3i" target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={resolveRelative(slug, "index.xml" as FullSlug)}>RSS feed</a>
            <a href={resolveRelative(slug, "about-me" as FullSlug)}>About me</a>
          </div>
          <div class="et-now-tags">
            {tags.map((tag) => (
              <a class="et-tag" href={resolveRelative(slug, `tags/${tag.tag}` as FullSlug)}>
                #{tag.tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default (() => NowPanel) satisfies QuartzComponentConstructor
