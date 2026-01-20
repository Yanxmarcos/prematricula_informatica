import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const data = await request.json();
    const { userId, nombres, apellido_paterno, apellido_materno, codigo_estudiante } = data;

    if (!userId) {
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
        id: parseInt(userId),
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
      data: usuarioActualizado,
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