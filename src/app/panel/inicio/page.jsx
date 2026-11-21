// src/app/panel/inicio/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useApp } from '@/contexts/AppContext';
import { Calendar, Clock, BookOpen, Users, Award, ChevronRight, ExternalLink } from 'lucide-react';

export default function InicioPage() {
	const { userData } = useApp();
	const [fechasAcademicas, setFechasAcademicas] = useState({
		semestre: null,
		prematricula: null
	});
	const [loading, setLoading] = useState(true);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const images = [
		"/Informatica-Logo-Grande.jpg",
		"/Imagen2.jpg",
		"/Imagen3.jpg",
		"/Imagen4.jpg",
		"/Imagen5.jpg"
	];

	const fetchFechasAcademicas = async () => {
		try {
			const response = await fetch('/api/fechas-academicas');
			const data = await response.json();

			if (data.success) {
				setFechasAcademicas(data.data);
			}
		} catch (error) {
			console.error('Error fetching academic dates:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFechasAcademicas();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) =>
				prevIndex === images.length - 1 ? 0 : prevIndex + 1
			);
		}, 5000);

		return () => clearInterval(interval);
	}, [images.length]);

	const goToImage = (index) => {
		setCurrentImageIndex(index);
	};

	const formatFecha = (fecha) => {
		if (!fecha) return 'No definida';
		const date = new Date(fecha);
		return date.toLocaleDateString('es-ES', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-lg text-muted-foreground">Cargando fechas académicas...</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Hero / Bienvenida */}
			<section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6 md:p-8 lg:p-10">
				<div className="relative z-10">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div>
							<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
								¡Bienvenido, {userData?.nombres || 'Estudiante'}!
							</h1>
							<p className="text-muted-foreground mt-2 text-sm md:text-base">
								{userData?.rol === 'estudiante' 
									? 'Realiza tu prematrícula de manera rápida y sencilla.' 
									: 'Gestiona el proceso de prematrícula académica.'}
							</p>
						</div>
						<div className="mt-4 md:mt-0">
							<span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">
								<Calendar className="w-4 h-4 mr-2" />
								{fechasAcademicas.prematricula ? 'Prematrícula Activa' : 'Prematrícula Inactiva'}
							</span>
						</div>
					</div>
				</div>
				{/* Decoración de fondo */}
				<div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
			</section>

			{/* Cards de información rápida */}
			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
				{/* Card 1: Semestre */}
				<div className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
					<div className="flex items-center gap-3 mb-3">
						<div className="p-2 rounded-lg bg-primary/10 text-primary">
							<BookOpen className="w-5 h-5" />
						</div>
						<h3 className="text-sm font-medium text-muted-foreground">Semestre</h3>
					</div>
					<p className="text-xl md:text-2xl font-bold text-foreground">
						{fechasAcademicas.semestre || '2026-I'}
					</p>
				</div>

				{/* Card 2: Estado Prematrícula */}
				<div className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
					<div className="flex items-center gap-3 mb-3">
						<div className={`p-2 rounded-lg ${fechasAcademicas.prematricula ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
							<Clock className="w-5 h-5" />
						</div>
						<h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
					</div>
					<p className={`text-xl md:text-2xl font-bold ${fechasAcademicas.prematricula ? 'text-green-500' : 'text-yellow-500'}`}>
						{fechasAcademicas.prematricula ? 'Activo' : 'Inactivo'}
					</p>
				</div>

				{/* Card 3: Inicio Prematrícula */}
				<div className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
					<div className="flex items-center gap-3 mb-3">
						<div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
							<Calendar className="w-5 h-5" />
						</div>
						<h3 className="text-sm font-medium text-muted-foreground">Inicio</h3>
					</div>
					<p className="text-sm md:text-base font-medium text-foreground">
						{fechasAcademicas.prematricula?.fecha_inicio 
							? formatFecha(fechasAcademicas.prematricula.fecha_inicio) 
							: 'No definido'}
					</p>
				</div>

				{/* Card 4: Fin Prematrícula */}
				<div className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
					<div className="flex items-center gap-3 mb-3">
						<div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
							<Calendar className="w-5 h-5" />
						</div>
						<h3 className="text-sm font-medium text-muted-foreground">Término</h3>
					</div>
					<p className="text-sm md:text-base font-medium text-foreground">
						{fechasAcademicas.prematricula?.fecha_fin 
							? formatFecha(fechasAcademicas.prematricula.fecha_fin) 
							: 'No definido'}
					</p>
				</div>
			</section>

			{/* Separador */}
			<div className="flex items-center gap-4">
				<h2 className="text-xl md:text-2xl font-bold text-foreground">Acerca del Sistema</h2>
				<div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
			</div>

			{/* Sección Informativa con Carrusel */}
			<section className="grid lg:grid-cols-2 gap-6 md:gap-8">
				{/* Carrusel de Imágenes */}
				<div className="bg-card border border-border rounded-2xl overflow-hidden">
					<div className="relative h-64 md:h-80 overflow-hidden">
						<img
							src={images[currentImageIndex]}
							alt="Sistema de Prematrícula Informática UNT"
							className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>

						{/* Indicadores del carrusel */}
						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
							{images.map((_, index) => (
								<button
									key={index}
									className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
										index === currentImageIndex 
											? 'bg-primary w-8' 
											: 'bg-muted-foreground/50 hover:bg-muted-foreground'
									}`}
									onClick={() => goToImage(index)}
								/>
							))}
						</div>
					</div>
					<div className="p-4 md:p-6 border-t border-border">
						<p className="text-sm text-muted-foreground">
							<strong className="text-foreground">Prematrícula Informática</strong> — 
							Escuela Profesional de Informática - UNT
						</p>
					</div>
				</div>

				{/* Texto informativo */}
				<div className="bg-card border border-border rounded-2xl p-6 md:p-8">
					<h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
						Prematrículas Informática
					</h2>
					<div className="space-y-4">
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							Este sistema está diseñado específicamente para la <span className="text-primary font-semibold">prematrícula de la Escuela de Ingeniería Informática</span>, permitiendo una gestión eficiente y centralizada.
						</p>
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							Nuestro sistema permite contabilizar y analizar datos de prematrícula, facilitando la toma de decisiones informadas para la planificación de cada semestre.
						</p>
						<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
							Gracias al sistema, la secretaria y director de escuela pueden gestionar de forma óptima la <span className="text-primary font-semibold">carga académica</span>, definir los <span className="text-primary font-semibold">cupos por salón</span> y organizar los <span className="text-primary font-semibold">horarios</span>.
						</p>
					</div>
				</div>
			</section>

			{/* Separador */}
			<div className="flex items-center gap-4">
				<h2 className="text-xl md:text-2xl font-bold text-foreground">Mallas Curriculares</h2>
				<div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
			</div>

			{/* Sección de mallas curriculares */}
			<section className="grid md:grid-cols-2 gap-6">
				{/* Card Malla Curricular 1997 */}
				<div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
					<div className="flex items-center gap-4 mb-6">
						<div className="p-3 rounded-xl bg-muted">
							<BookOpen className="w-6 h-6 text-muted-foreground" />
						</div>
						<div>
							<h3 className="text-lg font-bold text-foreground">Currícula Antigua</h3>
							<p className="text-sm text-muted-foreground">Plan de estudios 1997</p>
						</div>
					</div>
					<a
						href="https://inf.unitru.edu.pe/curriculos-97"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
					>
						Explorar Currícula Antigua
						<ExternalLink className="w-4 h-4" />
					</a>
				</div>

				{/* Card Malla Curricular 2018 */}
				<div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
					<div className="flex items-center gap-4 mb-6">
						<div className="p-3 rounded-xl bg-primary/10">
							<Award className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h3 className="text-lg font-bold text-foreground">Currícula Vigente</h3>
							<p className="text-sm text-muted-foreground">Plan de estudios 2018</p>
						</div>
					</div>
					<a
						href="https://inf.unitru.edu.pe/curriculos"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
					>
						Explorar Currícula Vigente
						<ExternalLink className="w-4 h-4" />
					</a>
				</div>
			</section>
		</div>
	);
}