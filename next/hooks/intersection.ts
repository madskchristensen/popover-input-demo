import { MutableRefObject, useEffect } from 'react'

// Hook copied from React Query docs
// see: https://react-query.tanstack.com/examples/load-more-infinite-scroll
// TODO: Could remove and use one from usehooks-ts perhaps?
// TODO: Fix function syntax to object export
export default function useIntersectionObserver({
  target,
  onIntersect,
  enabled,
}: {
  target: MutableRefObject<null>
  onIntersect: () => void
  enabled: boolean | undefined
}) {
  const rootMargin = '300px'
  const threshold = 1.0

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: null,
        rootMargin,
        threshold,
      },
    )
    const el = target && target.current

    if (!el) return
    observer.observe(el)

    return () => observer.unobserve(el)
  }, [enabled, rootMargin, threshold, target, onIntersect])
}
