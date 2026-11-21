import { currentUser, unauthorized } from '@/lib/authorization';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const authenticatedUser = await currentUser(['estudiante']);
  if (!authenticatedUser) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (Number(userId) !== authenticatedUser.id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del usuario' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: authenticatedUser.id }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const prematriculas = await prisma.prematricula.findMany({
      where: {
        id_user: authenticatedUser.id
      },
      include: {
        tipo_matricula: true,
        cursos_prematriculados: {
          include: {
            curso: {
              include: {
                departamento: true
              }
            }
          }
        }
      },
      orderBy: [
        { anio: 'desc' },
        { semestre: 'desc' },
        { creado: 'desc' }
      ]
    });

    const historialFormateado = prematriculas.map(prematricula => {
      const cursos = prematricula.cursos_prematriculados.map(cp => ({
        codigo: cp.curso.codigo,
        nombre: cp.curso.nombre,
        ciclo: cp.curso.ciclo,
        tipo: cp.curso.tipo,
        creditos: cp.curso.creditos,
        hrs_teoria: cp.curso.hrs_teoria,
        hrs_practica: cp.curso.hrs_practica,
        hrs_lab: cp.curso.hrs_lab,
        numero_vez: cp.numero_vez,
        departamento: cp.curso.departamento?.nombre || 'N/A'
      }));

      const totalCreditos = cursos.reduce((sum, curso) => sum + curso.creditos, 0);

      return {
        id: prematricula.id,
        semestre: prematricula.semestre,
        anio: prematricula.anio,
        tipoMatricula: prematricula.tipo_matricula.nombre,
        fechaCreacion: prematricula.creado,
        cursos: cursos,
        totalCreditos: totalCreditos,
        totalCursos: cursos.length
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        usuario: {
          id: usuario.id,
          nombres: usuario.nombres,
          apellido_paterno: usuario.apellido_paterno,
          apellido_materno: usuario.apellido_materno,
          codigo_estudiante: usuario.codigo_estudiante,
          correo_inst: usuario.correo_inst
        },
        prematriculas: historialFormateado
      }
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}