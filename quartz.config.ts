import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "ತತ್ವ – 見性 – 여정",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "t4tsuk3i.github.io/blog",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Fraunces",
        body: "Karla",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f7f4ee",
          lightgray: "#ece6db",
          gray: "#857c8f",
          darkgray: "#4b4457",
          dark: "#2b2536",
          secondary: "#7d6b9e",
          tertiary: "#c6a9e8",
          highlight: "rgba(125, 107, 158, 0.12)",
          textHighlight: "rgba(198, 169, 232, 0.25)",
        },
        darkMode: {
          light: "#16131d",
          lightgray: "#221d2c",
          gray: "#8e85a0",
          darkgray: "#cfc7dd",
          dark: "#f4f0f8",
          secondary: "#b79ad8",
          tertiary: "#d9c4f2",
          highlight: "rgba(183, 154, 216, 0.16)",
          textHighlight: "rgba(217, 196, 242, 0.22)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown({ linkHeadings: false }),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
