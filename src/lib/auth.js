//src/lib/auth.js
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { SessionService } from "@/lib/sessionService"
import bcrypt from "bcryptjs"

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				codigo: { label: "Código Institucional", type: "text" },
				contraseña: { label: "Contraseña", type: "password" }
			},
			async authorize(credentials) {
				try {
					if (!credentials?.codigo || !credentials?.contraseña) {
						throw new Error("Todos los campos son obligatorios")
					}

					// Buscar usuario por código de estudiante
					const usuario = await prisma.usuario.findUnique({
						where: {
							codigo_estudiante: credentials.codigo
						}
					})

					if (!usuario) {
						throw new Error("Usuario no encontrado")
					}

					const contraseñaValida = usuario.contraseña
						? await bcrypt.compare(credentials.contraseña, usuario.contraseña)
						: false

					if (!contraseñaValida) {
						throw new Error("Contraseña incorrecta")
					}

					// Actualizar último acceso
					await prisma.usuario.update({
						where: { id: usuario.id },
						data: { ultimo_acceso: new Date() }
					})

					// Crear sesión
					const sessionToken = await SessionService.createSession(usuario.id, usuario.correo_inst)

					return {
						id: usuario.id,
						email: usuario.correo_inst,
						name: `${usuario.nombres} ${usuario.apellido_paterno} ${usuario.apellido_materno}`,
						sessionToken: sessionToken,
						rol: usuario.rol,
						codigo_estudiante: usuario.codigo_estudiante,
						necesitaCambioContraseña: false
					}

				} catch (error) {
					console.error("Error en authorize:", error)
					throw new Error(error.message || "Error de autenticación")
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.rol = user.rol
				token.codigo_estudiante = user.codigo_estudiante
				token.sessionToken = user.sessionToken
				token.necesitaCambioContraseña = user.necesitaCambioContraseña
			}

			return token
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id
				session.user.rol = token.rol
				session.user.codigo_estudiante = token.codigo_estudiante
				session.sessionToken = token.sessionToken
				session.user.necesitaCambioContraseña = token.necesitaCambioContraseña
			}
			return session
		}
	},
	events: {
		async signOut({ token }) {
			try {
				if (token?.sessionToken) {
					await SessionService.closeSession(token.sessionToken)
				}
			} catch (error) {
				console.error("Error cerrando sesión en BD:", error)
			}
		}
	},
	pages: {
		signIn: '/',
		signOut: '/',
		error: '/',
	},
	debug: process.env.NODE_ENV === 'development',
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt"
	}
}
