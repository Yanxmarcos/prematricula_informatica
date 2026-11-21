// src/contexts/AppContext.jsx
"use client";
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

const AppContext = createContext();

export function AppProvider({ children }) {
	const [userData, setUserData] = useState(null);
	const [appLoading, setAppLoading] = useState(true);
	const { data: session, status } = useSession();

	const hasFetchedUserData = useRef(false);
	const lastSessionEmail = useRef(null);

	// Eliminamos toda la lógica de tema oscuro
	useEffect(() => {
		setAppLoading(false);
	}, []);

	// Cargar datos del usuario - SOLO UNA VEZ por sesión
	useEffect(() => {
		const fetchUserData = async () => {
			if (hasFetchedUserData.current && lastSessionEmail.current === session?.user?.email) {
				return;
			}

			if (session?.user?.email && status === "authenticated") {
				try {
					setAppLoading(true);
					const response = await fetch('/api/user/data');
					if (response.ok) {
						const userData = await response.json();
						setUserData(userData);
						hasFetchedUserData.current = true;
						lastSessionEmail.current = session.user.email;
					} else {
						console.error("Error al cargar datos del usuario");
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				} finally {
					setAppLoading(false);
				}
			} else if (status === "unauthenticated") {
				setAppLoading(false);
				setUserData(null);
				hasFetchedUserData.current = false;
				lastSessionEmail.current = null;
			}
		};

		fetchUserData();
	}, [session, status]);

	// Eliminamos toggleTheme

	const value = {
		userData,
		appLoading
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useApp debe usarse dentro de AppProvider');
	}
	return context;
};