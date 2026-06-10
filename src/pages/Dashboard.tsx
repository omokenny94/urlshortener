import LinksTable from "../components/dashboard/LinksTable";
import Navbar from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function Dashboard() {
  return (
    
    
    <div className="max-w-7xl mx-auto gap-4 w-full">
      <Navbar />
      <h1 className="mb-8 text-3xl font-bold mt-10">
        Dashboard
      </h1>

      <LinksTable />

      <Footer />
    </div>
  );
}