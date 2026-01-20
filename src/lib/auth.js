import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { SessionService } from "@/lib/sessionService"

function separarNombresApellidos(nombreCompleto) {
  if (!nombreCompleto) {
    return {
      nombres: '',
      apellido_paterno: '',
      apellido_materno: ''
    }
  }

  const nombreLimpio = nombreCompleto.trim().replace(/\s+/g, ' ')
  const partes = nombreLimpio.split(' ')
  
  if (partes.length === 0) {
    return {
      nombres: '',
      apellido_paterno: '',
      apellido_materno: ''
    }
  }
  
  if (partes.length === 1) {
    return {
      nombres: partes[0],
      apellido_paterno: '',
      apellido_materno: ''
    }
  }
  
  if (partes.length === 2) {
    return {
      nombres: partes[0],
      apellido_paterno: partes[1],
      apellido_materno: ''
    }
  }
  
  if (partes.length === 3) {
    return {
      nombres: partes[0],
      apellido_paterno: partes[1],
      apellido_materno: partes[2]
    }
  }
  
  const apellido_materno = partes[partes.length - 1]
  const apellido_paterno = partes[partes.length - 2]
  const nombres = partes.slice(0, partes.length - 2).join(' ')
  
  return {
    nombres,
    apellido_paterno,
    apellido_materno
  }
}


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          hd: "unitru.edu.pe"
        }
      }
    }),
  ],
  callbacks: {
async signIn({ user, account, profile }) {
  try {
    console.log("Intento de login con:", user.email)
    
    if (!user.email || !user.email.endsWith("@unitru.edu.pe")) {
      console.log("Acceso denegado - Dominio no permitido:", user.email)
      return false
    }

    const nombreCompleto = user.name || profile?.name || ""
    const { nombres, apellido_paterno, apellido_materno } = separarNombresApellidos(nombreCompleto)

    // console.log("Nombres separados:", {
    //   nombres,
    //   apellido_paterno,
    //   apellido_materno
    // })

    let dbUser = await prisma.usuario.findUnique({
      where: { correo_inst: user.email },
    })

    // console.log("Usuario encontrado en BD:", dbUser)

    if (!dbUser) {

      dbUser = await prisma.usuario.create({
        data: {
          correo_inst: user.email,
          nombres: nombres,
          apellido_paterno: apellido_paterno,
          apellido_materno: apellido_materno,
          imagen_perfil: user.image || profile?.picture,
          rol: "estudiante",
          creado_en: new Date(),
          ultimo_acceso: new Date(),
        },
      })
      // console.log("Nuevo usuario creado:", dbUser.correo_inst, "ID:", dbUser.id)
    } else {

      const updateData = {
        ultimo_acceso: new Date(),
        imagen_perfil: user.image || dbUser.imagen_perfil,
      }
      
      if (!dbUser.nombres || dbUser.nombres.trim() === '') {
        updateData.nombres = nombres
      }
      if (!dbUser.apellido_paterno || dbUser.apellido_paterno.trim() === '') {
        updateData.apellido_paterno = apellido_paterno
      }
      if (!dbUser.apellido_materno || dbUser.apellido_materno.trim() === '') {
        updateData.apellido_materno = apellido_materno
      }
      
      await prisma.usuario.update({
        where: { id: dbUser.id },
        data: updateData
      })
      
      // console.log("Usuario actualizado:", dbUser.correo_inst, "ID:", dbUser.id)
    }

    // console.log("Creando sesión para usuario ID:", dbUser.id);
    const sessionToken = await SessionService.createSession(dbUser.id, user.email);
    
    if (sessionToken) {

      user.sessionToken = sessionToken;
      user.dbId = dbUser.id;
      // console.log("SessionToken asignado a user:", sessionToken);
    } else {
      console.error("NO se pudo crear el sessionToken");
    }
    
    return true
    
  } catch (error) {
    console.error("Error en signIn callback:", error)
    return false
  }
},

    async jwt({ token, user, account, profile, trigger, session }) {

  if (account && user) {
    try {
      // console.log("Buscando usuario para JWT:", user.email)
      const dbUser = await prisma.usuario.findUnique({
        where: { correo_inst: user.email },
      })
      
      if (dbUser) {
        token.id = dbUser.id
        token.rol = dbUser.rol
        token.codigo_estudiante = dbUser.codigo_estudiante
        token.nombres = dbUser.nombres
        token.apellido_paterno = dbUser.apellido_paterno
        token.apellido_materno = dbUser.apellido_materno
        
        if (user.sessionToken) {
          token.sessionToken = user.sessionToken;
          // console.log("SessionToken asignado en JWT:", user.sessionToken);
        } else {
          console.error("user.sessionToken es undefined en jwt callback");
          // Intentar crear la sesión aquí si falló en signIn
          const newSessionToken = await SessionService.createSession(dbUser.id, user.email);
          if (newSessionToken) {
            token.sessionToken = newSessionToken;
            // console.log("SessionToken creado en jwt callback:", newSessionToken);
          }
        }
      }
    } catch (error) {
      console.error("Error en jwt callback:", error)
    }
  }

  if (trigger === "update" && session) {
    return { ...token, ...session }
  }
  
  return token
},

    async session({ session, token }) {
      try {

        if (token) {
          session.user.id = token.id
          session.user.rol = token.rol
          session.user.codigo_estudiante = token.codigo_estudiante
          session.user.nombres = token.nombres
          session.user.apellido_paterno = token.apellido_paterno
          session.user.apellido_materno = token.apellido_materno
          session.sessionToken = token.sessionToken
          
          // console.log("Sesión JWT creada para:", session.user.email)
          // console.log("SessionToken:", token.sessionToken)
        }
        return session
      } catch (error) {
        console.error("Error en session callback:", error)
        return session
      }
    },
  },
  events: {
    async signOut({ token }) {

      try {
        if (token?.sessionToken) {
          await SessionService.closeSession(token.sessionToken);
          // console.log("Sesión cerrada en BD:", token.sessionToken);
        }
      } catch (error) {
        console.error("Error cerrando sesión en BD:", error);
      }
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}