import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"

const GraphLink: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  return (
    <a
      class="icon-button graph-link"
      href={resolveRelative(fileData.slug!, "graph" as never)}
      aria-label="Open the graph"
      title="Graph"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="6" cy="6" r="2.4" />
        <circle cx="18" cy="7" r="2.4" />
        <circle cx="12" cy="18" r="2.4" />
        <path d="M8.1 6.9 15.7 6.6" />
        <path d="M7.2 8.2 10.8 15.7" />
        <path d="M16.6 9.2 13.2 15.7" />
      </svg>
    </a>
  )
}

export default (() => GraphLink) satisfies QuartzComponentConstructor
