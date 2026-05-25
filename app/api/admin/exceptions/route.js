import { NextResponse } from 'next/server'
import AdminDAL from '../../../../server/DAL/AdminDAL.js'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const professionalId = searchParams.get('professionalId')
    const exceptions = await AdminDAL.getExceptions(professionalId)
    return NextResponse.json(exceptions, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { professionalId, date, type, note, slots, replacement } = await req.json()
    
    const exceptionDay = await AdminDAL.addException(professionalId, date, type, note)
    
    if (slots && slots.length > 0) {
      for (const slot of slots) {
        await AdminDAL.addExceptionSlot(exceptionDay.id, slot.start, slot.end)
      }
    }

    if (type === 'replacement' && replacement) {
      await AdminDAL.addReplacement(exceptionDay.id, replacement.name, replacement.telephone)
    }

    return NextResponse.json({ message: 'Exception ajoutée' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 })
  }
}