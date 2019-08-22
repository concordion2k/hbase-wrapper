export interface IPutItemRequest {
  key: string;
  namespace: string;
  table: string;
  column: string;
  value: string;
}
