export interface ExcelRow {
  [key: string]: string | number | Date | null | undefined;
}

export type ExcelData = ExcelRow[];
