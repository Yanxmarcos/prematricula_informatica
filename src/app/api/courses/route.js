import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
  
    await prisma.$connect();

    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    // console.log('Tablas disponibles:', tables);

    // Prueba
    const courses = await prisma.curso.findMany({
      take: 5
    });

    // Prerrequisitos de prueba
    const prerequisites = await prisma.prerequisito.findMany({
      take: 5
    });

    // Todos los cursos
    const allCourses = await prisma.curso.findMany({
      orderBy: [
        { ciclo: 'asc' },
        { codigo: 'asc' }
      ]
    });

    const allPrerequisites = await prisma.prerequisito.findMany();

    const result = allCourses.map(course => {
      const coursePrereqs = allPrerequisites
        .filter(req => req.curso_codigo === course.codigo)
        .map(req => req.pre_curso_codigo);

      return {
        codigo: course.codigo,
        ciclo: course.ciclo,
        nombre: course.nombre,
        tipo: course.tipo,
        creditos: course.creditos,
        hrs_teoria: course.hrs_teoria,
        hrs_practica: course.hrs_practica,
        hrs_lab: course.hrs_lab,
        dpt_que_atiende: course.dpt_que_atiende,
        prereqCodes: coursePrereqs
      };
    });

    await prisma.$disconnect();
    return NextResponse.json(result);

  } catch (error) {
    console.error('ERROR completo:', error);
    await prisma.$disconnect().catch(console.error);

    return NextResponse.json(
      { 
        error: 'Error al obtener cursos',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : 'Contacta al administrador'
      },
      { status: 500 }
    );
  }
}
