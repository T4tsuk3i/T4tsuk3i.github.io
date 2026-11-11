import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { getPosts, getTagCounts } from "./ledger"

const W = 1000
const H = 560
const CX = W / 2
const CY = H / 2

const KnowledgeGraph: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const slug = fileData.slug!
  const posts = getPosts(allFiles)
  const tags = getTagCounts(posts)

  const tagRadius = { x: 235, y: 150 }
  const postRadius = { x: 405, y: 250 }

  const tagNodes = tags.map((tag, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(tags.length, 1)) * Math.PI * 2
    return {
      ...tag,
      x: CX + Math.cos(angle) * tagRadius.x,
      y: CY + Math.sin(angle) * tagRadius.y,
      angle,
    }
  })

  const postNodes = posts.map((post, index) => {
    const angle = -Math.PI / 2 + ((index + 0.5) / Math.max(posts.length, 1)) * Math.PI * 2
    return {
      ...post,
      x: CX + Math.cos(angle) * postRadius.x,
      y: CY + Math.sin(angle) * postRadius.y,
    }
  })

  const tagIndex = new Map(tagNodes.map((t) => [t.tag, t]))

  const postEdges = postNodes.flatMap((post) =>
    post.tags
      .map((tag) => tagIndex.get(tag))
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
      .map((tag) => {
        const mx = (post.x + tag.x) / 2
        const my = (post.y + tag.y) / 2
        const bend = 18
        return {
          d: `M${tag.x.toFixed(1)} ${tag.y.toFixed(1)} Q${(mx + bend).toFixed(1)} ${(my - bend).toFixed(1)} ${post.x.toFixed(1)} ${post.y.toFixed(1)}`,
        }
      }),
  )

  const tagEdges = tagNodes.map((tag) => {
    const mx = (tag.x + CX) / 2
    const my = (tag.y + CY) / 2
    return { d: `M${CX} ${CY} Q${mx.toFixed(1)} ${my.toFixed(1)} ${tag.x.toFixed(1)} ${tag.y.toFixed(1)}` }
  })

  return (
    <section class="et-kg" aria-label="Knowledge graph">
      <div class="et-kg-head">
        <h2 class="et-kg-title">Graph view</h2>
        <span class="et-kg-meta">
          {posts.length} notes · {tags.length} topics
        </span>
      </div>

      <div class="et-kg-canvas">
        <svg viewBox={`0 0 ${W} ${H}`} class="et-kg-svg" role="img" aria-label="Graph of notes and topics">
          <g class="et-kg-edges">
            {tagEdges.map((edge) => (
              <path class="kg-edge kg-edge-hub" d={edge.d} />
            ))}
            {postEdges.map((edge) => (
              <path class="kg-edge" d={edge.d} />
            ))}
          </g>

          <a class="kg-node kg-center" href={resolveRelative(slug, "index" as FullSlug)}>
            <circle class="kg-dot" cx={CX} cy={CY} r="26" />
            <circle class="kg-halo" cx={CX} cy={CY} r="34" />
            <text class="kg-label kg-label-center" x={CX} y={CY + 4} text-anchor="middle">
              ತತ್ವ
            </text>
          </a>

          {tagNodes.map((tag) => (
            <a
              class="kg-node kg-tag"
              href={resolveRelative(slug, `tags/${tag.tag}` as FullSlug)}
            >
              <circle class="kg-dot" cx={tag.x} cy={tag.y} r="7" />
              <text
                class="kg-label"
                x={tag.x + (tag.x >= CX ? 14 : -14)}
                y={tag.y + 4}
                text-anchor={tag.x >= CX ? "start" : "end"}
              >
                #{tag.tag}
              </text>
            </a>
          ))}

          {postNodes.map((post) => (
            <a class="kg-node kg-post" href={resolveRelative(slug, post.slug)}>
              <circle class="kg-dot" cx={post.x} cy={post.y} r="10" />
              <text
                class="kg-label kg-label-post"
                x={post.x}
                y={post.y + 26}
                text-anchor="middle"
              >
                {post.title}
              </text>
            </a>
          ))}
        </svg>
      </div>
    </section>
  )
}

export default (() => KnowledgeGraph) satisfies QuartzComponentConstructor
