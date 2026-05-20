import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const boardCount = await prisma.board.count()
    const subjectCount = await prisma.subject.count()


    console.log(boardCount);
    console.log(subjectCount);

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      boards: boardCount,
      subjects: subjectCount,
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: String(error) },
      { status: 500 }
    )
  }
}
