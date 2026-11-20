import { Info } from 'lucide-react';
import type { ContinuousAudit } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

/** Panel "Dipakai oleh Continuous Audit" (INTERACTION-SPEC 6.2). `audits` sudah urut nama. */
export function UsagePanel({ audits }: { audits: ContinuousAudit[] }) {
  return (
    <section className="card usage-panel" aria-labelledby="usage-title">
      <div className="panel-title">
        <h3 id="usage-title">Dipakai oleh Continuous Audit</h3>
        <span className="count-pill" aria-label={`${audits.length} audit`}>
          {audits.length}
        </span>
      </div>
      {audits.length === 0 ? (
        <p className="text-small">Prompt ini belum dipakai Continuous Audit mana pun. Audit hanya memakai prompt yang dipilih di pengaturannya.</p>
      ) : (
        <ul className="usage-list">
          {audits.map((a) => (
            <li key={a.id} className="usage-item">
              <div className="usage-item-text">
                <span className="text-strong">{a.name}</span>
                <span className="text-small">{a.schedule}</span>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      )}
      <div className="alert alert-info panel-note">
        <Info size={16} aria-hidden="true" />
        <p>Audit memakai prompt berdasarkan ID. Perubahan isi otomatis dipakai pada jadwal berikutnya.</p>
      </div>
    </section>
  );
}
