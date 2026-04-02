import {query} from "../db"

class SpecialisationsDAL {
    static async getSpecialisations() {
        try {
            const rows = await query('SELECT * FROM specialisations')
            return rows
        } catch (err) {
            console.error("Erreur lors de la récupération des spécialisations")
            throw new Error("Erreur serveur : Impossible de récupérer les spécialisations")
        }
    }
}

export default SpecialisationsDAL
