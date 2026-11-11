import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { resolveRelative } from "../util/path"

const PostAside: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug!
  const toc = fileData.toc ?? []
  const tags = fileData.frontmatter?.tags as string[] | undefined

  // Only real notes get the reading rail (not the homepage, section pages or About).
  if (!tags || tags.length === 0) {
    return null
  }

  const related = allFiles
    .filter((f) => {
      if (!f.slug || f.slug === slug || f.unlisted) return false
      if (!f.frontmatter?.tags || f.frontmatter?.tags.length === 0) return false
      return true
    })
    .sort((a, b) => {
      const at = (a.dates?.modified ?? a.dates?.published)?.getTime() ?? 0
      const bt = (b.dates?.modified ?? b.dates?.published)?.getTime() ?? 0
      return bt - at
    })
    .slice(0, 3)

  return (
    <aside class={classNames(displayClass, "post-aside")}>
      {toc.length > 0 && (
        <nav class="aside-block" aria-label="On this page">
          <h4 class="aside-title">On this page</h4>
          <ul class="aside-toc">
            {toc.map((entry) => (
              <li class={`toc-depth-${entry.depth}${entry.depth === 3 ? " toc-sub" : ""}`}>
                <a href={`#${entry.slug}`}>{entry.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {related.length > 0 && (
        <div class="aside-block">
          <h4 class="aside-title">Related notes</h4>
          <ul class="aside-related">
            {related.map((post) => (
              <li>
                <a href={resolveRelative(slug, post.slug!)}>
                  {post.frontmatter?.title ?? post.slug}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

export default (() => PostAside) satisfies QuartzComponentConstructor
