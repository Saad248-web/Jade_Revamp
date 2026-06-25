"use client";

import { AuditLogsViewer } from "@/components/dashboard/AuditLogsViewer";

export default function DevApiLogsPage() {
  return (
    <AuditLogsViewer
      endpoint="/api/dashboard/dev/logs/api"
      emptyMessage="No audit entries yet."
    />
  );
}
