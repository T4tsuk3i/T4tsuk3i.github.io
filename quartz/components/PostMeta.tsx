import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"

const PostMeta: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
  const text = fileData.text
  if (!text) {
    return null
  }

  const category = fileData.frontmatter?.category as string | undefined
  const { minutes } = readingTime(text)

  return (
    <p class={classNames(displayClass, "content-meta", "post-meta")}>
      {fileData.dates && (
        <span class="meta-item">
          <Date date={getDate(cfg, fileData)!} locale={cfg.locale} />
        </span>
      )}
      {category && (
        <>
          <span class="meta-dot" aria-hidden="true">
            ·
          </span>
          <span class="meta-item meta-category">{category}</span>
        </>
      )}
      <span class="meta-dot" aria-hidden="true">
        ·
      </span>
      <span class="meta-item">~{Math.max(1, Math.ceil(minutes))} min read</span>
    </p>
  )
}

export default (() => PostMeta) satisfies QuartzComponentConstructor
