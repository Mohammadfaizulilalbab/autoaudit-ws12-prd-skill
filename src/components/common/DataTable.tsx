import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowHref: (row: T) => string;
}

/** Tabel yang seluruh barisnya bisa diklik; berubah menjadi kartu di bawah 640px lewat CSS. */
export function DataTable<T>({ caption, columns, rows, rowKey, rowHref }: DataTableProps<T>) {
  const navigate = useNavigate();
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} onClick={() => navigate(rowHref(row))}>
              {columns.map((c) => (
                <td key={c.header} data-label={c.header}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
