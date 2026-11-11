import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"

const Brand: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? "Tattva — Kensho — Journey"
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class="et-brand">
      <a class="et-brand-link" href={baseDir} aria-label={title}>
        <span class="et-crest" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4">
            <path d="M20 2 38 20 20 38 2 20Z" />
            <path d="M20 9 31 20 20 31 9 20Z" stroke-width="1" opacity=".7" />
            <circle cx="20" cy="20" r="3.4" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span class="et-brand-copy">
          <span class="et-brand-name">{title}</span>
          <span class="et-brand-tagline">Adventurer&rsquo;s Ledger</span>
        </span>
      </a>
    </div>
  )
}

export default (() => Brand) satisfies QuartzComponentConstructor
