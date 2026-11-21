import { currentUser, unauthorized } from '@/lib/authorization';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const authenticatedUser = await currentUser(['secretaria', 'director']);
  if (!authenticatedUser) return unauthorized();
  try {
    // Obtener semestres y años únicos
    const prematriculas = await prisma.prematricula.findMany({
      select: {
        semestre: true,
        anio: true
      },
      distinct: ['semestre', 'anio'],
      orderBy: [
        { anio: 'desc' },
        { semestre: 'asc' }
      ]
    });

    // Obtener tipos de matrícula
    const tiposMatricula = await prisma.tipoMatricula.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });

    // Agrupar por período
    const periodos = prematriculas.map(p => ({
      semestre: p.semestre,
      anio: p.anio,
      label: `${p.anio}-${p.semestre}`
    }));

    return NextResponse.json({
      success: true,
      data: {
        periodos,
        tipos_matricula: tiposMatricula
      }
    });

  } catch (error) {
    console.error('Error al obtener filtros:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}