import { Archive, Pencil, Radio } from 'lucide-react';
import type { AuditStatus, VersionStatus } from '../../types';

const VERSION_ICONS = { Published: Radio, Draft: Pencil, Archived: Archive } as const;

export function StatusBadge({ status }: { status: VersionStatus | AuditStatus }) {
  const Icon = status in VERSION_ICONS ? VERSION_ICONS[status as VersionStatus] : null;
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      {Icon && <Icon size={14} aria-hidden="true" />}
      {status}
    </span>
  );
}
