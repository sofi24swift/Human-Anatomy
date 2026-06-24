import { useState } from "react";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, Droplet, Heart, Thermometer, UserCheck } from "lucide-react";

interface SkinShieldProps {
  onEarnPoints: (p: number, s: number) => void;
}

export default function SkinShield({ onEarnPoints }: SkinShieldProps) {
  const [activeSubTab, setActiveSubTab] = useState<"cut" | "burn" | "sun">("cut");
  const [cutHealingStep, setCutHealingStep] = useState<number>(1);
  const [isCooled, setIsCooled] = useState<boolean>(false);
  const [sunCapApplied, setSunCapApplied] = useState<boolean>(false);
  const [sunSpfApplied, setSunSpfApplied] = useState<boolean>(false);

  const handleCutAction = (nextStep: number) => {
    playSound("pop");
    setCutHealingStep(nextStep);
    if (nextStep === 4) {
      playSound("success");
      onEarnPoints(25, 1);
    }
  };

  const handleCoolAction = () => {
    playSound("success");
    setIsCooled(true);
    onEarnPoints(15, 1);
  };

  const handleSunShield = (type: "cap" | "spf") => {
    playSound("pop");
    if (type === "cap") {
      setSunCapApplied(true);
    } else {
      setSunSpfApplied(true);
    }
    
    if ((type === "cap" && sunSpfApplied) || (type === "spf" && sunCapApplied)) {
      playSound("powerup");
      onEarnPoints(20, 1);
    }
  };

  const resetCut = () => {
    setCutHealingStep(1);
    playSound("click");
  };

  const resetBurn = () => {
    setIsCooled(false);
    playSound("click");
  };

  const resetSun = () => {
    setSunCapApplied(false);
    setSunSpfApplied(false);
    playSound("click");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar Selector */}
      <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        <button
          onClick={() => { setActiveSubTab("cut"); playSound("click"); }}
          className={`flex-1 shrink-0 p-3.5 rounded-2xl text-xs font-bold text-center lg:text-left transition-all flex items-center justify-center lg:justify-start gap-2 ${
            activeSubTab === "cut"
              ? "bg-rose-500 text-white shadow-md shadow-rose-200 border-2 border-rose-600"
              : "bg-white text-rose-600 border-2 border-rose-100 hover:bg-rose-50/50"
          }`}
        >
          🩹 ნაკაწრის შეხორცება
        </button>
        <button
          onClick={() => { setActiveSubTab("burn"); playSound("click"); }}
          className={`flex-1 shrink-0 p-3.5 rounded-2xl text-xs font-bold text-center lg:text-left transition-all flex items-center justify-center lg:justify-start gap-2 ${
            activeSubTab === "burn"
              ? "bg-orange-500 text-white shadow-md shadow-orange-200 border-2 border-orange-600"
              : "bg-white text-orange-600 border-2 border-orange-105 hover:bg-orange-50/50"
          }`}
        >
          🔥 დამწვრობის ხარისხები
        </button>
        <button
          onClick={() => { setActiveSubTab("sun"); playSound("click"); }}
          className={`flex-1 shrink-0 p-3.5 rounded-2xl text-xs font-bold text-center lg:text-left transition-all flex items-center justify-center lg:justify-start gap-2 ${
            activeSubTab === "sun"
              ? "bg-sky-500 text-white shadow-md shadow-sky-200 border-2 border-sky-600"
              : "bg-white text-sky-600 border-2 border-sky-100 hover:bg-sky-50/50"
          }`}
        >
          ☀️ დამცავი "მზის ფარი"
        </button>
      </div>

      {/* Main interactive window */}
      <div className="lg:col-span-9 bg-white/85 p-6 rounded-3xl border-4 border-slate-200 shadow-xl overflow-hidden min-h-[400px] flex flex-col justify-between">
        
        {/* CUT SHIELD VIEW */}
        {activeSubTab === "cut" && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-rose-700 flex items-center gap-1.5 mb-2">
                <span>🩹 ნაკაწრის შეხორცების ეტაპები</span>
              </h3>
              <p className="text-xs text-rose-600 mb-5 bg-rose-50 p-2.5 rounded-xl font-medium">
                ჩვენი კანი საოცარი ფარია! როდესაც თითს გაიკაწრავ, ეპიდერმისი და დერმა მაშინვე იწყებენ მუშაობას, რომ ნაკაწრი გააჯანსაღონ. მიყევი ეტაპებს:
              </p>

              {/* Graphic animation of cut healing */}
              <div className="bg-orange-50/60 p-5 rounded-2xl border-2 border-orange-150 h-[170px] flex items-center justify-center relative mb-5">
                <div className="w-full max-w-[280px] h-[30px] bg-amber-200 rounded-full relative flex items-center justify-center border-2 border-amber-300">
                  <span className="absolute -top-7 text-xs font-bold text-amber-800">ეპიდერმისი (ზედა ფენა)</span>
                  
                  {/* Step 1: Open bleeding cut */}
                  {cutHealingStep === 1 && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="absolute bg-red-600 w-16 h-4 rounded-full flex items-center justify-center animate-pulse">
                      <div className="bg-red-400 w-12 h-1.5 rounded-full animate-bounce" />
                      <span className="absolute top-5 text-[10px] font-bold text-red-600 animate-pulse">სისხლდენა! 🩸</span>
                    </motion.div>
                  )}

                  {/* Step 2: Bandage applied */}
                  {cutHealingStep === 2 && (
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bg-amber-400 border-2 border-amber-500 w-20 h-7 rounded-sm flex items-center justify-center shadow-lg">
                      <span className="text-[10px] font-extrabold text-slate-900 tracking-tight">სახვევი 🩹</span>
                    </motion.div>
                  )}

                  {/* Step 3: Scab formed under skin */}
                  {cutHealingStep === 3 && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="absolute bg-amber-950 w-16 h-3.5 rounded-full flex items-center justify-center border border-amber-800">
                      <span className="absolute top-4 text-[10px] font-extrabold text-amber-900">ფუფხი (Scab) 🛡️</span>
                    </motion.div>
                  )}

                  {/* Step 4: Fully healed skin with small star glow */}
                  {cutHealingStep === 4 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute flex items-center justify-center">
                      <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md animate-bounce">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="absolute top-7 text-[10px] font-bold text-emerald-600">განიკურნა! ✨</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Instruction descriptions and control buttons */}
            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 mb-4">
              {cutHealingStep === 1 && (
                <div>
                  <span className="text-xs font-bold text-rose-800 uppercase block mb-1">ეტაპი 1: გაწმენდა და დაცვა</span>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    პირველ რიგში, ჭრილობა უნდა ჩამოვბანოთ სუფთა წყლით და დავადოთ სტერილური ლეიკოპლასტირი, რომ ბაქტერიები შიგნით არ მოხვდნენ.
                  </p>
                  <button
                    onClick={() => handleCutAction(2)}
                    className="bg-rose-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md hover:bg-rose-700 active:scale-95 transition-all"
                  >
                    დაადე სახვევი 🩹
                  </button>
                </div>
              )}

              {cutHealingStep === 2 && (
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase block mb-1">ეტაპი 2: ფუფხის წარმოქმნა (Scab)</span>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    რამდენიმე საათში სისხლის ციცქნა უჯრედები - თრომბოციტები ერთიანდებიან და ქმნიან დროებით "ფარს" (ფუფხს). ის კანს იცავს განკურნებამდე. მას არასდროს უნდა მოახიო ხელი!
                  </p>
                  <button
                    onClick={() => handleCutAction(3)}
                    className="bg-amber-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md hover:bg-amber-700 active:scale-95 transition-all"
                  >
                    მიეცი დრო შეხორცებისთვის ⏳
                  </button>
                </div>
              )}

              {cutHealingStep === 3 && (
                <div>
                  <span className="text-xs font-bold text-orange-850 uppercase block mb-1">ეტაპი 3: ახალი კანი გასიზარდა!</span>
                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    ფუფხის ქვეშ, კანიდან ახალი უჯრედები გაიზარდა! ძველი ფუფხი თავისით ძვრება და კანი ისევ გლუვი და ჯანმრთელი ხდება.
                  </p>
                  <button
                    onClick={() => handleCutAction(4)}
                    className="bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    მოიშორე ფუფხი და მიიღე ჯილდო ⭐
                  </button>
                </div>
              )}

              {cutHealingStep === 4 && (
                <div className="text-center">
                  <span className="text-sm font-bold text-emerald-800 block mb-1">🎉 ყოჩაღ! შენი კანი განკურნებულია!</span>
                  <p className="text-xs text-slate-600 mb-3">სხეულმა წარმატებით დაასრულა რეგენერაციის პროცესი ქულების მოსაპოვებლად.</p>
                  <button
                    onClick={resetCut}
                    className="bg-rose-50 text-rose-700 border-2 border-rose-300 font-bold text-xs py-1.5 px-4 rounded-xl hover:bg-rose-100"
                  >
                    თავიდან დაწყება ↻
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BURN SHIELD VIEW */}
        {activeSubTab === "burn" && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-orange-700 flex items-center gap-1.5 mb-2">
                <span>🔥 დამწვრობის კლასიფიკაცია და პირველადი დახმარება</span>
              </h3>
              <p className="text-xs text-orange-600 mb-5 bg-orange-50 p-2.5 rounded-xl font-medium">
                გაიგე როგორ ფასდება დამწვრობა კანის დაზიანების მიხედვით, და რა პირველადი დახმარებაა საჭირო:
              </p>

              {/* Burns Grid Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                {/* 1st degree */}
                <div className="bg-orange-50 p-3.5 rounded-2xl border border-orange-200">
                  <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full uppercase block w-fit mb-1.5">
                    1-ლი ხარისხი
                  </span>
                  <span className="font-bold text-xs text-slate-900 block mb-1">ზედაპირული გაწითლება</span>
                  <p className="text-[10px] text-slate-600 leading-relaxed mb-3">
                    ზიანდება მხოლოდ ეპიდერმისი. მაგ: მზისგან დამწვრობა სახეზე.
                  </p>
                  <div className="bg-white/80 p-1.5 rounded-xl border border-sky-100 text-[10px] text-sky-800 font-bold">
                    💧 დახმარება: გააგრილე გამდინარე ცივი წყლით 10 წუთით!
                  </div>
                </div>

                {/* 2nd degree */}
                <div className="bg-red-50 p-3.5 rounded-2xl border border-red-200 animate-pulse-slow">
                  <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-2 py-0.5 rounded-full uppercase block w-fit mb-1.5">
                    მე-2 ხარისხი
                  </span>
                  <span className="font-bold text-xs text-slate-900 block mb-1">ბუშტუკების გაჩენა</span>
                  <p className="text-[10px] text-slate-600 leading-relaxed mb-3">
                    დაზიანებულია ეპიდერმისი და დერმის ზედა ნაწილი. ჩნდება სითხით სავსე ბუშტუკები.
                  </p>
                  <div className="bg-white/85 p-1.5 rounded-xl border border-red-200 text-[10px] text-red-800 font-bold">
                    ⚠️ არასდროს გახეთქო ბუშტუკი თითით, რომ ინფექცია არ შევიდეს!
                  </div>
                </div>

                {/* 3rd degree */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-300">
                  <span className="text-[10px] font-extrabold text-slate-700 bg-slate-250 px-2 py-0.5 rounded-full uppercase block w-fit mb-1.5">
                    მე-3 ხარისხი
                  </span>
                  <span className="font-bold text-xs text-slate-900 block mb-1">ღრმა დამწვრობა</span>
                  <p className="text-[10px] text-slate-600 leading-relaxed mb-3">
                    დაზიანებულია კანი სრულად, კუნთებამდე! კანი შეიძლება იყოს თეთრი ან ნახშირისფერი.
                  </p>
                  <div className="bg-white/90 p-1.5 rounded-xl border border-slate-300 text-[10px] text-slate-800 font-bold">
                    📞 დაუყოვნებლივ ექიმი (112) დასახმარებლად!
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated cooling interactive act */}
            <div className="bg-sky-50 border-2 border-sky-200 p-4 rounded-2xl">
              {!isCooled ? (
                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                  <div className="flex gap-2 items-center">
                    <div className="bg-sky-500 text-white p-2.5 rounded-full"><Thermometer className="w-5 h-5 animate-bounce" /></div>
                    <div>
                      <span className="text-xs font-bold text-sky-900 block">სიმულატორი: დაეხმარე დამწვარ კანს!</span>
                      <span className="text-[11px] text-slate-600">კანი შემთხვევით ცხელ ჭიქას შეეხო. გვაჩვენე სწორი დახმარება!</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCoolAction}
                    className="bg-sky-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1 hover:bg-sky-700 active:scale-95 transition-all w-full md:w-auto text-center justify-center shadow-md shadow-sky-100"
                  >
                    <Droplet className="w-4 h-4 fill-white" />
                    დაასხი ცივი წყალი 💧
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-800 block">🎉 შესანიშნავია! ტემპერატურა დაეცა!</span>
                  <span className="text-[11px] text-slate-600 block mb-2">ცივმა წყალმა შეაჩერა დამწვრობის გავრცელება დერმაში. შენ დაიმსახურე 1 *ვარსკვლავი* და +15 ქულა!</span>
                  <button
                    onClick={resetBurn}
                    className="text-[10px] font-bold text-sky-700 hover:underline"
                  >
                    სცადე თავიდან ↻
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUN PROTECTION VIEW */}
        {activeSubTab === "sun" && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-sky-700 flex items-center gap-1.5 mb-2">
                <span>☀️ მზისგან დამცავი "მზის ფარი"</span>
              </h3>
              <p className="text-xs text-sky-600 mb-5 bg-sky-50 p-2.5 rounded-xl font-medium">
                მზე დიდებული და თბილია, მაგრამ მისი ულტრაიისფერი (UV) სხივები საშიშია ჩვენი კანისთვის! დაეხმარე პატარა ნიკას მზისგან დაცვაში:
              </p>

              {/* Character mockup with status */}
              <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-150 flex flex-col items-center justify-center relative min-h-[160px] overflow-hidden">
                {/* Visual Sun hat if clicked */}
                <div className="relative">
                  {sunCapApplied ? (
                    <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 text-3xl">
                      👒
                    </motion.div>
                  ) : null}

                  {/* Cartoon head */}
                  <div className="w-16 h-16 bg-orange-100 border-2 border-orange-300 rounded-full flex flex-col items-center justify-center relative">
                    {/* Sunscreen glow overlay */}
                    {sunSpfApplied && (
                      <div className="absolute inset-x-0 bottom-0 bg-white/70 h-8 rounded-b-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-blue-700 animate-pulse">SPF 50+</span>
                      </div>
                    )}
                    {/* Smile faces */}
                    <div className="flex gap-2">
                      <span className="w-1.5 h-1.5 bg-sky-900 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-sky-900 rounded-full" />
                    </div>
                    <span className="text-[10px] text-red-500 font-bold mt-1">
                      {sunCapApplied && sunSpfApplied ? "😀 უსაფრთხო!" : "🥵 ცხელა!"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-5 text-xs font-semibold text-slate-700 text-center">
                  <span>ქუდი: {sunCapApplied ? "✅ დაფარულია!" : "❌ აკლია"}</span>
                  <span>მზის კრემი (SPF): {sunSpfApplied ? "✅ წასმულია!" : "❌ აკლია"}</span>
                </div>
              </div>
            </div>

            {/* Action selectors */}
            <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 mt-4 flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-850 block">აირჩიე დამცავი აქსესუარები:</span>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={sunCapApplied}
                  onClick={() => handleSunShield("cap")}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                    sunCapApplied
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-amber-400 text-slate-900 border-amber-500 hover:bg-amber-500 active:scale-95 shadow-md"
                  }`}
                >
                  👒 დაახურე მზის ქუდი
                </button>
                <button
                  disabled={sunSpfApplied}
                  onClick={() => handleSunShield("spf")}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                    sunSpfApplied
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-blue-500 text-white border-blue-600 hover:bg-blue-600 active:scale-95 shadow-md"
                  }`}
                >
                  🍼 წაუსვი დამცავი SPF კრემი
                </button>
              </div>

              {sunCapApplied && sunSpfApplied && (
                <div className="text-center mt-1 animate-pulse">
                  <span className="text-xs font-extrabold text-emerald-800 flex items-center justify-center gap-1">
                    <UserCheck className="w-4.5 h-4.5 text-emerald-500" />
                    ბრავო! ნიკა დაცულია მზის დამწვრობისგან! ⭐ +20 ქულა ბონუსი!
                  </span>
                  <button
                    onClick={resetSun}
                    className="text-[9px] text-slate-500 hover:underline mt-1"
                  >
                    თავიდან თამაში ↻
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
