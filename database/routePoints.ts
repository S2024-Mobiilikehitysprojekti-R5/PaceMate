import { getDatabase, RoutePoint } from "./database";

const getDb = async () => await getDatabase();

export const routePointQueries = {
  async insertRoutePoints(
    exerciseId: number,
    routePoints: RoutePoint[]
  ): Promise<void> {
    const db = await getDb();

    const query = `
     INSERT INTO route_points (
       exercise_id,
       timestamp,
       latitude,
       longitude
     ) VALUES (?, ?, ?, ?)
   `;

    try {
      for (const routePoint of routePoints) {
        const params: [number, string, number, number] = [
          exerciseId,
          routePoint.timestamp,
          routePoint.latitude,
          routePoint.longitude,
        ];

        await db.runAsync(query, params);
      }
    } catch (error) {
      console.error("Error inserting route points:", error);
      throw error;
    }
  },

  async getRoutePointsByExerciseId(exerciseId: number): Promise<RoutePoint[]> {
    const db = await getDb();

    const query = `
     SELECT *
     FROM route_points
     WHERE exercise_id = ?
     ORDER BY timestamp
   `;

    try {
      return await db.getAllAsync<RoutePoint>(query, [exerciseId]);
    } catch (error) {
      console.error("Error getting route points:", error);
      throw error;
    }
  },
};
