import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />
            <main className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 luxury-text">Terms of Service</h1>
                <div className="prose dark:prose-invert">
                    <p>This is a placeholder for the Terms of Service.</p>
                    <p>By using our website, you agree to these terms.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
