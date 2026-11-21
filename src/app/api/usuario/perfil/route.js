import { currentUser, unauthorized } from '@/lib/authorization';
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export async function PUT(request) {
  const authenticatedUser = await currentUser(['estudiante']);
  if (!authenticatedUser) return unauthorized();
  try {
    const data = await request.json();
    const { userId, nombres, apellido_paterno, apellido_materno, codigo_estudiante } = data;

    if (Number(userId) !== authenticatedUser.id) {
      return NextResponse.json(
        { message: "ID de usuario no proporcionado" },
        { status: 400 }
      );
    }

    if (codigo_estudiante && !/^\d+$/.test(codigo_estudiante)) {
       return NextResponse.json(
        { message: "El código de estudiante debe contener solo números" },
        { status: 400 }
      );
    }

    // Actualizar usuario en la BD
    const usuarioActualizado = await prisma.usuario.update({
      where: {
        id: authenticatedUser.id,
      },
      data: {
        nombres: nombres,
        apellido_paterno: apellido_paterno,
        apellido_materno: apellido_materno,
        codigo_estudiante: codigo_estudiante,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: usuarioActualizado.id, nombres: usuarioActualizado.nombres, apellido_paterno: usuarioActualizado.apellido_paterno, apellido_materno: usuarioActualizado.apellido_materno, codigo_estudiante: usuarioActualizado.codigo_estudiante },
      message: "Perfil actualizado correctamente"
    });

  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al actualizar perfil" },
      { status: 500 }
    );
  }
}