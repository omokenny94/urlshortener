import Navbar from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function Expired() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Navbar />

      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          Link Expired
        </h1>

        <p className="text-slate-500">
          This short link is no longer available.
        </p>
      </div>

      <Footer />
    </div>
  );
}