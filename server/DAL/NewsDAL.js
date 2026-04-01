import _default from "next/dist/shared/lib/runtime-config.external"
import {query} from "../db"

class NewsDAL {
    static async getNews() {
        try {
            const rows = await query('SELECT * FROM news')
            return rows
        } catch (err) {
            console.error("Erreur lors de la récupération des actualités")
            throw new Error("Erreur serveur : Impossible de récupérer les actualités")
        }
    }
}

export default NewsDAL
