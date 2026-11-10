import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "ತತ್ವ – 見性 – 여정",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
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
        header: "Lora",
        body: "DM Sans",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f5f0e8",
          lightgray: "#e8e0d0",
          gray: "#b5a898",
          darkgray: "#4a3f35",
          dark: "#2c2018",
          secondary: "#8b5e3c",
          tertiary: "#c4845a",
          highlight: "rgba(139, 94, 60, 0.10)",
          textHighlight: "rgba(196, 132, 90, 0.25)",
        },
        darkMode: {
          light: "#1e1a15",
          lightgray: "#2e2820",
          gray: "#6b5c4e",
          darkgray: "#d4c5b0",
          dark: "#f0e6d6",
          secondary: "#c4845a",
          tertiary: "#e8a87c",
          highlight: "rgba(196, 132, 90, 0.15)",
          textHighlight: "rgba(196, 132, 90, 0.25)",
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
      Plugin.GitHubFlavoredMarkdown(),
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