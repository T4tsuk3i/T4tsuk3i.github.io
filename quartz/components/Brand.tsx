import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { pathToRoot } from "../util/path"

const Brand: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? "Tattva — Kensho — Journey"
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "brand")}>
      <a class="brand-name" href={baseDir}>
        {title}
      </a>
      <span class="brand-tagline">A notebook about learning</span>
    </div>
  )
}

export default (() => Brand) satisfies QuartzComponentConstructor
