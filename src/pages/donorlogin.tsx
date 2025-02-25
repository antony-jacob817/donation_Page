import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const DonorLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        user_type: "donor",
      });
  
      console.log("🔹 Server Response:", response.data);  // Debugging
  
      const { token, user } = response.data;
      if (!token || !user?._id) throw new Error("Invalid response from server");
  
      localStorage.setItem("donor_id", user._id); // Ensure correct key
      localStorage.setItem("token", token);
  
      toast.success("Login successful!");
      navigate("/donorhome");
  
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Login failed.");
      } else {
        toast.error("Login failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
        

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center space-x-3">
          <User className="w-8 h-8 text-rose-500" />
          <h2 className="text-3xl font-extrabold text-gray-900">Donor Login</h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">Sign in or create a new donor account</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-rose-100/50 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 pr-6 py-3 w-full border border-gray-200 rounded-lg text-gray-900" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 pr-6 py-3 w-full border border-gray-200 rounded-lg text-gray-900" placeholder="••••••••" />
                <div className="absolute right-4 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => navigate("/login")} className="text-sm text-rose-600">← Back to selection</button>
              <a href="#" className="text-sm text-rose-600">Forgot password?</a>
            </div>

            <div className="space-y-4">
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 text-white bg-rose-500 rounded-lg">{isLoading ? "Loading..." : "Sign in"}</motion.button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account? <span onClick={() => navigate("/register/donor")} className="text-rose-600 cursor-pointer">Create new account</span>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default DonorLogin;
