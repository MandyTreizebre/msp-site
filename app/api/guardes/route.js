import { NextResponse } from 'next/server'
import GuardsDAL from "../../../server/DAL/GuardsDAL"

export async function GET(req) {
  try {
    // 1. lire la date passée en paramètre : /api/gardes?date=2025-10-14
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    // 2. si aucune date → on prend celle d’aujourd’hui
    const dateISO = date || new Date().toISOString().slice(0, 10)

    // 3. appel du DAL
    const guards = await GuardsDAL.getGuardsByDate(dateISO)

    // 4. réponse JSON
    return NextResponse.json(guards, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la récupération des gardes :', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}