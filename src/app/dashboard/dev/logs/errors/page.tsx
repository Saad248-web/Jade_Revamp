"use client";

import { AuditLogsViewer } from "@/components/dashboard/AuditLogsViewer";

export default function DevErrorLogsPage() {
  return (
    <AuditLogsViewer
      endpoint="/api/dashboard/dev/logs/errors"
      emptyMessage="No error-tagged audit entries yet."
      actionFilter="errors"
    />
  );
}
