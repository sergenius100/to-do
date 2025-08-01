import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

let db: Database;

export const getDatabase = (): Database => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const initDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database('./todo.db', (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      console.log('Connected to SQLite database');
      
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');
      
      // Create todos table
      const createTodosTable = `
        CREATE TABLE IF NOT EXISTS todos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          completed BOOLEAN DEFAULT FALSE,
          priority TEXT DEFAULT 'medium',
          due_date TEXT,
          category TEXT,
          tags TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.run(createTodosTable, (err) => {
        if (err) {
          console.error('Error creating todos table:', err);
          reject(err);
          return;
        }
        
        console.log('Todos table created successfully');
        resolve();
      });
    });
  });
};

export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          reject(err);
          return;
        }
        console.log('Database connection closed');
        resolve();
      });
    } else {
      resolve();
    }
  });
};