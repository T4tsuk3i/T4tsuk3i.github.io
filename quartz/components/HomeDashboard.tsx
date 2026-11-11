import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { getPosts, getTagCounts, getWordCount } from "./ledger"
import { renderPostCards } from "./PostCards"

/** Original dashboard for the homepage: ledger summary, latest entries, topic index. */
const HomeDashboard: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const slug = fileData.slug!
  const posts = getPosts(allFiles)
  const tags = getTagCounts(posts)
  const words = getWordCount(allFiles)
  const minutes = posts.reduce((total, post) => total + post.minutes, 0)

  const top = tags.slice(0, 4)
  const total = Math.max(1, top.reduce((sum, t) => sum + t.count, 0))
  let cursor = 0
  const ring = top.map((t) => {
    const share = (t.count / total) * 100
    const segment = { tag: t.tag, count: t.count, share, offset: cursor }
    cursor += share
    return segment
  })
  const maxCount = Math.max(1, ...tags.map((t) => t.count))
  const tagOccurrences = tags.reduce((sum, t) => sum + t.count, 0)

  return (
    <div class="et-dashboard">
      <section class="et-plate et-summary" aria-labelledby="et-summary-title">
        <div class="et-summary-copy">
          <p class="et-eyebrow">Ledger summary</p>
          <h2 id="et-summary-title" class="et-summary-title">
            {posts.length} {posts.length === 1 ? "entry" : "entries"} · {tags.length}{" "}
            {tags.length === 1 ? "topic" : "topics"} · {words.toLocaleString("en-US")} words
          </h2>
          <p class="et-summary-sub">
            Every number on this page is counted from the notes themselves — no placeholder progress.
          </p>
          <dl class="et-summary-stats">
            <div>
              <dt>Entries</dt>
              <dd>{posts.length}</dd>
            </div>
            <div>
              <dt>Topics</dt>
              <dd>{tags.length}</dd>
            </div>
            <div>
              <dt>Reading</dt>
              <dd>{minutes} min</dd>
            </div>
            <div>
              <dt>Words</dt>
              <dd>{words.toLocaleString("en-US")}</dd>
            </div>
          </dl>
        </div>

        <figure class="et-summary-ring">
          <svg
            viewBox="0 0 120 120"
            role="img"
            aria-label={`${posts.length} entries across ${tags.length} topics`}
          >
            <circle class="et-ring-track" cx="60" cy="60" r="54" pathLength="100" />
            <circle class="et-ring-track" cx="60" cy="60" r="44" pathLength="100" />
            <circle class="et-ring-track" cx="60" cy="60" r="34" pathLength="100" opacity=".55" />

            {/* one tick per entry — the dial grows as the archive grows */}
            {posts.map((_, index) => (
              <circle
                class="et-ring-tick"
                cx="60"
                cy="60"
                r="54"
                pathLength="100"
                stroke-dasharray="1.7 100"
                stroke-dashoffset={-((index * 100) / Math.max(posts.length, 1))}
                transform={`rotate(${(posts.length * 11) % 360} 60 60)`}
              />
            ))}

            {/* topic share */}
            {ring.map((segment, index) => (
              <circle
                class={`et-ring-arc et-ring-arc-${index}`}
                cx="60"
                cy="60"
                r="44"
                pathLength="100"
                stroke-dasharray={`${Math.max(segment.share - 1.5, 0.5)} ${100 - Math.max(segment.share - 1.5, 0.5)}`}
                stroke-dashoffset={-segment.offset}
              />
            ))}

            {/* one tick per tag applied — denser as entries get tagged */}
            {Array.from({ length: Math.min(tagOccurrences, 48) }).map((_, index) => (
              <circle
                class="et-ring-tag"
                cx="60"
                cy="60"
                r="34"
                pathLength="100"
                stroke-dasharray="0.9 100"
                stroke-dashoffset={-((index * 100) / Math.max(tagOccurrences, 1))}
              />
            ))}
          </svg>
          <figcaption>
            <strong>{posts.length}</strong>
            <span>entries</span>
          </figcaption>
        </figure>

        <ul class="et-summary-legend">
          {ring.map((segment, index) => (
            <li>
              <i class={`et-dot et-dot-${index}`} aria-hidden="true" />
              <span>#{segment.tag}</span>
              <b>{segment.count}</b>
            </li>
          ))}
        </ul>
      </section>

      <div class="et-section-head">
        <h2>Latest entry</h2>
        <a href={resolveRelative(slug, "all-posts" as FullSlug)}>Full chronicle</a>
      </div>
      {renderPostCards(posts.slice(0, 1), slug)}

      {posts.length >= 4 && (
        <>
          <div class="et-section-head">
            <h2>Topics in the ledger</h2>
            <a href={resolveRelative(slug, "topics" as FullSlug)}>All topics</a>
          </div>
          <div class="et-topic-grid">
          {tags.slice(0, 7).map((topic) => (
            <a
              class="et-topic-card"
              href={resolveRelative(slug, `tags/${topic.tag}` as FullSlug)}
            >
              <span class="et-topic-name">#{topic.tag}</span>
              <span class="et-topic-count">
                {topic.count} {topic.count === 1 ? "entry" : "entries"}
              </span>
              <span class="et-bar" aria-hidden="true">
                <span
                  class="et-bar-fill"
                  style={`width:${Math.round((topic.count / maxCount) * 100)}%`}
                />
              </span>
            </a>
          ))}
            <a class="et-topic-card et-topic-cta" href={resolveRelative(slug, "topics" as FullSlug)}>
              All topics →
            </a>
          </div>
        </>
      )}
    </div>
  )
}

export default (() => HomeDashboard) satisfies QuartzComponentConstructor
