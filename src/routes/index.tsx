import { BrowserRouter, Routes, Route } from "react-router-dom"


import Home from "../pages/Home"
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Expired from "../pages/Expired";
import NotFound from "../pages/NotFound";
import Redirect from "../pages/Redirect";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/expired" element={<Expired />} />
                <Route
                    path="/:slug" element={<Redirect />} />
                <Route
                    path="/analytics/:slug"
                    element={<Analytics />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}