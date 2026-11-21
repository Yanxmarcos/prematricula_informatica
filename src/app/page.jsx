// src/app/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
    const [codigo, setCodigo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const { status, data: session } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const callbackUrl = searchParams.get('callbackUrl');

            if (callbackUrl) {
                router.push(callbackUrl);
            } else {
                if (session.user.rol === "secretaria" || session.user.rol === "director") {
                    router.push('/administracion/inicio');
                } else {
                    router.push('/panel/inicio');
                }
            }
        }
    }, [status, session, router, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                codigo,
                contraseña,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error("Error en login:", error);
            setError("Error al iniciar sesión. Intente nuevamente.");
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-xl text-foreground">Cargando Prematrículas Informática...</div>
            </div>
        );
    }

    return (
        <section className="relative z-10 overflow-hidden min-h-screen flex items-center justify-center bg-background px-4 py-8 sm:py-16 md:py-20 lg:py-28">
            <div className="container max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center -mx-2 sm:-mx-4">
                    <div className="w-full px-2 sm:px-4">
                        <div className="shadow-three mx-auto max-w-[500px] rounded-lg bg-card px-4 sm:px-6 py-8 sm:py-10 md:p-[60px] border border-border">
                            {/* Logo y título */}
                            <div className="flex justify-center mb-4 sm:mb-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white shadow-lg shadow-primary/20 flex items-center justify-center border-2 border-primary/20">
                                    <Image
                                        src="/logo_info.webp"
                                        alt="Logo informática UNT"
                                        width={100}
                                        height={100}
                                        className="object-contain w-14 h-14 sm:w-auto sm:h-auto"
                                    />
                                </div>
                            </div>

                            <h3 className="mb-1 sm:mb-2 text-center text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                                Prematrícula Informática
                            </h3>
                            <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base font-medium">
                                Escuela Profesional de Informática - UNT
                            </p>

                            {/* Mensaje de error */}
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Información de acceso */}
                            <div className="bg-primary/10 border-l-4 border-primary p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
                                <p className="text-xs sm:text-sm text-primary font-medium text-center">
                                    Ingresa con tu código institucional y contraseña
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Campo: Código Institucional */}
                                <div className="mb-4 sm:mb-6">
                                    <label
                                        htmlFor="codigo"
                                        className="text-foreground mb-2 sm:mb-3 block text-xs sm:text-sm font-medium"
                                    >
                                        Código Institucional
                                    </label>
                                    <input
                                        type="text"
                                        id="codigo"
                                        name="codigo"
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value)}
                                        placeholder="Ej: 202012345"
                                        className="w-full rounded-lg border border-input bg-background px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Campo: Contraseña */}
                                <div className="mb-4 sm:mb-6">
                                    <label
                                        htmlFor="contraseña"
                                        className="text-foreground mb-2 sm:mb-3 block text-xs sm:text-sm font-medium"
                                    >
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="contraseña"
                                        name="contraseña"
                                        value={contraseña}
                                        onChange={(e) => setContraseña(e.target.value)}
                                        placeholder="Ingresa tu contraseña"
                                        className="w-full rounded-lg border border-input bg-background px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Botón de Login */}
                                <div className="mb-4 sm:mb-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full rounded-lg bg-primary hover:bg-primary/90 px-6 sm:px-9 py-3 sm:py-4 text-sm sm:text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-xs sm:text-sm">Iniciando sesión...</span>
                                            </span>
                                        ) : (
                                            "Iniciar Sesión"
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Información adicional */}
                            <p className="text-muted-foreground text-center text-[10px] sm:text-xs font-medium">
                                <span>
                                    Sistema de Prematrícula - Escuela de Informática
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decoración de fondo */}
            <div className="absolute top-0 left-0 z-[-1]">
                <svg
                    width="1440"
                    height="969"
                    viewBox="0 0 1440 969"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <mask
                        id="mask0_95:1005"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="1440"
                        height="969"
                    >
                        <rect width="1440" height="969" fill="#0a0e1a" />
                    </mask>
                    <g mask="url(#mask0_95:1005)">
                        <path
                            opacity="0.1"
                            d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                            fill="url(#paint0_linear_95:1005)"
                        />
                        <path
                            opacity="0.1"
                            d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                            fill="url(#paint1_linear_95:1005)"
                        />
                    </g>
                    <defs>
                        <linearGradient
                            id="paint0_linear_95:1005"
                            x1="1178.4"
                            y1="151.853"
                            x2="780.959"
                            y2="453.581"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                            id="paint1_linear_95:1005"
                            x1="160.5"
                            y1="220"
                            x2="1099.45"
                            y2="1192.04"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
}