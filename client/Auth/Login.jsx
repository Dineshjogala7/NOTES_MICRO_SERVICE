import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            setLoading(true);
            if(!email || !password) {
                toast.error('Provide the details ') 
                return
            }
            const response = await axios.post(`${import.meta.env.VITE_API_URL}users/auth/login`, { email, password }, {
                withCredentials: true
            });
            console.log(response.data);
            toast.success(response.data.msg);
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-blue-100">
            <div className="max-w-md w-full border-2 rounded-md bg-blue-200 px-6 py-8">
                <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                <div className="flex flex-col gap-4">
                    <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} className="border border-black px-4 py-2 rounded-md" />
                    <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} className="border border-black px-4 py-2 rounded-md" />
                    <button onClick={handleLogin} className="btn" disabled={loading}>Login</button>
                </div>
                <p className="text-center mt-4">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
            </div>
        </div>
    )
}


export default Login;