import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/app/firebase';
import { getUserByEmail } from '@/api/users';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<User>;
    signUp: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    resetPassword: () => Promise<void>;
    resetPasswordWithEmail: (email: string) => Promise<void>;
    getIdToken: () => Promise<string | null>;
    username: string | null;
    changeUsername: (newUsername: string) => Promise<void>;
    changePassword?: (newPassword: string) => Promise<void>;
    loading: boolean;
    deleteAccount: (password: string) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children} : AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
        if (!firebaseUser?.email) {
            setUsername(null);
            setLoading(false);
            return;
        }

        try {
            const result = await getUserByEmail(firebaseUser.email);
            if (!result) {
                setUsername(null);
                return;
            }
            
            setUsername(result.username);
        } catch (error) {
            console.error('Failed to load username:', error);
            setUsername(null);
        } finally {
            setLoading(false);
        }
    });
        return unsubscribe
    }, []);

    const signIn = async (email: string, password: string): Promise<User> => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    const signUp = async (email: string, password: string): Promise<User> => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result.user;
    }

    const logout = async (): Promise<void> => {
        await signOut(auth);
        setUsername(null);
    };

    const resetPassword = async () : Promise<void> => {
        if (auth.currentUser) {
            await sendPasswordResetEmail(auth, auth.currentUser.email!)
        } else {
            throw new Error('No authenticated user');
        }
    }

    const resetPasswordWithEmail = async (email: string): Promise<void> => {
        await sendPasswordResetEmail(auth, email);
    };

    const getIdToken = async (): Promise<string | null> => {
        if (!auth.currentUser) return null;
        return await auth.currentUser.getIdToken();
    }

    const changeUsername = async (newUsername: string): Promise<void> => {    
        setUsername(newUsername);
    }

    const changePassword = async (newPassword: string): Promise<void> => {
        if (auth.currentUser) {
            await updatePassword(auth.currentUser, newPassword);
        } else {
            throw new Error('No authenticated user');
        }
    }

    const deleteAccount = async (password: string) : Promise<void> => {
        if (!auth.currentUser || !auth.currentUser.email) {
            throw new Error('No authenticated user');
        }

        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);


        await reauthenticateWithCredential(auth.currentUser, credential);
        await deleteUser(auth.currentUser);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !! user,
        signIn,
        signUp,
        logout,
        resetPassword,
        resetPasswordWithEmail,
        getIdToken,
        username,
        changeUsername,
        changePassword,
        loading,
        deleteAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};