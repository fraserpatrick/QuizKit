import { AuthProvider } from './AuthContext';
import RootNav from './navigation/RootNav';

export default function App() {
    return (
        <AuthProvider>
            <RootNav />
        </AuthProvider>
    );
}