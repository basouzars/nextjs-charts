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

export function getTableData(tableName: string, page: number = 0, pageSize: number = 100) {
  const db = getDb();
  
  const offset = page * pageSize;
  const rows = db.prepare(`SELECT * FROM "${tableName}" LIMIT ? OFFSET ?`).all(pageSize, offset);
  const countResult = db.prepare(`SELECT COUNT(*) as count FROM "${tableName}"`).get() as { count: number };
  
  return {
    rows,
    total: countResult.count
  };
}

export function getTableColumns(tableName: string): string[] {
  const db = getDb();
  const info = db.prepare(`PRAGMA table_info("${tableName}")`).all() as { name: string }[];
  return info.filter(col => col.name !== 'id').map(col => col.name);
}

export function getChartData(tableName: string, xColumn: string, yColumn: string) {
  const db = getDb();
  
  const rows = db.prepare(`SELECT "${xColumn}", "${yColumn}" FROM "${tableName}" WHERE "${xColumn}" IS NOT NULL AND "${yColumn}" IS NOT NULL`).all();
  
  return rows;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
