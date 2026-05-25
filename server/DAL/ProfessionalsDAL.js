import { query } from "../db" 

class ProfessionalsDAL {
  static async getBySpecialisationSlug(slug) {
    try {
      const sql = `
        SELECT
          p.id, p.name, p.telephone, p.address,
          COALESCE(
            json_agg(
              json_build_object(
                'weekday', wh.weekday,
                'start', to_char(wh.start_time, 'HH24:MI'),
                'end',   to_char(wh.end_time,   'HH24:MI')
              )
              ORDER BY wh.weekday, wh.start_time
            ) FILTER (WHERE wh.id IS NOT NULL),
            '[]'
          ) AS weekly_hours
        FROM professionals p
        JOIN specialisations s ON s.id = p.specialisation_id
        LEFT JOIN weekly_hours wh ON wh.professional_id = p.id
        WHERE s.slug = $1
        GROUP BY p.id
        ORDER BY p.name
      ` 
      const result = await query(sql, [slug]) 
      return await query(sql, [slug]) 
    } catch (err) {
      console.error("Erreur lors de la récupération des professionnels :", err) 
      throw new Error("Erreur serveur : Impossible de récupérer les professionnels") 
    }
  }
}

export default ProfessionalsDAL 
