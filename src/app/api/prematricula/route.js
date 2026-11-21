import { currentUser, unauthorized } from '@/lib/authorization';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getHoraPeru() {
  return new Date(Date.now() - 5 * 60 * 60 * 1000);
}

export async function POST(request) {
  const authenticatedUser = await currentUser(['estudiante']);
  if (!authenticatedUser) return unauthorized();
  try {
    const { userId, semestre, anio, tipoMatricula, cursos } = await request.json();

    if (Number(userId) !== authenticatedUser.id || !semestre || !anio || !tipoMatricula || !Array.isArray(cursos) || cursos.length === 0) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar que el semestre sea válido
    if (!['I', 'II'].includes(semestre)) {
      return NextResponse.json(
        { error: 'Semestre inválido. Debe ser I o II' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: authenticatedUser.id }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener el ID del tipo de matrícula
    const tipoMatriculaRecord = await prisma.tipoMatricula.findFirst({
      where: { nombre: tipoMatricula }
    });

    if (!tipoMatriculaRecord) {
      return NextResponse.json(
        { error: 'Tipo de matrícula no encontrado' },
        { status: 404 }
      );
    }

    // Verificar límite de créditos
    const creditosLimite = {
      'Regular': 22,
      'Especial': 12,
      'Excepcional': 26
    };

    // Validar que los cursos existen y calcular créditos
    const codigosCursos = cursos.map(c => c.codigo);
    const cursosData = await prisma.curso.findMany({
      where: {
        codigo: { in: codigosCursos }
      }
    });

    if (new Set(codigosCursos).size !== cursos.length || cursosData.length !== cursos.length) {
      return NextResponse.json(
        { error: 'Algunos cursos no fueron encontrados' },
        { status: 404 }
      );
    }

    const totalCreditos = cursosData.reduce((sum, curso) => sum + curso.creditos, 0);
    
    if (totalCreditos > creditosLimite[tipoMatricula]) {
      return NextResponse.json(
        { 
          error: `Excede el límite de créditos. Total: ${totalCreditos}, Límite: ${creditosLimite[tipoMatricula]}` 
        },
        { status: 400 }
      );
    }

    // Validar número de veces
    for (const curso of cursos) {
      if (!curso.numero_vez || curso.numero_vez < 1 || curso.numero_vez > 4) {
        return NextResponse.json(
          { error: 'Número de vez inválido. Debe estar entre 1 y 4' },
          { status: 400 }
        );
      }
    }

    // Verificar si ya existe una prematrícula para este usuario en este período
    const prematriculaExistente = await prisma.prematricula.findFirst({
      where: {
        id_user: authenticatedUser.id,
        semestre: semestre,
        anio: anio
      }
    });

    if (prematriculaExistente) {
      return NextResponse.json(
        { error: 'Ya existe una prematrícula para este período' },
        { status: 409 }
      );
    }

    const ahoraPeru = getHoraPeru();

    const result = await prisma.$transaction(async (tx) => {
      const nuevaPrematricula = await tx.prematricula.create({
        data: {
          id_user: authenticatedUser.id,
          semestre: semestre,
          anio: anio,
          tipo_de_matricula: tipoMatriculaRecord.id,
          creado: ahoraPeru,
          timestamp: ahoraPeru
        }
      });

      // Crear las relaciones con los cursos incluyendo número de vez
      const cursosPrematricula = cursos.map(curso => ({
        id_prematricula: nuevaPrematricula.id,
        curso_codigo: curso.codigo,
        numero_vez: curso.numero_vez
      }));

      await tx.cursoPrematricula.createMany({
        data: cursosPrematricula
      });

      return nuevaPrematricula;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Prematrícula registrada exitosamente',
        data: {
          id: result.id,
          totalCreditos: totalCreditos,
          totalCursos: cursos.length,
          tipoMatricula: tipoMatricula
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error al crear prematrícula:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request) {
  const authenticatedUser = await currentUser(['estudiante']);
  if (!authenticatedUser) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const semestre = searchParams.get('semestre');
    const anio = searchParams.get('anio');

    if (Number(userId) !== authenticatedUser.id) {
      return NextResponse.json(
        { error: 'Se requiere el ID del usuario' },
        { status: 400 }
      );
    }

    const where = {
      id_user: authenticatedUser.id
    };

    if (semestre) where.semestre = semestre;
    if (anio) where.anio = parseInt(anio);

    const prematriculas = await prisma.prematricula.findMany({
      where: where,
      include: {
        tipo_matricula: true,
        cursos_prematriculados: {
          include: {
            curso: true
          }
        }
      },
      orderBy: {
        creado: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: prematriculas
    });

  } catch (error) {
    console.error('Error al obtener prematrículas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Eliminar prematrícula
export async function DELETE(request) {
  const authenticatedUser = await currentUser(['estudiante']);
  if (!authenticatedUser) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const prematriculaId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!prematriculaId || Number(userId) !== authenticatedUser.id) {
      return NextResponse.json(
        { error: 'Se requiere el ID de la prematrícula y el ID del usuario' },
        { status: 400 }
      );
    }

    // Verificar que la prematrícula pertenece al usuario
    const prematricula = await prisma.prematricula.findFirst({
      where: {
        id: parseInt(prematriculaId),
        id_user: authenticatedUser.id
      }
    });

    if (!prematricula) {
      return NextResponse.json(
        { error: 'Prematrícula no encontrada o no pertenece al usuario' },
        { status: 404 }
      );
    }

    await prisma.prematricula.delete({
      where: { id: parseInt(prematriculaId) }
    });

    return NextResponse.json({
      success: true,
      message: 'Prematrícula eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar prematrícula:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
