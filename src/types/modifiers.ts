export interface ColumnModifiers {
  unsigned?: boolean;
  comment?: string;
  charset?: string;
  collation?: string;
  autoIncrement?: boolean;
  first?: boolean;
  after?: string;
  useCurrent?: boolean;
  useCurrentOnUpdate?: boolean;
  storedAs?: string;
  virtualAs?: string;
  invisible?: boolean;
  from?: number;
}
