import { useState } from "react";
import { PlaneInfo } from "../types";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { Info, HelpCircle, Check, Award, Compass, RotateCcw } from "lucide-react";

const planesData: PlaneInfo[] = [
  {
    id: "sagittal",
    name: "საგიტალური სიბრტყე",
    anatomyTerm: "Median Sagittal Plane",
    description: "წარმოიდგინე უხილავი სარკე, რომელიც შენს სხეულს ზუსტად შუაზე ყოფს!",
    impact: "სხეულს ყოფს მარცხენა (Left) და მარჯვენა (Right) თანაბარ ნაწილებად."
  },
  {
    id: "coronal",
    name: "კორონალური (ფრონტალური) სიბრტყე",
    anatomyTerm: "Coronal / Frontal Plane",
    description: "წარმოიდგინე სიბრტყე, რომელიც ყურებიდან ყურებამდე ჩადის!",
    impact: "სხეულს ყოფს წინა (Anterior / ვენტრალურ) და უკანა (Posterior / დორსალურ) მხარედ."
  },
  {
    id: "transverse",
    name: "ტრანსვერსიული (ჰორიზონტალური) სიბრტყე",
    anatomyTerm: "Transverse / Horizontal Plane",
    description: "წარმოიდგინე განივი წრე წელის გარშემო, როგორც ჰულაჰუპი!",
    impact: "სხეულს ყოფს ზედა (Superior / კრანიალურ) და ქვედა (Inferior / კაუდალურ) ნაწილებად."
  }
];

interface BodyPlanesProps {
  onEarnPoints: (p: number, s: number) => void;
}

export default function BodyPlanes({ onEarnPoints }: BodyPlanesProps) {
  const [selectedPlane, setSelectedPlane] = useState<string>("sagittal");
  const [directionHover, setDirectionHover] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);

  const activePlane = planesData.find((p) => p.id === selectedPlane) || planesData[0];

  const handlePlaneSelect = (id: string) => {
    setSelectedPlane(id);
    playSound("click");
  };

  const handleDirectionClick = (dir: string, term: string, desc: string) => {
    playSound("pop");
    setDirectionHover(`${dir} (${term}): ${desc}`);
  };

  const handleQuizChoice = (isCorrect: boolean) => {
    setQuizAnswered(true);
    if (isCorrect) {
      setQuizCorrect(true);
      playSound("success");
      onEarnPoints(15, 1);
    } else {
      setQuizCorrect(false);
      playSound("fail");
    }
  };

  const resetQuiz = () => {
    setQuizAnswered(false);
    setQuizCorrect(null);
    playSound("click");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-slate-850">
      {/* Visual Anatomy Board */}
      <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-4 border-amber-400 shadow-xl overflow-hidden relative">
        <h3 className="text-xl font-black text-amber-500 mb-2 flex items-center gap-2">
          <Compass className="w-6 h-6 animate-spin-slow" />
          სხეულის ინტერაქტიული სიბრტყეები
        </h3>
        <p className="text-xs text-amber-900 mb-4 bg-amber-50 p-3 rounded-2xl border border-amber-250 leading-relaxed font-bold">
          💡 დააწკაპუნე სიბრტყის ღილაკებსა და მიმართულების წერტილებს, რომ ისწავლო როგორ მუშაობს ანატომიური კოორდინატები!
        </p>

        {/* SVG human figure representing planes */}
        <div className="relative w-full h-[360px] flex justify-center items-center bg-slate-50 rounded-3xl p-4 border border-slate-200 shadow-inner">
          <svg viewBox="0 0 200 300" className="w-[180px] h-full overflow-visible">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(14, 165, 233, 0.08)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="200" height="300" fill="url(#grid)" rx="10" />

            {/* Human body silhouette */}
            <g className="fill-sky-200 stroke-sky-400 stroke-[2] transition-colors duration-500">
              {/* Head */}
              <circle cx="100" cy="55" r="22" className="fill-orange-100 stroke-orange-300" />
              {/* Neck */}
              <rect x="95" y="77" width="10" height="15" className="fill-orange-100 stroke-orange-300" />
              {/* Body */}
              <path d="M 80 92 L 120 92 Q 125 140 120 180 L 80 180 Q 75 140 80 92 Z" className="fill-orange-100 stroke-orange-300" />
              {/* Arms */}
              <path d="M 75 95 Q 45 120 70 140 Q 80 120 78 95 Z" className="fill-orange-100 stroke-orange-300" />
              <path d="M 125 95 Q 155 120 130 140 Q 120 120 122 95 Z" className="fill-orange-100 stroke-orange-300" />
              {/* Legs */}
              <rect x="82" y="180" width="14" height="85" rx="5" className="fill-orange-100 stroke-orange-300" />
              <rect x="104" y="180" width="14" height="85" rx="5" className="fill-orange-100 stroke-orange-300" />
              {/* Face smiling */}
              <circle cx="93" cy="50" r="2.5" fill="#e11d48" />
              <circle cx="107" cy="50" r="2.5" fill="#e11d48" />
              <path d="M 94 62 Q 100 70 106 62" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Glowing Plane Overlays based on selection */}
            {selectedPlane === "sagittal" && (
              <g className="animate-pulse">
                {/* Vertical split down center */}
                <line x1="100" y1="10" x2="100" y2="290" stroke="#f97316" strokeWidth="4" strokeDasharray="5,5" />
                {/* Left block overlay half */}
                <rect x="10" y="10" width="90" height="280" fill="rgba(249, 115, 22, 0.08)" stroke="#f97316" strokeWidth="1" strokeDasharray="3" rx="8" />
                <text x="50" y="25" fill="#f97316" fontSize="9" fontWeight="bold" textAnchor="middle">მარცხენა (Left)</text>
                {/* Right block overlay */}
                <rect x="100" y="10" width="90" height="280" fill="rgba(249, 115, 22, 0.04)" stroke="#f97316" strokeWidth="1" strokeDasharray="3" rx="8" />
                <text x="150" y="25" fill="#f97316" fontSize="9" fontWeight="bold" textAnchor="middle">მარჯვენა (Right)</text>
              </g>
            )}

            {selectedPlane === "coronal" && (
              <g className="animate-pulse">
                {/* Front and back layers split */}
                <path d="M 30,50 L 170,110 L 170,250 L 30,190 Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="3" />
                <text x="50" y="40" fill="#10b981" fontSize="9" fontWeight="bold">წინა (Anterior)</text>
                <text x="150" y="270" fill="#10b981" fontSize="9" fontWeight="bold">უკანა (Posterior)</text>
              </g>
            )}

            {selectedPlane === "transverse" && (
              <g className="animate-pulse">
                {/* Horizontal split at stomach */}
                <ellipse cx="100" cy="150" rx="90" ry="15" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="3" />
                <line x1="10" y1="150" x2="190" y2="150" stroke="#0ea5e9" strokeWidth="2" />
                <text x="100" y="120" fill="#0ea5e9" fontSize="10" fontWeight="bold" textAnchor="middle">ზედა (Superior)</text>
                <text x="100" y="190" fill="#0ea5e9" fontSize="10" fontWeight="bold" textAnchor="middle">ქვედა (Inferior)</text>
              </g>
            )}

            {/* Interactive Direction Pins */}
            {/* Head pin (Superior) */}
            <g className="cursor-pointer" onClick={() => handleDirectionClick("სუპერიორული", "Superior", "ნიშნავს უფრო მაღლა, თავისკენ (მაგ. თავი სახურავია!)")}>
              <circle cx="100" cy="20" r="6" fill="#ef4444" className="hover:scale-125 transition-transform" />
              <text x="110" y="23" fill="#ef4444" fontSize="8" fontWeight="bold">ზედა ↑</text>
            </g>
            {/* Feet pin (Inferior) */}
            <g className="cursor-pointer" onClick={() => handleDirectionClick("ინფერიორული", "Inferior", "ნიშნავს უფრო დაბლა, ფეხებისკენ (მაგ. ფეხის ტერფები!)")}>
              <circle cx="100" cy="285" r="6" fill="#ef4444" className="hover:scale-125 transition-transform" />
              <text x="110" y="287" fill="#ef4444" fontSize="8" fontWeight="bold">ქვედა ↓</text>
            </g>
            {/* Hand pin (Lateral) */}
            <g className="cursor-pointer" onClick={() => handleDirectionClick("ლატერალური", "Lateral", "ნიშნავს სხეულის გვერდიდან, შუა ხაზისგან შორს (მაგ. ხელები!)")}>
              <circle cx="48" cy="120" r="6" fill="#a855f7" className="hover:scale-125 transition-transform" />
              <text x="40" y="113" fill="#a855f7" fontSize="8" fontWeight="bold" textAnchor="middle">ლატერალური ←</text>
            </g>
            {/* Heart pin (Medial) */}
            <g className="cursor-pointer" onClick={() => handleDirectionClick("მედიალური", "Medial", "ნიშნავს შუა ხაზთან ახლოს (მაგალითად, გული ან ცხვირი!)")}>
              <circle cx="100" cy="115" r="6" fill="#22c55e" className="hover:scale-125 transition-transform" />
              <text x="100" y="110" fill="#22c55e" fontSize="8" fontWeight="bold" textAnchor="middle">მედიალური</text>
            </g>
          </svg>

          {/* Toast Information overlay */}
          <AnimatePresence>
            {directionHover && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-white/95 p-3.5 rounded-2xl border-2 border-indigo-400 shadow-lg text-xs text-slate-800"
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold flex items-center gap-1.5 text-indigo-600">
                    <Info className="w-4.5 h-4.5 text-indigo-500" />
                    {directionHover.split(":")[0]}
                  </span>
                  <button
                    onClick={() => setDirectionHover(null)}
                    className="text-gray-400 hover:text-slate-800 font-black px-1.5 text-sm"
                  >
                    ×
                  </button>
                </div>
                <p className="mt-1.5 text-slate-600 font-bold leading-relaxed">{directionHover.split(":")[1]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Direction Points Hint */}
        <div className="mt-3.5 flex flex-wrap gap-2 text-[10px] justify-center text-slate-600 font-extrabold">
          <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-xl border border-red-200">🔴 დააწკაპუნე წითელ წერტილებს</span>
          <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-xl border border-purple-200">🟣 გვერდითი (ლატერალური)</span>
          <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-xl border border-emerald-200">🟢 შუა (მედიალური)</span>
        </div>
      </div>

      {/* Control Pane & Educational content */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {/* Plane Selector Toggles */}
        <div className="bg-white p-4 rounded-3xl border-4 border-slate-200 shadow-sm">
          <h4 className="text-sm font-black text-amber-600 mb-3 text-center uppercase tracking-wider">შეარჩიე ანატომიური სიბრტყე:</h4>
          <div className="flex flex-col gap-2.5">
            {planesData.map((plane) => {
              const isActive = plane.id === selectedPlane;
              return (
                <button
                  key={plane.id}
                  id={`btn-plane-${plane.id}`}
                  onClick={() => handlePlaneSelect(plane.id)}
                  className={`text-left p-3.5 rounded-2xl border-2 text-sm font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-between ${
                    isActive
                      ? "bg-amber-400 border-amber-500 text-slate-950 scale-[1.02] shadow-md"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50 cursor-pointer"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{plane.name}</span>
                    <span className="text-[10px] opacity-75 font-mono italic">{plane.anatomyTerm}</span>
                  </div>
                  {isActive && <div className="bg-slate-950/90 p-1 rounded-full text-amber-400"><Check className="w-4 h-4 stroke-[3]" /></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Card displaying facts */}
        <motion.div
          key={activePlane.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl border-4 border-sky-400 p-5 shadow-lg text-slate-850"
        >
          <div className="bg-sky-50 w-fit px-3 py-1 rounded-full text-xs font-mono font-black text-sky-600 border border-sky-200 mb-2.5">
            🧬 {activePlane.anatomyTerm}
          </div>
          <h4 className="text-lg font-black text-sky-600 mb-2">{activePlane.name}</h4>
          <p className="text-sm text-slate-600 mb-3.5 italic leading-relaxed font-bold">
            "{activePlane.description}"
          </p>

          <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 shadow-inner">
            <span className="text-xs font-black text-sky-600 uppercase block mb-1">🔍 რას აკეთებს?</span>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
              {activePlane.impact}
            </p>
          </div>
        </motion.div>

        {/* Small Module Mini-Quiz */}
        <div className="bg-white rounded-3xl border-4 border-emerald-500 p-5 shadow-lg text-slate-850">
          <h4 className="text-sm font-black text-emerald-600 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            სწრაფი გამოცდა ვარსკვლავისთვის! ⭐
          </h4>
          <p className="text-xs text-emerald-600 mb-3 font-black leading-relaxed">
            რომელი სიბრტყე ყოფს ჩვენს სხეულს ორ თანაბარ - მარცხენა და მარჯვენა ნაწილად?
          </p>

          {!quizAnswered ? (
            <div className="flex flex-col gap-2.5">
              <button
                id="btn-quiz-opt1"
                onClick={() => handleQuizChoice(false)}
                className="bg-white p-3 rounded-2xl text-xs font-black border-2 border-slate-200 hover:border-emerald-450 hover:bg-emerald-50 text-left text-slate-700 cursor-pointer shadow-xs"
              >
                ჰორიზონტალური სიბრტყე
              </button>
              <button
                id="btn-quiz-opt2"
                onClick={() => handleQuizChoice(true)}
                className="bg-white p-3 rounded-2xl text-xs font-black border-2 border-slate-200 hover:border-emerald-450 hover:bg-emerald-50 text-left text-slate-700 cursor-pointer shadow-xs"
              >
                საგიტალური სიბრტყე
              </button>
              <button
                id="btn-quiz-opt3"
                onClick={() => handleQuizChoice(false)}
                className="bg-white p-3 rounded-2xl text-xs font-black border-2 border-slate-200 hover:border-emerald-450 hover:bg-emerald-50 text-left text-slate-700 cursor-pointer shadow-xs"
              >
                კორონალური სიბრტყე
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-2xl ${
                quizCorrect ? "bg-emerald-50 border-2 border-emerald-200" : "bg-rose-50 border-2 border-rose-200"
              }`}
            >
              {quizCorrect ? (
                <div className="flex items-start gap-2.5">
                  <div className="bg-emerald-500 p-1.5 rounded-full text-white mt-0.5">
                    <Award className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-black text-emerald-700 block text-sm">სწორია! ყოჩაღ! 🎉</span>
                    <span className="text-xs text-slate-700 font-bold leading-relaxed block mt-1">შენ დაიმსახურე 1 ვარსკვლავი და +15 ქულა! საგიტალური სიბრტყე მართლაც შუაზე ყოფს სხეულს!</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <div className="bg-rose-500 p-1.5 rounded-full text-white mt-0.5">
                    <RotateCcw className="w-5 h-5 animate-spin-slow stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-black text-rose-700 block text-sm">არა უშავს, სცადე თავიდან! ↻</span>
                    <span className="text-xs text-slate-600 block mb-2 font-bold leading-relaxed mt-1">ჰორიზონტალური სიბრტყე სხეულს ზედა და ქვედა ნაწილებად ყოფს. გაიხსენე, საგიტალური რომელია?</span>
                    <button
                      onClick={resetQuiz}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] px-3 py-1.5 rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      თავიდან სცადე
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
