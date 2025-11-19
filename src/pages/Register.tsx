import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";
import { register } from "../api/auth";
import { Eye, EyeOff } from "lucide-react";

interface RegisterForm {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    gender: "NOT_SPECIFIED" | "MALE" | "FEMALE";
    city: string;
}

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterForm>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        gender: "NOT_SPECIFIED",
        city: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await register(form);
            alert("Registration successful!");
            navigate("/login");
        } catch (err: unknown) {
            const error = err as { response?: { data?: unknown }; message?: string };
            alert("Registration failed");
            console.error(error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    Create Account ✨
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Join <span className="text-purple-600 font-semibold">VibeLook</span> and start your style journey!
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* First Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">First Name</label>
                        <input
                            name="firstname"
                            value={form.firstname}
                            onChange={handleChange}
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                        <input
                            name="lastname"
                            value={form.lastname}
                            onChange={handleChange}
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

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

                    {/* Gender */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Gender</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="NOT_SPECIFIED">Not specified</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">City</label>
                        <select
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select city</option>
                            <option value="Astana">Astana</option>
                            <option value="Almaty">Almaty</option>
                            <option value="Shymkent">Shymkent</option>
                            <option value="Aktobe">Aktobe</option>
                            <option value="Karaganda">Karaganda</option>
                            <option value="Taraz">Taraz</option>
                            <option value="Pavlodar">Pavlodar</option>
                            <option value="Ust-Kamenogorsk">Ust-Kamenogorsk</option>
                            <option value="Semey">Semey</option>
                            <option value="Atyrau">Atyrau</option>
                            <option value="Kostanay">Kostanay</option>
                            <option value="Kyzylorda">Kyzylorda</option>
                            <option value="Uralsk">Uralsk</option>
                            <option value="Petropavl">Petropavl</option>
                            <option value="Aktau">Aktau</option>
                            <option value="Temirtau">Temirtau</option>
                            <option value="Kokshetau">Kokshetau</option>
                            <option value="Taldykorgan">Taldykorgan</option>
                            <option value="Ekibastuz">Ekibastuz</option>
                            <option value="Rudny">Rudny</option>
                            <option value="Turkistan">Turkistan</option>
                            <option value="Baikonur">Baikonur</option>
                            <option value="Zhezkazgan">Zhezkazgan</option>
                            <option value="Balkhash">Balkhash</option>
                            <option value="Saran">Saran</option>
                            <option value="Lisakovsk">Lisakovsk</option>
                            <option value="Kentau">Kentau</option>
                            <option value="Zhanaozen">Zhanaozen</option>
                            <option value="Aksay">Aksay</option>
                            <option value="Arkalyk">Arkalyk</option>
                            <option value="Ridder">Ridder</option>
                            <option value="Shakhtinsk">Shakhtinsk</option>
                            <option value="Stepnogorsk">Stepnogorsk</option>
                            <option value="Ayagoz">Ayagoz</option>
                            <option value="Shar">Shar</option>
                            <option value="Shchuchinsk">Shchuchinsk</option>
                            <option value="Makinsk">Makinsk</option>
                            <option value="Kandyagash">Kandyagash</option>
                            <option value="Zhetysai">Zhetysai</option>
                            <option value="Lenger">Lenger</option>
                            <option value="Saryagash">Saryagash</option>
                            <option value="Kapshagay">Kapshagay</option>
                            <option value="Esik">Esik</option>
                            <option value="Talgar">Talgar</option>
                            <option value="Kaskelen">Kaskelen</option>
                            <option value="Zharkent">Zharkent</option>
                            <option value="Oskemen">Oskemen</option>
                            <option value="Arys">Arys</option>
                            <option value="Shieli">Shieli</option>
                            <option value="Atbasar">Atbasar</option>
                            <option value="Ereymentau">Ereymentau</option>
                            <option value="Derzhavinsk">Derzhavinsk</option>
                            <option value="Zyryanovsk">Zyryanovsk</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-600 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
