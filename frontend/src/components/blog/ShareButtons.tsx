interface ShareButtonsProps {
  title: string
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const shareOnTwitter = () => {
    const text = encodeURIComponent(title)
    const url = encodeURIComponent(currentUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank'
    )
  }

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(currentUrl)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank'
    )
  }

  const shareGeneral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: currentUrl })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      await navigator.clipboard.writeText(currentUrl)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600">Share:</span>
      <button
        onClick={shareOnTwitter}
        className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
        aria-label="Share on Twitter"
      >
        <i className="bi bi-twitter-x"></i>
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
        aria-label="Share on LinkedIn"
      >
        <i className="bi bi-linkedin"></i>
      </button>
      <button
        onClick={shareGeneral}
        className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity"
        aria-label="Share"
      >
        <i className="bi bi-share"></i>
      </button>
    </div>
  )
}
