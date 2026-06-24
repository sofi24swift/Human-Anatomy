import React, { useState } from "react";
import { playSound } from "../utils/audio";
import { ShieldAlert, LogIn, UserPlus, LogOut, ShieldCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthBarProps {
  user: { email: string; uid: string } | null;
  isFirebaseActive: boolean;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string) => Promise<void>;
  onLogout: () => Promise<void>;
  warningMessage?: string;
}

export default function AuthBar({
  user,
  isFirebaseActive,
  onLogin,
  onRegister,
  onLogout,
  warningMessage = "გთხოვთ, გაიარო ავტორიზაცია პროგრესის შესანახად"
}: AuthBarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setError(null);
    setEmail("");
    setPassword("");
    playSound("click");
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError(null);
    playSound("pop");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("გთხოვთ შეავსოთ ყველა ველი");
      playSound("fail");
      return;
    }
    if (password.length < 6) {
      setError("პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო");
      playSound("fail");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isRegisterMode) {
        await onRegister(email, password);
        playSound("powerup");
      } else {
        await onLogin(email, password);
        playSound("success");
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "შეცდომა ავტორიზაციისას. სცადეთ თავიდან!");
      playSound("fail");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    playSound("pop");
    await onLogout();
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-slate-200 p-4.5 shadow-lg w-full relative z-30">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Status display */}
        <div className="flex items-center gap-3 text-left">
          {user ? (
            <>
              <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600 border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-600 font-extrabold block leading-none">შესული ხართ სისტემაში (სინქრონიზებული)</span>
                <span className="text-xs font-black text-slate-800">{user.email}</span>
              </div>
            </>
          ) : (
            <>
              <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600 border border-amber-200 animate-pulse">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-amber-600 font-extrabold block leading-none">{warningMessage}</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">პროგრესი შეინახება ადგილობრივად, სანამ შეხვალთ სისტემაში.</span>
              </div>
            </>
          )}
        </div>

        {/* Buttons right layout */}
        <div className="flex items-center gap-2.5">
          {!isFirebaseActive && (
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2.5 py-1.5 rounded-xl border-2 border-indigo-200 font-black tracking-wider uppercase">
              ლოკალური რეჟიმი
            </span>
          )}

          {user ? (
            <button
              onClick={handleLogoutClick}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-850 border-2 border-slate-200 py-2.5 px-4 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              გამოსვლა
            </button>
          ) : (
            <button
              onClick={toggleOpen}
              className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-md py-2.5 px-4.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 hover:scale-[1.03] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              შესვლა / რეგისტრაცია
            </button>
          )}
        </div>
      </div>

      {/* Auth drawer modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="border-t border-slate-200 pt-4 mt-2">
              <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-1.5 justify-center">
                <User className="w-4 h-4 text-indigo-600" />
                {isRegisterMode ? "ანგარიშის შექმნა (Registration)" : "ავტორიზაცია (Login)"}
              </h3>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-3">
                {error && (
                  <div className="bg-rose-50 text-rose-600 font-extrabold text-xs p-3 rounded-2xl border-2 border-rose-200">
                    ⚠️ {error}
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1">ელექტრონული ფოსტა (Email)</label>
                  <input
                    type="email"
                    placeholder="პატარა_მკვლევარი@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 px-4 text-xs text-slate-800 focus:border-indigo-400 outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1">პაროლი (Password - მინ. 6 სიმბოლო)</label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-2.5 px-4 text-xs text-slate-800 focus:border-indigo-400 outline-none font-bold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-500 text-white font-black rounded-2xl py-3 text-xs hover:bg-indigo-600 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isRegisterMode ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      {isLoading ? "იქმნება..." : "რეგისტრაცია"}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      {isLoading ? "შედის..." : "შესვლა"}
                    </>
                  )}
                </button>

                <div className="text-center mt-1">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-[10px] text-indigo-600 hover:underline font-extrabold"
                  >
                    {isRegisterMode
                      ? "უკვე გაქვთ ანგარიში? შედით აქ"
                      : "არ გაქვთ ანგარიში? შეიქმენით აქ"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
