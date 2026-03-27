'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session) {
            setUser(session.user);
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [session, status]);

    const login = async (email, password) => {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });
        return result;
    };

    const logout = async () => {
        await signOut({ redirect: true, callbackUrl: '/' });
    };

    const socialLogin = async (provider) => {
        await signIn(provider.toLowerCase(), { callbackUrl: '/' });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            status,
            login,
            logout,
            socialLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
