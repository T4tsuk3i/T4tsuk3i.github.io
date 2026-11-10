import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ShareButton: QuartzComponent = () => {
  return (
    <a
      class="share-button"
      href="https://github.com/T4tsuk3i"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open GitHub"
      title="Open GitHub"
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
        <circle cx="18" cy="5" r="2.6" />
        <circle cx="6" cy="12" r="2.6" />
        <circle cx="18" cy="19" r="2.6" />
        <path d="M8.4 10.6 15.6 6.4" />
        <path d="M8.4 13.4 15.6 17.6" />
      </svg>
    </a>
  )
}

export default (() => ShareButton) satisfies QuartzComponentConstructor
