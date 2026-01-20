import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const semestre = searchParams.get('semestre');
    const anio = searchParams.get('anio');
    const tipoMatricula = searchParams.get('tipoMatricula');

    const filtros = {};
    if (semestre) filtros.semestre = semestre;
    if (anio) filtros.anio = parseInt(anio);
    if (tipoMatricula) filtros.tipo_de_matricula = parseInt(tipoMatricula);

    const prematriculas = await prisma.prematricula.findMany({
      where: filtros,
      include: {
        usuario: {
          select: {
            codigo_estudiante: true,
            nombres: true,
            apellido_paterno: true,
            apellido_materno: true,
            correo_inst: true
          }
        },
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
      }
    });

    const estadisticasPorCurso = {};
    const numeroVezPorCurso = {};
    
    prematriculas.forEach(prematricula => {
      prematricula.cursos_prematriculados.forEach(cp => {
        const curso = cp.curso;
        const key = curso.codigo;

        if (!estadisticasPorCurso[key]) {
          estadisticasPorCurso[key] = {
            codigo: curso.codigo,
            nombre: curso.nombre,
            ciclo: curso.ciclo,
            creditos: curso.creditos,
            tipo: curso.tipo,
            departamento: curso.departamento?.nombre || 'Sin departamento',
            total_prematriculados: 0,
            estudiantes: [],
            primera_vez: 0,
            segunda_vez: 0,
            tercera_vez: 0,
            cuarta_vez: 0
          };
          numeroVezPorCurso[key] = {
            primera_vez: 0,
            segunda_vez: 0,
            tercera_vez: 0,
            cuarta_vez: 0
          };
        }

        estadisticasPorCurso[key].total_prematriculados++;
        if (cp.numero_vez === 1) {
          numeroVezPorCurso[key].primera_vez++;
        } else if (cp.numero_vez === 2) {
          numeroVezPorCurso[key].segunda_vez++;
        } else if (cp.numero_vez === 3) {
          numeroVezPorCurso[key].tercera_vez++;
        } else if (cp.numero_vez >= 4) {
          numeroVezPorCurso[key].cuarta_vez++;
        }

        estadisticasPorCurso[key].estudiantes.push({
          codigo: prematricula.usuario.codigo_estudiante,
          nombres: prematricula.usuario.nombres,
          apellido_paterno: prematricula.usuario.apellido_paterno,
          apellido_materno: prematricula.usuario.apellido_materno,
          correo: prematricula.usuario.correo_inst,
          tipo_matricula: prematricula.tipo_matricula.nombre,
          fecha_prematricula: prematricula.creado,
          numero_vez: cp.numero_vez 
        });
      });
    });

    Object.keys(estadisticasPorCurso).forEach(key => {
      estadisticasPorCurso[key].primera_vez = numeroVezPorCurso[key].primera_vez;
      estadisticasPorCurso[key].segunda_vez = numeroVezPorCurso[key].segunda_vez;
      estadisticasPorCurso[key].tercera_vez = numeroVezPorCurso[key].tercera_vez;
      estadisticasPorCurso[key].cuarta_vez = numeroVezPorCurso[key].cuarta_vez;
    });

    const cursosArray = Object.values(estadisticasPorCurso).sort(
      (a, b) => b.total_prematriculados - a.total_prematriculados
    );

    const resumen = {
      total_estudiantes: new Set(prematriculas.map(p => p.id_user)).size,
      total_prematriculas: prematriculas.length,
      total_cursos: cursosArray.length,
      promedio_cursos_por_estudiante: prematriculas.length > 0 
        ? (prematriculas.reduce((sum, p) => sum + p.cursos_prematriculados.length, 0) / prematriculas.length).toFixed(2)
        : 0
    };

    // Estadísticas por ciclo
    const porCiclo = {};
    cursosArray.forEach(curso => {
      if (!porCiclo[curso.ciclo]) {
        porCiclo[curso.ciclo] = {
          ciclo: curso.ciclo,
          total_cursos: 0,
          total_prematriculados: 0
        };
      }
      porCiclo[curso.ciclo].total_cursos++;
      porCiclo[curso.ciclo].total_prematriculados += curso.total_prematriculados;
    });

    // Estadísticas por tipo de curso
    const porTipo = {};
    cursosArray.forEach(curso => {
      if (!porTipo[curso.tipo]) {
        porTipo[curso.tipo] = {
          tipo: curso.tipo,
          total_cursos: 0,
          total_prematriculados: 0
        };
      }
      porTipo[curso.tipo].total_cursos++;
      porTipo[curso.tipo].total_prematriculados += curso.total_prematriculados;
    });

    return NextResponse.json({
      success: true,
      data: {
        resumen,
        cursos: cursosArray,
        por_ciclo: Object.values(porCiclo).sort((a, b) => a.ciclo - b.ciclo),
        por_tipo: Object.values(porTipo),
        top_10_cursos: cursosArray.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}