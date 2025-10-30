import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Wardrobe from "./pages/Wardrobe";
import AISuggestions from "./pages/AISuggestions";
import SavedLooks from "./pages/SavedLooks";
import Profile from "./pages/Profile";
import Brands from "./pages/Brands";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function AppRoutes() {
    const location = useLocation();
    const hideLayoutRoutes = ["/login", "/register"];
    const hideLayout = hideLayoutRoutes.includes(location.pathname);

    return hideLayout ? (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    ) : (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Home />} />
                <Route path="wardrobe" element={<Wardrobe />} />
                <Route path="ai-suggestions" element={<AISuggestions />} />
                <Route path="saved-looks" element={<SavedLooks />} />
                <Route path="profile" element={<Profile />} />
                <Route path="brands" element={<Brands />} />
                <Route path="contact" element={<Contact />} />
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}
