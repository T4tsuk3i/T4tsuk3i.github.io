import { FullSlug } from "../util/path"
import readingTime from "reading-time"

export type LedgerPost = {
  slug: FullSlug
  title: string
  date?: Date
  category?: string
  tags: string[]
  summary: string
  cover?: string
  minutes: number
}

const POST_ORDER = (a: LedgerPost, b: LedgerPost) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)

function cleanSummary(raw: string | undefined, text: string | undefined): string {
  const source = (raw ?? text ?? "").replace(/!\[[^\]]*\]\([^)]*\)/g, "")
  const plain = source
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
  if (!plain) return ""
  return plain.length > 165 ? `${plain.slice(0, 162).trimEnd()}…` : plain
}

export function getPosts(files: any[]): LedgerPost[] {
  return files
    .filter((f) => {
      if (!f || f.unlisted) return false
      const tags = f.frontmatter?.tags
      return Array.isArray(tags) && tags.length > 0
    })
    .map((f) => {
      const fm = f.frontmatter ?? {}
      const text: string = f.text ?? ""
      return {
        slug: f.slug as FullSlug,
        title: (fm.title as string) ?? (f.slug as string),
        date: f.dates?.modified ?? f.dates?.published,
        category: fm.category as string | undefined,
        tags: (fm.tags as string[]) ?? [],
        summary: cleanSummary(fm.description as string | undefined, text),
        cover: (fm.cover as string | undefined) ?? `./static/images/${f.slug}.jpg`,
        minutes: Math.max(1, Math.ceil(readingTime(text).minutes)),
      } satisfies LedgerPost
    })
    .sort(POST_ORDER)
}

export function getTagCounts(posts: LedgerPost[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function getWordCount(files: any[]): number {
  return files
    .filter((f) => !f.unlisted && Array.isArray(f.frontmatter?.tags) && f.frontmatter.tags.length > 0)
    .reduce((total, f) => total + (f.text ? f.text.trim().split(/\s+/).length : 0), 0)
}
