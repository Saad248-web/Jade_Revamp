/** Instant shell while marketing routes compile / SSR (skipped on dashboard/login via layout). */
export default function RootLoading() {
  return (
    <div
      className="min-h-[100dvh] bg-[#1A1C1E]"
      aria-busy="true"
      aria-label="Loading page"
    />
  );
}
