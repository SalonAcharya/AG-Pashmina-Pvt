import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleCodeChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (err) {
      toast.error("Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4 font-['Inter',_sans-serif]">
      <div className="max-w-[440px] w-full bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6 shadow-sm">
             <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm">
            Enter the 6-digit security code and your new password for <br />
            <span className="font-semibold text-black">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* OTP Input */}
          <div className="space-y-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block text-center">
              Recovery Code
            </label>
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="0 0 0 0 0 0"
                className="w-full bg-[#f8fafc] border-2 border-transparent rounded-2xl py-5 text-center text-4xl font-black tracking-[0.5em] focus:border-red-500 focus:bg-white transition-all outline-none placeholder:text-gray-200"
                maxLength={6}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-[#f8fafc] border-2 border-transparent rounded-xl focus:border-black focus:bg-white transition-all outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
