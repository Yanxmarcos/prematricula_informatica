import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const periodosActivos = await prisma.fechasAcademicas.findMany({
      where: {
        tipo: 'prematricula',
        activo: true
      },
      select: {
        semestre: true,
        fecha_inicio: true,
        fecha_fin: true
      },
      orderBy: {
        fecha_inicio: 'desc'
      }
    });

    const periodosFormateados = periodosActivos.map(periodo => periodo.semestre);

    return NextResponse.json({
      success: true,
      data: periodosFormateados
    });

  } catch (error) {
    console.error('Error al obtener períodos académicos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}