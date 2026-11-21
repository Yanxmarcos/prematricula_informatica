import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const codigo = process.argv[2];
if (!/^\d{1,11}$/.test(codigo || '')) {
  console.error('Uso: node --env-file=.env.local scripts/set-user-password.mjs CODIGO_ESTUDIANTE');
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  const usuario = await prisma.usuario.findUnique({ where: { codigo_estudiante: codigo } });
  if (!usuario) throw new Error('No se encontró el usuario.');

  const password = randomBytes(24).toString('base64url');
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { contraseña: await bcrypt.hash(password, 12) },
  });
  await prisma.session.updateMany({
    where: { usuarioId: usuario.id, activa: true },
    data: { activa: false, expires: new Date() },
  });
  console.log('Contraseña temporal generada para el usuario indicado. Entrégala por un canal privado:');
  console.log(password);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
