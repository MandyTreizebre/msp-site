
import { NextResponse } from 'next/server'
import AdminDAL from '../../../../../server/DAL/AdminDAL.js'

export async function DELETE(_req, { params }) {
  try {
    await AdminDAL.deleteWeeklyHours(params.id)
    return NextResponse.json({ message: 'Horaire supprimé' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 })
  }
}