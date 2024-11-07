import * as SQLite from "expo-sqlite";

export interface Exercise {
  id: number;
  type: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  distance: number | null;
  avg_speed: number | null;
}

export interface RoutePoint {
  exercise_id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
}

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("app.db");
  }
  return dbInstance;
};

const CREATE_EXERCISES_TABLE = `
 CREATE TABLE IF NOT EXISTS exercises (
   id INTEGER PRIMARY KEY NOT NULL,
   type TEXT NOT NULL,
   start_time TEXT NOT NULL,
   end_time TEXT,
   duration INTEGER,
   distance REAL,
   avg_speed REAL
 )
`;

const CREATE_ROUTE_POINTS_TABLE = `
 CREATE TABLE IF NOT EXISTS route_points (
   exercise_id INTEGER,
   timestamp TEXT NOT NULL,
   latitude REAL NOT NULL,
   longitude REAL NOT NULL,
   FOREIGN KEY (exercise_id) REFERENCES exercises(id)
 )
`;

export const initDB = async () => {
  try {
    const db = await getDatabase();

    await db.execAsync(`
     PRAGMA journal_mode=WAL;
     ${CREATE_EXERCISES_TABLE};
     ${CREATE_ROUTE_POINTS_TABLE};
   `);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// can be used to wipe the database
export const clearDatabase = async () => {
  try {
    const db = await getDatabase();
    await db.runAsync("DROP TABLE IF EXISTS route_points");
    await db.runAsync("DROP TABLE IF EXISTS exercises");
    await initDB();
    console.log("Database cleared successfully");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
};
