// src/app/panel/layout.jsx
"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useApp } from "@/contexts/AppContext";
import { User, X, Save, AlertCircle, Check } from 'lucide-react';

export default function PanelLayout({ children }) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

	const { userData, appLoading } = useApp();
	const pathname = usePathname();
	const router = useRouter();
	const { data: session, status } = useSession();

	const [profileData, setProfileData] = useState({
		nombres: '',
		apellido_paterno: '',
		apellido_materno: '',
		codigo_estudiante: ''
	});

	useEffect(() => {
		if (userData) {
			setProfileData({
				nombres: userData.nombres || '',
				apellido_paterno: userData.apellido_paterno || '',
				apellido_materno: userData.apellido_materno || '',
				codigo_estudiante: userData.codigo_estudiante || ''
			});
		}
	}, [userData, isProfileModalOpen]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === 'codigo_estudiante') {
			if (/^\d*$/.test(value) && value.length <= 11) {
				setProfileData(prev => ({ ...prev, [name]: value }));
			}
			return;
		}

		if (['nombres', 'apellido_paterno', 'apellido_materno'].includes(name)) {
			if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
				setProfileData(prev => ({ ...prev, [name]: value }));
			}
			return;
		}
	};

	const handleSaveProfile = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		setSaveMessage({ type: '', text: '' });

		try {
			const response = await fetch('/api/usuario/perfil', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: userData.id,
					...profileData
				})
			});

			if (!response.ok) throw new Error('Error al actualizar');

			setSaveMessage({ type: 'success', text: '¡Datos actualizados correctamente!' });

			setTimeout(() => {
				setIsProfileModalOpen(false);
				setSaveMessage({ type: '', text: '' });
				window.location.reload();
			}, 1500);

		} catch (error) {
			setSaveMessage({ type: 'error', text: 'Hubo un error al guardar los cambios.' });
		} finally {
			setIsSaving(false);
		}
	};

	if (status === "loading" || appLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-2xl font-bold text-foreground">Cargando...</div>
			</div>
		);
	}

	if (status === "unauthenticated") return null;

	const getActiveTab = () => {
		if (pathname === "/panel/inicio") return "inicio";
		if (pathname === "/panel/prematriculas") return "prematricula";
		if (pathname === "/panel/historial") return "historial";
		return "inicio";
	};

	const active = getActiveTab();

	return (
		<div className="bg-background min-h-screen text-foreground relative transition-all duration-300">
			{/* Header y Nav juntos - sin espacio */}
			<header className="sticky top-0 z-50 border-b border-border backdrop-blur bg-card/80 transition-all duration-300">
				<div className="max-w-7xl mx-auto flex justify-between items-center px-2 sm:px-4 py-1">
					<div className="flex items-center space-x-2 sm:space-x-3">
						<div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center animate-soft-bounce">
							<img src="/logo_info.webp" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12" />
						</div>
						<div>
							<h1 className="text-base sm:text-2xl font-bold text-foreground drop-shadow transition-colors duration-300">
								Prematrícula Informática
							</h1>
							<p className="text-xs text-primary transition-colors duration-300 font-bold hidden sm:block">
								Escuela Profesional de Informática - UNT
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-4 sm:space-x-6 pr-2 sm:pr-6">
						{/* Espacio para futuros botones */}
					</div>
				</div>

				{/* Navbar - Dentro del mismo header, pegado abajo */}
				<nav className="border-t border-border/50">
					<div className="max-w-7xl mx-auto flex justify-between items-center px-2 sm:px-0">
						<div className="flex overflow-x-auto">
							{[
								{ id: "inicio", label: "Inicio", path: "/panel/inicio", icon: (
									<svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
										<path d="M9 22V12h6v10" />
									</svg>
								)},
								{ id: "prematricula", label: "Prematrícula", path: "/panel/prematriculas", icon: (
									<svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
										<path d="M14 2v6h6" />
										<path d="M16 13H8" />
										<path d="M16 17H8" />
										<path d="M10 9H8" />
									</svg>
								)},
								{ id: "historial", label: "Historial", path: "/panel/historial", icon: (
									<svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
									</svg>
								)}
							].map((item) => (
								<a
									key={item.id}
									href={item.path}
									className={`relative px-2 sm:px-6 py-2 sm:py-3 font-medium transition-all flex items-center group text-xs sm:text-base whitespace-nowrap
										${active === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}
									`}
								>
									{item.icon}
									<span className="hidden sm:inline">{item.label}</span>
									<span className="sm:hidden">{item.id === "inicio" ? "Inicio" : item.id === "prematricula" ? "Matrícula" : "Historial"}</span>
									<span className={`absolute bottom-0 left-0 right-0 h-0.5 transition-transform ${active === item.id ? "bg-primary scale-x-100" : "bg-primary scale-x-0 group-hover:scale-x-100"}`} />
								</a>
							))}
						</div>

						{/* Usuario y Dropdown - Responsive */}
						<div className="flex items-center space-x-2 sm:space-x-6 pr-2 sm:pr-6">
							<div className="text-right hidden sm:block">
								<p className="text-sm font-semibold text-foreground transition-colors duration-300 truncate max-w-[120px] md:max-w-[200px]">
									{userData?.nombres && userData?.apellido_paterno
										? `${userData.nombres} ${userData.apellido_paterno} ${userData.apellido_materno || ''}`
										: session?.user?.name || "Usuario"
									}
								</p>
								<p className="text-xs text-muted-foreground capitalize transition-colors duration-300">
									{userData?.rol || "Estudiante"}
								</p>
							</div>
							<div className="relative group">
								<button
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transform transition hover:scale-110 hover:rotate-6 bg-gradient-to-br from-primary to-indigo-600"
								>
									{session?.user?.image ? (
										<img src={session.user.image} alt="Foto de perfil" className="w-full h-full object-cover rounded-full" />
									) : (
										<svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
										</svg>
									)}
								</button>

								{isDropdownOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-xl border border-border z-[100] transition-all duration-200">
										<div className="py-1">
											<button
												onClick={() => { setIsDropdownOpen(false); setIsProfileModalOpen(true); }}
												className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-200"
											>
												<User className="w-4 h-4 mr-3" />
												Mi cuenta
											</button>
											<hr className="border-border" />
											<button
												onClick={() => signOut({ callbackUrl: "/" })}
												className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors duration-200"
											>
												<svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
												</svg>
												Cerrar Sesión
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</nav>
			</header>

			<main className="max-w-7xl mx-auto px-2 sm:px-4 pt-4 sm:pt-6 pb-8">
				{children}
			</main>

			{/* MODAL DE MI CUENTA - Responsive */}
			{isProfileModalOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
					<div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border transform transition-all">

						<div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
							<h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
								<User className="w-5 h-5 text-primary" />
								Mi Perfil
							</h3>
							<button
								onClick={() => setIsProfileModalOpen(false)}
								className="p-1 rounded-full transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="p-4 sm:p-6 space-y-6">
							<div className="flex flex-col items-center justify-center">
								<div className="w-24 h-24 rounded-full p-1 border-4 border-primary/20 mb-3">
									{session?.user?.image ? (
										<img src={session.user.image} alt="Perfil" className="w-full h-full object-cover rounded-full" />
									) : (
										<div className="w-full h-full rounded-full flex items-center justify-center bg-muted">
											<User className="w-10 h-10 text-muted-foreground" />
										</div>
									)}
								</div>
								<span className="text-xs px-3 py-1 rounded-full font-medium bg-muted text-muted-foreground">
									Foto de Google
								</span>
							</div>

							<form onSubmit={handleSaveProfile} className="space-y-4">
								<div className="grid grid-cols-1 gap-4">
									<div>
										<label className="block text-xs font-bold mb-1 ml-1 uppercase text-muted-foreground">Nombres</label>
										<input
											type="text"
											name="nombres"
											value={profileData.nombres}
											onChange={handleInputChange}
											placeholder="Ingrese sus nombres"
											className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all focus:bg-card text-foreground"
											required
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-xs font-bold mb-1 ml-1 uppercase text-muted-foreground">Apellido Paterno</label>
											<input
												type="text"
												name="apellido_paterno"
												value={profileData.apellido_paterno}
												onChange={handleInputChange}
												placeholder="Apellido Paterno"
												className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all focus:bg-card text-foreground"
												required
											/>
										</div>
										<div>
											<label className="block text-xs font-bold mb-1 ml-1 uppercase text-muted-foreground">Apellido Materno</label>
											<input
												type="text"
												name="apellido_materno"
												value={profileData.apellido_materno}
												onChange={handleInputChange}
												placeholder="Apellido Materno"
												className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all focus:bg-card text-foreground"
											/>
										</div>
									</div>

									<div>
										<label className="block text-xs font-bold mb-1 ml-1 uppercase text-muted-foreground">Código de Estudiante</label>
										<div className="relative">
											<input
												type="text"
												name="codigo_estudiante"
												value={profileData.codigo_estudiante}
												onChange={handleInputChange}
												placeholder="Ej: 1052701921"
												maxLength={10}
												className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all font-mono tracking-wide focus:bg-card text-foreground"
												required
											/>
											<div className="absolute right-3 top-2.5">
												<span className="text-xs text-muted-foreground font-mono">{profileData.codigo_estudiante.length}/10</span>
											</div>
										</div>
									</div>

									<div>
										<label className="block text-xs font-bold mb-1 ml-1 uppercase text-muted-foreground">
											Correo Institucional
										</label>
										<input
											type="text"
											value={userData?.correo_inst || session?.user?.email || ''}
											disabled
											className="w-full px-4 py-2 rounded-lg border opacity-60 cursor-not-allowed bg-muted/30 border-input text-muted-foreground"
										/>
									</div>
								</div>

								{saveMessage.text && (
									<div className={`p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${
										saveMessage.type === 'success'
											? 'bg-green-500/20 text-green-400 border border-green-500/30'
											: 'bg-red-500/20 text-red-400 border border-red-500/30'
									}`}>
										{saveMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
										{saveMessage.text}
									</div>
								)}

								<div className="pt-2 flex gap-3">
									<button
										type="button"
										onClick={() => setIsProfileModalOpen(false)}
										disabled={isSaving}
										className="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors bg-muted hover:bg-muted/80 text-foreground"
									>
										Cancelar
									</button>
									<button
										type="submit"
										disabled={isSaving}
										className={`flex-1 px-4 py-2 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
											isSaving
												? 'bg-primary/50 cursor-not-allowed'
												: 'bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 transform hover:scale-[1.02]'
										}`}
									>
										{isSaving ? (
											<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										) : (
											<>
												<Save className="w-4 h-4" />
												Guardar
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{isDropdownOpen && (
				<div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
			)}
		</div>
	);
}