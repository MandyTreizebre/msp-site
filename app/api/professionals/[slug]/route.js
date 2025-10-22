import { NextResponse } from 'next/server'
import ProfessionalsDAL from '../../../../server/DAL/ProfessionalsDAL.js'

export async function GET(_req, { params }) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ message: 'Slug manquant' }, { status: 400 })
    }

    const professionalsBySpe = await ProfessionalsDAL.getBySpecialisationSlug(slug)
    return NextResponse.json(professionalsBySpe, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la récupération des professionnels:', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}
