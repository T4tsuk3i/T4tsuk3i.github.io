import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { getPosts, LedgerPost } from "./ledger"
import { classNames } from "../util/lang"

type Options = {
  limit?: number
}

const renderPostCards = (posts: LedgerPost[], slug: FullSlug, displayClass?: string) => (  <div class={classNames(displayClass, "et-post-grid")}>
    {posts.map((post) => (
      <article class="et-post-card">
        <a
          class="et-post-cover"
          href={resolveRelative(slug, post.slug)}
          tabIndex={-1}
          aria-hidden="true"
        >
          <img src={post.cover} alt="" loading="lazy" />
          <span class="et-post-frame" aria-hidden="true" />
        </a>
        <div class="et-post-body">
          <div class="et-post-meta">
            {post.date && (
              <time datetime={post.date.toISOString()}>
                {post.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
            {post.category && <span class="et-post-cat">{post.category}</span>}
            <span>{post.minutes} min read</span>
          </div>
          <h3 class="et-post-title">
            <a href={resolveRelative(slug, post.slug)}>{post.title}</a>
          </h3>
          {post.summary && <p class="et-post-summary">{post.summary}</p>}
          <div class="et-tag-row">
            {post.tags.map((tag) => (
              <a class="et-tag" href={resolveRelative(slug, `tags/${tag}` as FullSlug)}>
                #{tag}
              </a>
            ))}
          </div>
        </div>
      </article>
    ))}
  </div>
)

const PostCards: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug!
  return renderPostCards(getPosts(allFiles), slug, displayClass)
}

export default ((opts?: Options) => {
  const limit = opts?.limit
  const Limited: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    const slug = fileData.slug!
    const posts = getPosts(allFiles)
    return renderPostCards(limit ? posts.slice(0, limit) : posts, slug, displayClass)
  }
  return Limited
}) satisfies QuartzComponentConstructor<Options>

export { PostCards, renderPostCards }
