import { getDatabase, Exercise } from "./database";

const getDb = async () => await getDatabase();

export const exerciseQueries = {
  async addExercise(exercise: Omit<Exercise, "id">): Promise<number> {
    const db = await getDb();

    const query = `
      INSERT INTO exercises (
        type,
        start_time,
        end_time,
        duration,
        distance,
        avg_speed
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params: [
      string,
      string,
      string | null,
      number | null,
      number | null,
      number | null,
    ] = [
      exercise.type,
      exercise.start_time,
      exercise.end_time,
      exercise.duration,
      exercise.distance,
      exercise.avg_speed,
    ];

    const { lastInsertRowId } = await db.runAsync(query, params);
    return lastInsertRowId;
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
