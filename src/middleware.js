import { NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });
  if (!token) return NextResponse.redirect(new URL('/', req.url));
  if (pathname.startsWith('/administracion') && !['secretaria', 'director'].includes(token.rol)) {
    return NextResponse.redirect(new URL('/panel/inicio', req.url));
  }
  if (pathname.startsWith('/panel') && token.rol !== 'estudiante') {
    return NextResponse.redirect(new URL('/administracion/inicio', req.url));
  }

  // Redirigir /panel a /panel/inicio
  if (pathname === "/panel") {
    const url = req.nextUrl.clone();
    url.pathname = "/panel/inicio";
    return NextResponse.redirect(url);
  }

  // Redirigir /administracion a /administracion/inicio
  if (pathname === "/administracion") {
    const url = req.nextUrl.clone();
    url.pathname = "/administracion/inicio";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panel/:path*",
    "/administracion/:path*",
  ],
};

// import { withAuth } from "next-auth/middleware"
// import { NextResponse } from "next/server"

// export default withAuth(
//   function middleware(req) {
//     const { pathname } = req.nextUrl
//     const { token } = req.nextauth

//     // Redirigir /panel a /panel/inicio
//     if (pathname === "/panel") {
//       const newUrl = req.nextUrl.clone()
//       newUrl.pathname = "/panel/inicio"
//       return NextResponse.redirect(newUrl)
//     }

//     // Redirigir /administracion a /administracion/inicio
//     if (pathname === "/administracion") {
//       const newUrl = req.nextUrl.clone()
//       newUrl.pathname = "/administracion/inicio"
//       return NextResponse.redirect(newUrl)
//     }

//     // Verificar acceso a rutas de panel (solo estudiantes)
//     if (pathname.startsWith("/panel")) {
//       if (token?.rol !== "estudiante") {
//         const url = req.nextUrl.clone()
//         if (token?.rol === "secretaria" || token?.rol === "director") {
//           url.pathname = '/administracion/inicio'
//         } else {
//           url.pathname = '/'
//         }
//         return NextResponse.redirect(url)
//       }
//     }

//     // Verificar acceso a rutas de administración (solo secretaria/director)
//     if (pathname.startsWith("/administracion")) {
//       if (token?.rol !== "secretaria" && token?.rol !== "director") {
//         const url = req.nextUrl.clone()
//         if (token?.rol === "estudiante") {
//           url.pathname = '/panel/inicio'
//         } else {
//           url.pathname = '/'
//         }
//         return NextResponse.redirect(url)
//       }
//     }

//     return NextResponse.next()
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => {
//         return !!token
//       },
//     },
//   }
// )

// export const config = {
//   matcher: [
//     "/panel/:path*",
//     "/administracion/:path*",
//   ],
// }
