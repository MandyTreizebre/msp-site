import { NextResponse } from 'next/server'
import AvailabilityDAL from '../../../server/DAL/AvailabilityDAL.js'

export async function GET() {
  try {
    const available = await AvailabilityDAL.getAvailableToday()
    return NextResponse.json(available, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}