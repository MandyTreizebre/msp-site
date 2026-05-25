import { NextResponse } from 'next/server'
import AdminDAL from '../../../../server/DAL/AdminDAL.js'

export async function GET() {
  try {
    const pros = await AdminDAL.getAllProfessionals()
    return NextResponse.json(pros, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 })
  }
}