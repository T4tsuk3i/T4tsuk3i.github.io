import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, joinSegments, pathToRoot, resolveRelative } from "../util/path"

const SiteNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug!
  return (
    <nav class="site-nav" aria-label="Primary">
      <a href={resolveRelative(slug, "all-posts" as FullSlug)}>Writing</a>
      <a href={resolveRelative(slug, "about-me" as FullSlug)}>About</a>
      <a href={joinSegments(pathToRoot(slug), "index.xml")}>RSS</a>
      <a href="https://github.com/T4tsuk3i" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </nav>
  )
}

export default (() => SiteNav) satisfies QuartzComponentConstructor
