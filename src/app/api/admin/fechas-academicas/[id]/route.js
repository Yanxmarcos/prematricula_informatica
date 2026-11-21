import { currentUser, unauthorized } from '@/lib/authorization';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const authenticatedUser = await currentUser(['secretaria', 'director']);
  if (!authenticatedUser) return unauthorized();
  try {

    const { id } = await params;
    const body = await request.json();
    const { semestre, tipo, fecha_inicio, fecha_fin, activo } = body;

    if (activo) {
      await prisma.fechasAcademicas.updateMany({
        where: { 
          tipo,
          NOT: { id: parseInt(id) }
        },
        data: { activo: false }
      });
    }

    const fechaActualizada = await prisma.fechasAcademicas.update({
      where: { id: parseInt(id) },
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
      data: fechaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar fecha académica:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  const authenticatedUser = await currentUser(['secretaria', 'director']);
  if (!authenticatedUser) return unauthorized();
  try {

    const { id } = await params;

    console.log('Eliminando fecha con ID:', id);

    await prisma.fechasAcademicas.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Fecha académica eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar fecha académica:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}