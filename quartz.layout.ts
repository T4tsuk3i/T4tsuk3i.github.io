import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.Flex({
      components: [
        { Component: Component.Brand(), basis: "240px", shrink: false },
        { Component: Component.SiteNav(), grow: true },
        { Component: Component.Search() },
        { Component: Component.ShareButton() },
      ],
      gap: "1.2rem",
      wrap: "wrap",
    }),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/T4tsuk3i",
      "All Posts": "https://t4tsuk3i.github.io/blog/all-posts",
      RSS: "https://t4tsuk3i.github.io/blog/index.xml",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle(), Component.ContentMeta(), Component.TagList()],
  left: [],
  right: [],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle(), Component.ContentMeta()],
  left: [],
  right: [],
}
