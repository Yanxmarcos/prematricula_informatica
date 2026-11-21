import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function currentUser(roles) {
  const session = await getServerSession(authOptions);
  const id = Number(session?.user?.id);
  if (!Number.isSafeInteger(id) || id <= 0 || !session?.sessionToken) return null;

  const active = await prisma.session.findFirst({
    where: { sessionToken: session.sessionToken, usuarioId: id, activa: true, expires: { gt: new Date() } },
    include: { usuario: { select: { id: true, rol: true } } },
  });
  const user = active?.usuario;
  if (!user || (roles && !roles.includes(user.rol))) return null;
  return user;
}

export const unauthorized = () => Response.json({ error: 'No autorizado' }, { status: 401 });
