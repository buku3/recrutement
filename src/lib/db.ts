import { createClient } from '@libsql/client';

let dbInstance: ReturnType<typeof createClient> | null = null;

export const getDb = () => {
  if (!dbInstance) {
    dbInstance = createClient({
      url: 'file:local.db',
    });
  }
  return dbInstance;
};

export const initDb = async () => {
  const client = getDb();
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT NOT NULL,
      firstName TEXT NOT NULL,
      dateOfBirth TEXT NOT NULL,
      gender TEXT NOT NULL,
      isAdmin INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      salary TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jobId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (jobId) REFERENCES jobs(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Create admin user if it doesn't exist
  const adminExists = await client.execute({
    sql: 'SELECT * FROM users WHERE username = ?',
    args: ['Admin']
  });

  if (!adminExists.rows.length) {
    await client.execute({
      sql: 'INSERT INTO users (username, password, fullName, firstName, dateOfBirth, gender, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: ['Admin', 'Admin', 'Administrator', 'Admin', '2000-01-01', 'Other', 1]
    });
  }
};