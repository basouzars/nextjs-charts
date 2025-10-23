import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'uploads.db');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function createTableFromData(tableName: string, data: unknown[][]) {
  const db = getDb();
  
  // Drop table if exists
  db.exec(`DROP TABLE IF EXISTS "${tableName}"`);
  
  if (data.length === 0) {
    throw new Error('No data provided');
  }
  
  // First row is headers
  const headers = data[0] as string[];
  
  // Create table with all columns as TEXT for simplicity
  const columns = headers.map((header, idx) => 
    `"${String(header).replace(/"/g, '""')}" TEXT`
  ).join(', ');
  
  db.exec(`CREATE TABLE "${tableName}" (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns})`);
  
  // Insert data
  if (data.length > 1) {
    const placeholders = headers.map(() => '?').join(', ');
    const stmt = db.prepare(`INSERT INTO "${tableName}" (${headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(', ')}) VALUES (${placeholders})`);
    
    const insertMany = db.transaction((rows: unknown[][]) => {
      for (const row of rows) {
        stmt.run(...row);
      }
    });
    
    insertMany(data.slice(1));
  }
  
  return {
    tableName,
    rowCount: data.length - 1,
    columns: headers
  };
}

function sanitizeIdentifier(identifier: string): string {
  // Only allow alphanumeric characters and underscores
  return identifier.replace(/[^a-zA-Z0-9_]/g, '_');
}

function validateTableExists(db: Database.Database, tableName: string): boolean {
  const sanitized = sanitizeIdentifier(tableName);
  const result = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
  ).get(sanitized) as { name: string } | undefined;
  return result !== undefined;
}

export function getTableData(tableName: string, page: number = 0, pageSize: number = 100) {
  const db = getDb();
  const sanitizedTable = sanitizeIdentifier(tableName);
  
  if (!validateTableExists(db, sanitizedTable)) {
    throw new Error('Table not found');
  }
  
  const offset = page * pageSize;
  const rows = db.prepare(`SELECT * FROM "${sanitizedTable}" LIMIT ? OFFSET ?`).all(pageSize, offset);
  const countResult = db.prepare(`SELECT COUNT(*) as count FROM "${sanitizedTable}"`).get() as { count: number };
  
  return {
    rows,
    total: countResult.count
  };
}

export function getTableColumns(tableName: string): string[] {
  const db = getDb();
  const sanitizedTable = sanitizeIdentifier(tableName);
  
  if (!validateTableExists(db, sanitizedTable)) {
    throw new Error('Table not found');
  }
  
  const info = db.prepare(`PRAGMA table_info("${sanitizedTable}")`).all() as { name: string }[];
  return info.filter(col => col.name !== 'id').map(col => col.name);
}

export function getChartData(tableName: string, xColumn: string, yColumn: string) {
  const db = getDb();
  const sanitizedTable = sanitizeIdentifier(tableName);
  const sanitizedXCol = sanitizeIdentifier(xColumn);
  const sanitizedYCol = sanitizeIdentifier(yColumn);
  
  if (!validateTableExists(db, sanitizedTable)) {
    throw new Error('Table not found');
  }
  
  // Verify columns exist
  const columns = getTableColumns(sanitizedTable);
  if (!columns.includes(sanitizedXCol) || !columns.includes(sanitizedYCol)) {
    throw new Error('Column not found');
  }
  
  const rows = db.prepare(`SELECT "${sanitizedXCol}", "${sanitizedYCol}" FROM "${sanitizedTable}" WHERE "${sanitizedXCol}" IS NOT NULL AND "${sanitizedYCol}" IS NOT NULL`).all();
  
  return rows;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
