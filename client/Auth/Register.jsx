import { useState } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!email || !name || !password) {
            toast.error("Please provide all the details necessary!!");
            return;
        }

        setLoading(true);
        try {
            const result = await axios.post(
                `${import.meta.env.VITE_API_URL}users/auth/register`,
                { email, name, password },
                { withCredentials: true, timeout: 60000 }
            );
            toast.success(result.data.msg);
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-blue-100">

            <div className="max-w-md w-full border-2 rounded-md bg-blue-200 px-6 py-8">
                <h1 className="font-extrabold text-center mb-4">Register</h1>
                <div>
                    <label htmlFor="name">Enter your name</label>
                    <input
                        type="text"
                        placeholder="John Cena"
                        value={name} onChange={(e) => setName(e.target.value)}
                        name="name"
                        required
                        className="w-full px-6 py-4 rounded-md border border-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="email">Enter your Email</label>
                    <input
                        type="email"
                        placeholder="John@gmail.com"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        required
                        className="w-full px-6 py-4 rounded-md border border-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="passwd">Enter your password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        name="passwd"
                        required
                        className="w-full px-6 py-4 rounded-md border border-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                </div>
                <button
                    className="btn"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? "Please wait..." : "Register"}
                </button>
                <div className="mt-4 text-center">
                    <p>Already have an account? <Link to={"/login"} className="text-blue-700 underline">Login</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register