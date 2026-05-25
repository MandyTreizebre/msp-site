import { NextResponse } from 'next/server'
import AdminDAL from '../../../../server/DAL/AdminDAL.js'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const professionalId = searchParams.get('professionalId')
    const hours = await AdminDAL.getWeeklyHours(professionalId)
    return NextResponse.json(hours, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { professionalId, weekday, startTime, endTime } = await req.json()
    await AdminDAL.addWeeklyHours(professionalId, weekday, startTime, endTime)
    return NextResponse.json({ message: 'Horaire ajouté' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 })
  }
}