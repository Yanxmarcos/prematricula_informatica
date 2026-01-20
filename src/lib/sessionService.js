import { prisma } from './prisma'
import { v4 as uuidv4 } from 'uuid'

export class SessionService {
  // Crear nueva sesión al iniciar sesión
  static async createSession(usuarioId, userEmail) {
    try {
      const sessionToken = uuidv4();
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
      
      // Cerrar sesiones anteriores del mismo usuario
      await this.closeAllUserSessions(usuarioId);
      
      const session = await prisma.session.create({
        data: {
          id: uuidv4(),
          sessionToken: sessionToken,
          usuarioId: usuarioId,
          expires: expires,
          activa: true,
          creado_en: new Date(),
        }
      });
      
      // console.log("Sesión creada en BD:", {
      //   usuario: userEmail,
      //   sessionToken: sessionToken,
      //   sessionId: session.id,
      //   expires: expires
      // });
      return sessionToken;
    } catch (error) {
      console.error("Error creando sesión:", error);
      return null;
    }
  }

  // Verificar sesión activa
  static async getActiveSession(sessionToken) {
    return await prisma.session.findFirst({
      where: {
        sessionToken,
        activa: true,
        expires: { gt: new Date() }
      },
      include: {
        usuario: true
      }
    })
  }

  // Cerrar sesión específica
  static async closeSession(sessionToken) {
    try {
      const result = await prisma.session.updateMany({
        where: { 
          sessionToken,
          activa: true 
        },
        data: { 
          activa: false,
          expires: new Date()
        }
      });
      
      // console.log('Sesión cerrada:', {
      //   sessionToken,
      //   updated: result.count
      // });
      
      return result;
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  }

  // Cerrar todas las sesiones de un usuario
  static async closeAllUserSessions(usuarioId) {
    try {
      const result = await prisma.session.updateMany({
        where: { 
          usuarioId,
          activa: true 
        },
        data: { 
          activa: false,
          expires: new Date()
        }
      });
      
      if (result.count > 0) {
        console.log(`Cerradas ${result.count} sesiones anteriores del usuario: ${usuarioId}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error cerrando sesiones anteriores:', error);
      return { count: 0 };
    }
  }

  // Obtener sesiones activas
  static async getActiveSessions() {
    return await prisma.session.findMany({
      where: {
        activa: true,
        expires: { gt: new Date() }
      },
      include: {
        usuario: {
          select: {
            id: true,
            correo_inst: true,
            nombres: true,
            apellido_paterno: true,
            apellido_materno: true,
            rol: true
          }
        }
      },
      orderBy: {
        expires: 'desc'
      }
    })
  }

  // Limpiar sesiones expiradas
  static async cleanExpiredSessions() {
    try {
      const result = await prisma.session.deleteMany({
        where: {
          OR: [
            { expires: { lt: new Date() } },
            { activa: false }
          ]
        }
      })
      return result.count
    } catch (error) {
      console.error('Error limpiando sesiones:', error);
      return 0;
    }
  }
}