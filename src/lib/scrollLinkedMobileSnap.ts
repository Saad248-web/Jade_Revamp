/**
 * Mobile / tablet snap carousel — same contract as Featured Villas §6.
 * Desktop keeps free scroll (`scrollMode="mobileSnapOnly"` is inactive at lg+).
 */

/** Featured §6 baseline — 6 steps (intro + cards + CTA). */
const SNAP_BASELINE_STEP_COUNT = 6;
const SNAP_ZONE_VH = 200;
const SNAP_EXIT_VH = 12;

/** Total pinned section height on mobile for snap carousels. */
export function scrollLinkedMobileSnapHeight(stepCount: number): number {
  const scaledSnap = Math.round(
    SNAP_ZONE_VH * (Math.max(2, stepCount) / SNAP_BASELINE_STEP_COUNT),
  );
  return scaledSnap + SNAP_EXIT_VH;
}

/** Share of vertical scroll used for card snaps; remainder exits to the next section. */
export function scrollLinkedMobileSnapPortion(stepCount: number): number {
  const total = scrollLinkedMobileSnapHeight(stepCount);
  return (total - SNAP_EXIT_VH) / total;
}

/**
 * Cap snapped progress so the carousel rests on the last panel;
 * remaining scroll runway reveals the end CTA overlay.
 */
export function scrollLinkedMobileSnapMaxProgress(
  panelCount: number,
  totalSteps: number,
): number {
  if (totalSteps <= 0 || panelCount <= 0) return 1;
  return Math.min(1, (panelCount - 1) / totalSteps);
}

/** Progress at which the vertical “scroll on” cue appears (Featured parity). */
export function scrollLinkedMobileSnapEndZone(
  panelCount: number,
  totalSteps: number,
): number {
  return scrollLinkedMobileSnapMaxProgress(panelCount, totalSteps) - 0.02;
}
