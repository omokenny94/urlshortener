import Navbar from "../components/header/Header";
import Footer from "../components/footer/Footer";


export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

      <Navbar />
      <h1 className="text-4xl font-bold">Page Not Found</h1>

      <Footer />
    </main>
  );
}