import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />
            <main className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 luxury-text">Privacy Policy</h1>
                <div className="prose dark:prose-invert">
                    <p>This is a placeholder for the Privacy Policy.</p>
                    <p>At Areum, we value your privacy and are committed to protecting your personal data.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
