import { getDatabase, Exercise } from "./database";

const getDb = async () => await getDatabase();

export const exerciseQueries = {
  async startExercise(type: string): Promise<number> {
    const db = await getDb();
    const startTime = new Date().toISOString();

    const query = `
     INSERT INTO exercises (
       type, 
       start_time
     ) VALUES (?, ?)
   `;

    const { lastInsertRowId } = await db.runAsync(query, [type, startTime]);
    return lastInsertRowId;
  },

  async finishExercise(
    exerciseId: number,
    duration: number,
    distance: number,
    avgSpeed: number
  ): Promise<void> {
    const db = await getDb();
    const endTime = new Date().toISOString();

    const query = `
     UPDATE exercises
     SET end_time = ?,
         duration = ?,
         distance = ?,
         avg_speed = ?
     WHERE id = ?
   `;

    const params: [string, number, number, number, number] = [
      endTime,
      duration,
      distance,
      avgSpeed,
      exerciseId,
    ];

    await db.runAsync(query, params);
  },

  async getExerciseById(id: number): Promise<Exercise | null> {
    const db = await getDb();

    const query = `
     SELECT *
     FROM exercises
     WHERE id = ?
   `;

    const results = await db.getAllAsync<Exercise>(query, [id]);
    return results[0] || null;
  },

  async getAllExercises(): Promise<Exercise[]> {
    const db = await getDb();

    const query = `
     SELECT *
     FROM exercises
     ORDER BY start_time DESC
   `;

    return db.getAllAsync<Exercise>(query);
  },
};
