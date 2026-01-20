"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [appLoading, setAppLoading] = useState(true);
  const { data: session, status } = useSession();

  // Cargar tema al inicio
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle('dark', savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
    setAppLoading(false);
  }, []);

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email && status === "authenticated") {
        try {
          setAppLoading(true);
          const response = await fetch('/api/user/data');
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
            // console.log("Datos de usuario cargados:", userData);
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
      }
    };

    fetchUserData();
  }, [session, status]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const value = {
    userData,
    isDarkMode,
    toggleTheme,
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