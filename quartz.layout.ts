import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const HomeBody = Component.ConditionalRender({
  component: Component.HomeDashboard(),
  condition: (props) => props.fileData.slug === "index",
})

const ChronicleBody = Component.ConditionalRender({
  component: Component.PostCards({ limit: 50 }),
  condition: (props) => props.fileData.slug === "all-posts",
})

// Atlas is retired for now — its files are kept. To restore it, uncomment and
// swap it back into `afterBody` in place of HomeGraph.
// const Atlas = Component.ConditionalRender({
//   component: Component.WorldAtlas(),
//   condition: (props) => props.fileData.slug === "index",
// })

const HomeNow = Component.ConditionalRender({
  component: Component.NowPanel(),
  condition: (props) => props.fileData.slug === "index",
})

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.Brand(), Component.Search(), Component.Darkmode()],
  afterBody: [HomeBody, ChronicleBody, HomeNow],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/T4tsuk3i",
      Chronicle: "https://t4tsuk3i.github.io/blog/all-posts",
      About: "https://t4tsuk3i.github.io/blog/about-me",
      RSS: "https://t4tsuk3i.github.io/blog/index.xml",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ spacerSymbol: "/", rootName: "Home", showCurrentPage: true }),
    Component.ArticleTitle(),
    Component.PostMeta(),
    Component.TagList(),
  ],
  left: [Component.GuildSidebar()],
  right: [Component.PostAside()],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ spacerSymbol: "/", rootName: "Home", showCurrentPage: true }),
    Component.ArticleTitle(),
    Component.PostMeta(),
  ],
  left: [Component.GuildSidebar()],
  right: [],
}
