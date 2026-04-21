import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isResending, setIsResending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(cleaned);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Design verified! You can now log in.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (err) {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    
    setIsResending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("A new code has been sent!");
        setTimer(300); // Reset timer to 5 mins
        setCode("");
        inputRef.current?.focus();
      } else {
        toast.error(data.message || "Could not resend code");
      }
    } catch (err) {
      toast.error("Connection error.");
    } finally {
      setIsResending(true);
      setTimeout(() => setIsResending(false), 30000); // Enable resend after 30s
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4 font-['Inter',_sans-serif]">
      <div className="max-w-[440px] w-full bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6 shadow-xl transform -rotate-3">
             <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Check your email</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            We've sent a 6-digit code to <br />
            <span className="font-semibold text-black">{email || "your email"}</span>
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="space-y-8">
          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="0 0 0 0 0 0"
              className="w-full bg-[#f8fafc] border-2 border-transparent rounded-2xl py-6 text-center text-4xl font-black tracking-[0.5em] focus:border-black focus:bg-white transition-all outline-none placeholder:text-gray-200"
              maxLength={6}
            />
          </div>

          <div className="text-center">
            <p className={`text-sm font-medium ${timer < 60 ? "text-red-500" : "text-gray-400"}`}>
              Code expires in <span className="font-bold tabular-nums">{formatTime(timer)}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || timer === 0}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
          </button>
        </form>

        {/* Footer Actions */}
        <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
          <button
            onClick={handleResend}
            disabled={isResending || timer > 240} // Allow resend after 1 min
            className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-[#d4af37] disabled:text-gray-300 transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
            Resend Code {timer > 240 ? `(${timer - 240}s)` : ""}
          </button>
          
          <Link
            to="/signup"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to registration
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
