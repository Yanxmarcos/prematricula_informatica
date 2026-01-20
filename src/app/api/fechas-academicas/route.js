import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const fechasAcademicas = await prisma.fechasAcademicas.findMany({
      orderBy: [
        { semestre: 'desc' },
        { tipo: 'asc' }
      ]
    });

    const semestre = fechasAcademicas.find(f => f.tipo === 'semestre' && f.activo);
    const prematricula = fechasAcademicas.find(f => f.tipo === 'prematricula' && f.activo);

    return NextResponse.json({
      success: true,
      data: {
        semestre,
        prematricula
      }
    });

  } catch (error) {
    console.error('Error al obtener fechas académicas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}