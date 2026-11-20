import { formatKb } from '../../utils/format';

export interface FileInfo {
  fileName: string;
  fileSize: number;
}

interface SummaryTableProps {
  pageName: string;
  versionText: string;
  current: FileInfo;
  next: FileInfo;
}

/** Tabel ringkasan "File sekarang" vs "File baru" untuk MODAL-01 dan MODAL-02. */
export function SummaryTable({ pageName, versionText, current, next }: SummaryTableProps) {
  const rows: [string, string, string][] = [
    ['CRM Page', pageName, pageName],
    ['Versi', versionText, versionText],
    ['Nama file', current.fileName, next.fileName],
    ['Ukuran', `${formatKb(current.fileSize)} KB`, `${formatKb(next.fileSize)} KB`],
  ];
  return (
    <table className="summary-table">
      <thead>
        <tr>
          <th scope="col">
            <span className="visually-hidden">Data</span>
          </th>
          <th scope="col">File sekarang</th>
          <th scope="col">File baru</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, before, after]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{before}</td>
            <td>{after}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
