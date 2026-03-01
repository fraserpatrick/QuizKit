import { AuthProvider } from '@/context/AuthContext';
import RootNav from '@/app/navigation/RootNav';
import { initializeDatabase } from '@/localDatabase/databaseConnection';
import { useEffect } from 'react';

export default function App() {
    useEffect(() => {
        initializeDatabase();
    }, []);

    return (
        <AuthProvider>
            <RootNav />
        </AuthProvider>
    );
}