import { ReactNode } from "react";

export interface ColumnConfig<T = unknown> {
  key: keyof T | string;
  label: string;
  isChip?: boolean;
  editable?: boolean;
  hidden?: boolean;
  renderCell?: (row: T) => ReactNode;
}

export interface GenericTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  rowKey: keyof T;
  displayField: keyof T;
  title?: string;
  addTitle?: string;
  editTitle?: string;
  onAdd?: (newRow: Record<string, any>) => void;
  onEdit?: (updatedRow: T) => void;
  onDelete?: (row: T) => void;
  readOnly?: boolean;
}
