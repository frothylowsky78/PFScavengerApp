import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    message: 'Unlock codes are no longer required. Upload proof to advance to the next clue.'
  })
}
