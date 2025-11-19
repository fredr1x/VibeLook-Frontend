import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";
import { login } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";

interface LoginForm {
    email: string;
    password: string;
}

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await login(form);
            const accessToken = res.data?.accessToken;
            const refreshToken = res.data?.refreshToken;

            if (accessToken && refreshToken) {
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("keycloakId", String(jwtDecode(accessToken).sub));
                navigate("/");
            } else {
                alert("Login failed: No token received");
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: unknown }; message?: string };
            alert("Login failed");
            console.error(error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    Welcome Back 👋
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Login to your <span className="text-purple-600 font-semibold">VibeLook</span> account
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Password с глазиком */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <div className="relative w-full">
                            <input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-purple-600 font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
