import { currentUser, unauthorized } from '@/lib/authorization';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const authenticatedUser = await currentUser(['secretaria', 'director']);
  if (!authenticatedUser) return unauthorized();
  try {
    const fechas = await prisma.fechasAcademicas.findMany({
      orderBy: [
        { tipo: 'asc' },
        { fecha_inicio: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: fechas
    });
  } catch (error) {
    console.error('Error al obtener fechas académicas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  const authenticatedUser = await currentUser(['secretaria', 'director']);
  if (!authenticatedUser) return unauthorized();
  try {
    const body = await request.json();
    const { semestre, tipo, fecha_inicio, fecha_fin, activo } = body;

    if (activo) {
      await prisma.fechasAcademicas.updateMany({
        where: { tipo },
        data: { activo: false }
      });
    }

    const nuevaFecha = await prisma.fechasAcademicas.create({
      data: {
        semestre,
        tipo,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        activo
      }
    });

    return NextResponse.json({
      success: true,
      data: nuevaFecha
    });
  } catch (error) {
    console.error('Error al crear fecha académica:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}