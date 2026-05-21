/**
 * Picks the section id that best matches the current scroll position.
 * Uses the sticky-tab anchor line: last section (in page order) whose top has passed it.
 */
export function resolveActiveScrollSection(
  sectionIds: readonly string[],
  root: Element | null,
  offsetPx = 96,
): string | null {
  if (typeof window === "undefined") return sectionIds[0] ?? null;

  const useWindow = root == null;
  const rootEl = useWindow ? null : (root as HTMLElement);
  const rootTop = useWindow ? 0 : rootEl!.getBoundingClientRect().top;
  const anchorY = rootTop + offsetPx;

  let activeId: string | null = null;

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= anchorY) activeId = id;
  }

  if (activeId) return activeId;

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const bottom = useWindow ? window.innerHeight : rootTop + rootEl!.clientHeight;
    if (rect.bottom > rootTop && rect.top < bottom) return id;
  }

  const scrollEl = useWindow
    ? document.documentElement
    : (root as HTMLElement);
  const scrollTop = useWindow ? window.scrollY : rootEl!.scrollTop;
  const viewHeight = useWindow ? window.innerHeight : rootEl!.clientHeight;
  const scrollHeight = useWindow
    ? scrollEl.scrollHeight
    : rootEl!.scrollHeight;

  if (scrollTop + viewHeight >= scrollHeight - 48) {
    return sectionIds[sectionIds.length - 1] ?? null;
  }

  return sectionIds[0] ?? null;
}
