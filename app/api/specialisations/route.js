import SpecialisationsDAL from '../../../server/DAL/SpecialisationsDAL.js'

import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const specialisations = await SpecialisationsDAL.getSpecialisations()
    return NextResponse.json(specialisations, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la récupération des spécialisations:', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}
