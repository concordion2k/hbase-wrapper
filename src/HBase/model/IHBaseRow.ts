export interface IHBaseRow {
  Row: IRow[];
}

export interface IRow {
  key: string;
  Cell: ICell[];
}

export interface ICell {
  column: string;
  timestamp?: number;
  $: string;
}
