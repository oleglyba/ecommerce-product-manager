import './globals.scss';
import Header from './components/Header/Header';
import { AuthProvider } from './components/AuthProvider/AuthProvider';

export const metadata = {
    title: 'E-commerce Product Manager',
    description: 'Manage your products with ease',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <div className="app">
                <Header />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}