import { useState } from "react";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Sparkles, Flame, HelpCircle, Check, 
  RotateCcw, Award, Star, Activity, Scissors, AlertTriangle 
} from "lucide-react";

interface SkinShieldProps {
  onEarnPoints: (points: number, stars: number) => void;
}

interface CaseStudy {
  id: number;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const casesData: CaseStudy[] = [
  {
    id: 1,
    title: "🚑 შემთხვევა 1: მდუღარე ჩაიდანი",
    scenario: "ანა შემთხვევით ცხელ ჩაიდანს შეეხო. მის ხელზე მაშინვე გაჩნდა ძალიან მტკივნეული, სითხით სავსე ბუშტუკები (Blisters).",
    question: "კანის რომელი ფენები დაზიანდა და რა არის სწორი პირველადი დახმარება?",
    options: [
      "1-ლი ხარისხი (მხოლოდ ეპიდერმისი) — წავუსვათ ზეთი და კარაქი",
      "მე-2 ხარისხი (ეპიდერმისი და დერმა) — გავაგრილოთ გრილი წყლით და არავითარ შემთხვევაში არ გავხეთქოთ ბუშტუკები!",
      "მე-3 ხარისხი (ჰიპოდერმისი) — მჭიდროდ შევკრათ ბინტით და მოვაყაროთ მარილი"
    ],
    correctAnswerIndex: 1,
    explanation: "სწორია! სითხით სავსე ბუშტუკები მე-2 ხარისხის დამწვრობაზე მიუთითებს (ეპიდერმისი + დერმა). ბუშტუკების გახეთქვა არ შეიძლება, რადგან ისინი ბუნებრივი დამცავი ფარია ბაქტერიების წინააღმდეგ!"
  },
  {
    id: 2,
    title: "😷 შემთხვევა 2: ქირურგის არჩევანი",
    scenario: "ექიმმა მუცლის არეში უნდა გააკეთოს ოპერაციული განაკვეთი. მას სურს ჭრილობა სწრაფად შეხორცდეს და ნაწიბური (Scar) თითქმის შეუმჩნეველი დარჩეს.",
    question: "როგორ უნდა მიმართოს მან სკალპელი კანის ბუნებრივ ლანგერის ხაზებთან (დაჭიმულობის ხაზებთან) მიმართებაში?",
    options: [
      "ლანგერის ხაზების პერპენდიკულარულად (ვერტიკალურად), რათა კანი უკეთესად გაიწელოს",
      "ლანგერის ხაზების პარალელურად (ჰორიზონტალურად), რათა კოლაგენის ბოჭკოები არ დაიჭიმოს და ჭრილობა ადვილად დაიხუროს",
      "ნებისმიერი მიმართულებით, რადგან კანის ყველა ნაწილი ერთნაირად ხორცდება"
    ],
    correctAnswerIndex: 1,
    explanation: "ბრწყინვალეა! ლანგერის ხაზების პარალელური განაკვეთი მინიმალურ დაჭიმულობას განიცდის, რის გამოც კანი ადვილად, სწრაფად და ლამაზად ხორცდება, თითქმის შეუმჩნეველი ნაწიბურით!"
  },
  {
    id: 3,
    title: "☀️ შემთხვევა 3: სანაპიროზე დავიწყებული მზის კრემი",
    scenario: "გიორგიმ მთელი დღე მზის გულზე გაატარა საცურაო კოსტიუმით და დაავიწყდა მზის დამცავი SPF კრემის წასმა. საღამოს მისი კანი მთლიანად გაწითლდა და აეწვა, თუმცა ბუშტუკები არ გაჩენილა.",
    question: "რა ტიპის დაზიანებაა ეს და როგორ დავეხმაროთ მას?",
    options: [
      "პირველი ხარისხის დამწვრობა (ეპიდერმისი) — გავაგრილოთ გრილი წყლით, მივიღოთ ბევრი სითხე და წავუსვათ დამამშვიდებელი კრემი (მაგ. ალოე ვერა)",
      "მესამე ხარისხის დამწვრობა (კანის ყველა ფენა) — სასწრაფოდ წავუსვათ ძმარი ან სპირტი",
      "ეს არ არის დამწვრობა, კანი უბრალოდ გაირუჯა და დახმარება არ სჭირდება"
    ],
    correctAnswerIndex: 0,
    explanation: "ყოჩაღ! ეს არის 1-ლი ხარისხის დამწვრობა, რადგან მხოლოდ ზედა ფენა (ეპიდერმისი) გაწითლდა ბუშტუკების გარეშე. გრილი წყალი და ალოეს გელი საუკეთესოდ ამშვიდებს მას!"
  }
];

const burnDegreeInfosGeo: Record<number, string> = {
  1: "პირველი ხარისხი (ეპიდერმისი): ზიანდება მხოლოდ კანის ზედაპირი. კანი წითლდება და ცხელდება. იგრძნობა მსუბუქი წვა.",
  2: "მეორე ხარისხი (ეპიდერმისი და დერმა): ზიანდება შუა ფენაც. ჩნდება სითხით სავსე მტკივნეული ბუშტუკები. არ გახეთქო ისინი!",
  3: "მესამე ხარისხი (ჰიპოდერმისი): ზიანდება კანის სამივე ფენა, ცხიმი და ნერვები. კანი შავდება ან თეთრდება და სჭირდება ექიმი!"
};

export default function SkinShield({ onEarnPoints }: SkinShieldProps) {
  const [activeSubTab, setActiveSubTab] = useState<"burn" | "langer">("burn");
  const [selectedBurnDegree, setSelectedBurnDegree] = useState<1 | 2 | 3>(1);
  const [selectedCutType, setSelectedCutType] = useState<"parallel" | "perpendicular" | null>(null);
  const [isHealingAnimationActive, setIsHealingAnimationActive] = useState<boolean>(false);
  const [langerHealedStatus, setLangerHealedStatus] = useState<"none" | "good" | "bad">("none");

  const [questActive, setQuestActive] = useState<boolean>(false);
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [questFinished, setQuestFinished] = useState<boolean>(false);

  const activeCase = casesData[currentCaseIndex];

  const handleBurnDegreeChange = (degree: 1 | 2 | 3) => {
    setSelectedBurnDegree(degree);
    if (degree === 1) playSound("click");
    else if (degree === 2) playSound("pop");
    else playSound("fail");
  };

  const handleCutAction = (type: "parallel" | "perpendicular") => {
    setSelectedCutType(type);
    setIsHealingAnimationActive(true);
    playSound("click");

    setTimeout(() => {
      setIsHealingAnimationActive(false);
      if (type === "parallel") {
        setLangerHealedStatus("good");
        playSound("powerup");
        onEarnPoints(10, 0);
      } else {
        setLangerHealedStatus("bad");
        playSound("fail");
      }
    }, 1500);
  };

  const startQuest = () => {
    setQuestActive(true);
    setCurrentCaseIndex(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setIsCorrect(null);
    setStarsEarned(0);
    setQuestFinished(false);
    playSound("click");
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    playSound("click");
  };

  const submitQuestAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswerSubmitted(true);
    const correct = selectedAnswer === activeCase.correctAnswerIndex;
    setIsCorrect(correct);
    if (correct) {
      playSound("success");
      setStarsEarned((prev) => prev + 1);
    } else {
      playSound("fail");
    }
  };

  const nextCase = () => {
    if (currentCaseIndex < casesData.length - 1) {
      setCurrentCaseIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setIsCorrect(null);
      playSound("click");
    } else {
      setQuestFinished(true);
      onEarnPoints(30, starsEarned);
      playSound("success");
    }
  };

  const resetQuest = () => {
    setQuestActive(false);
    setQuestFinished(false);
    playSound("click");
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-3xl bg-gradient-to-br from-rose-100 via-amber-50 to-sky-100 border-4 border-rose-300 shadow-2xl relative overflow-hidden">
      {/* Playful background blobs for shape */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Visual Header styled cleanly and brightly */}
      <div className="bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 text-slate-950 p-6 rounded-2xl border-4 border-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-rose-400">
            <Shield className="w-8 h-8 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h2 id="skin-shield-title" className="text-xl md:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 drop-shadow-xs">
              კანის ფარი: დამწვრობა და ქირურგიული განაკვეთები 🛡️
            </h2>
            <p className="text-xs text-slate-800 font-extrabold mt-0.5">
              Skin Shield (Layers, Burns & Incisions) — კლინიკური ქეისები ეპიდერმისის სიღრმეზე და კანის დაჭიმულობის ხაზებზე
            </p>
          </div>
        </div>
        <div className="bg-white/90 text-rose-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border-2 border-rose-400 flex items-center gap-1.5 self-stretch md:self-auto justify-center shadow-sm">
          <Activity className="w-4 h-4 animate-bounce" />
          სამედიცინო კურსი
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        
        {/* LEFT COLUMN: SKIN SHIELD LAYERS - Col span 7 */}
        <div className="lg:col-span-7 bg-white/95 p-6 rounded-3xl border-4 border-rose-400 shadow-xl relative min-h-[580px] flex flex-col justify-between">
          <div>
            {/* Header of Left Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b-2 border-rose-100">
              <h3 className="text-lg font-black text-rose-600 flex items-center gap-2">
                <span>🛡️ კანის ფენების ლაბორატორია</span>
              </h3>
              {/* Tabs Inside the simulator box */}
              <div className="flex gap-1.5 bg-rose-50 p-1.5 rounded-2xl border-2 border-rose-200">
                <button
                  onClick={() => { setActiveSubTab("burn"); playSound("click"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeSubTab === "burn"
                      ? "bg-rose-500 text-white shadow-md scale-102"
                      : "text-rose-600 hover:bg-rose-100"
                  }`}
                >
                  დამწვრობა
                </button>
                <button
                  onClick={() => { setActiveSubTab("langer"); playSound("click"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeSubTab === "langer"
                      ? "bg-rose-500 text-white shadow-md scale-102"
                      : "text-rose-600 hover:bg-rose-100"
                  }`}
                >
                  ლანგერის ხაზები
                </button>
              </div>
            </div>

            {/* TAB 1: BURN SIMULATOR */}
            {activeSubTab === "burn" && (
              <div className="space-y-5">
                <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-300 font-extrabold text-xs text-amber-950 leading-relaxed flex gap-2.5 items-start shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-spin-slow" />
                  <p>
                    💡 გაიგე, როგორ აღწევს სითბური დაზიანება კანის სხვადასხვა ფენებში. აირჩიე დამწვრობის ხარისხი ქვემოთ და დააკვირდი ჩხვლეტის/დაზიანების სიღრმესა და კანის რეაქციას.
                  </p>
                </div>

                {/* 3D Stacked Skin Layers Stage */}
                <div className="bg-gradient-to-b from-sky-50 to-white p-5 rounded-2xl border-4 border-rose-200 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden shadow-inner">
                  
                  {/* Outer Frame Wrapper */}
                  <div className="relative w-full max-w-[340px] aspect-[4/3] flex items-center justify-center">
                    
                    {/* SVG layers representing Epidermis, Dermis, Hypodermis isometric stack */}
                    <svg viewBox="0 0 240 180" className="w-full h-full overflow-visible">
                      
                      {/* Laser / Needle pointer indicating penetration depth */}
                      <g>
                        {/* 1st degree indicator */}
                        {selectedBurnDegree === 1 && (
                          <motion.g initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring" }}>
                            {/* Burn ray / pointer */}
                            <line x1="60" y1="20" x2="110" y2="48" stroke="#ef4444" strokeWidth="3" strokeDasharray="3,3" className="animate-pulse" />
                            <circle cx="110" cy="48" r="4.5" fill="#f87171" className="animate-ping" />
                            <circle cx="110" cy="48" r="3" fill="#ef4444" />
                            {/* Burn sparks */}
                            <path d="M 110,48 L 105,42 M 110,48 L 115,41 M 110,48 L 118,52" stroke="#f59e0b" strokeWidth="1.5" />
                          </motion.g>
                        )}

                        {/* 2nd degree indicator */}
                        {selectedBurnDegree === 2 && (
                          <motion.g initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring" }}>
                            {/* Ray penetrating to Dermis */}
                            <line x1="60" y1="20" x2="120" y2="84" stroke="#f97316" strokeWidth="3" strokeDasharray="3,3" className="animate-pulse" />
                            {/* Blister icons around the point */}
                            <circle cx="120" cy="84" r="5.5" fill="#fb923c" className="animate-ping" />
                            <circle cx="120" cy="84" r="3.5" fill="#f97316" />
                            {/* Blisters details on Epidermis and Dermis */}
                            <circle cx="115" cy="52" r="3" fill="#fb923c" stroke="#f97316" strokeWidth="0.8" opacity="0.9" className="animate-bounce" />
                            <circle cx="128" cy="55" r="2.2" fill="#fb923c" stroke="#f97316" strokeWidth="0.8" opacity="0.9" />
                          </motion.g>
                        )}

                        {/* 3rd degree indicator */}
                        {selectedBurnDegree === 3 && (
                          <motion.g initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring" }}>
                            {/* Ray penetrating deep to Hypodermis */}
                            <line x1="60" y1="20" x2="130" y2="128" stroke="#b91c1c" strokeWidth="3.5" strokeDasharray="3,3" />
                            <circle cx="130" cy="128" r="7" fill="#dc2626" className="animate-ping" />
                            <circle cx="130" cy="128" r="4" fill="#7f1d1d" />
                            
                            {/* Charred/Carbonized skin overlay indicator */}
                            <ellipse cx="120" cy="54" rx="14" ry="4" fill="#374151" stroke="#111827" strokeWidth="1" opacity="0.9" />
                            <ellipse cx="128" cy="88" rx="12" ry="4" fill="#374151" stroke="#111827" strokeWidth="1" opacity="0.8" />
                          </motion.g>
                        )}
                      </g>

                      {/* LAYER 1: EPIDERMIS (Coral Red/Orange) */}
                      <g className="transition-all duration-300">
                        {/* Isometric top surface */}
                        <path 
                          d="M 120,35 L 210,50 L 120,65 L 30,50 Z" 
                          fill={selectedBurnDegree >= 1 ? "#ef4444" : "#fca5a5"} 
                          stroke={selectedBurnDegree >= 1 ? "#b91c1c" : "#f87171"}
                          strokeWidth="2"
                        />
                        {/* Front side extrusion */}
                        <path 
                          d="M 30,50 L 120,65 L 120,73 L 30,58 Z" 
                          fill={selectedBurnDegree >= 1 ? "#dc2626" : "#f87171"} 
                          stroke={selectedBurnDegree >= 1 ? "#991b1b" : "#fca5a5"} 
                          strokeWidth="1.5"
                        />
                        {/* Back side extrusion */}
                        <path 
                          d="M 120,65 L 210,50 L 210,58 L 120,73 Z" 
                          fill={selectedBurnDegree >= 1 ? "#b91c1c" : "#ef4444"} 
                          stroke={selectedBurnDegree >= 1 ? "#7f1d1d" : "#fca5a5"} 
                          strokeWidth="1.5"
                        />
                        {/* Text Label on top */}
                        <text x="120" y="47" textAnchor="middle" fill="#fff" className="text-[10px] font-black tracking-wider pointer-events-none drop-shadow-md select-none">
                          EPIDERMIS (ეპიდერმისი)
                        </text>
                      </g>

                      {/* LAYER 2: DERMIS (Soft Orange) */}
                      <g className="transition-all duration-300">
                        {/* Isometric surface */}
                        <path 
                          d="M 120,73 L 210,88 L 120,103 L 30,88 Z" 
                          fill={selectedBurnDegree >= 2 ? "#f97316" : "#fed7aa"} 
                          stroke={selectedBurnDegree >= 2 ? "#c2410c" : "#fb923c"}
                          strokeWidth="2"
                        />
                        {/* Front side extrusion */}
                        <path 
                          d="M 30,88 L 120,103 L 120,111 L 30,96 Z" 
                          fill={selectedBurnDegree >= 2 ? "#ea580c" : "#fb923c"} 
                          stroke={selectedBurnDegree >= 2 ? "#9a3412" : "#fed7aa"} 
                          strokeWidth="1.5"
                        />
                        {/* Back side extrusion */}
                        <path 
                          d="M 120,103 L 210,88 L 210,96 L 120,111 Z" 
                          fill={selectedBurnDegree >= 2 ? "#c2410c" : "#f97316"} 
                          stroke={selectedBurnDegree >= 2 ? "#7c2d12" : "#fed7aa"} 
                          strokeWidth="1.5"
                        />
                        <text x="120" y="85" textAnchor="middle" fill={selectedBurnDegree >= 2 ? "#fff" : "#7c2d12"} className="text-[10px] font-black tracking-wider pointer-events-none select-none">
                          DERMIS (დერმა)
                        </text>
                        {/* Blood vessels icons inside Dermis representation */}
                        {selectedBurnDegree >= 2 && (
                          <path d="M 60,94 Q 70,86 85,95 T 110,90" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.65" />
                        )}
                      </g>

                      {/* LAYER 3: HYPODERMIS (Yellow/Fat) */}
                      <g className="transition-all duration-300">
                        {/* Isometric surface */}
                        <path 
                          d="M 120,111 L 210,126 L 120,141 L 30,126 Z" 
                          fill={selectedBurnDegree >= 3 ? "#eab308" : "#fef08a"} 
                          stroke={selectedBurnDegree >= 3 ? "#a16207" : "#facc15"}
                          strokeWidth="2"
                        />
                        {/* Front side extrusion */}
                        <path 
                          d="M 30,126 L 120,141 L 120,149 L 30,134 Z" 
                          fill={selectedBurnDegree >= 3 ? "#ca8a04" : "#facc15"} 
                          stroke={selectedBurnDegree >= 3 ? "#854d0e" : "#fef08a"} 
                          strokeWidth="1.5"
                        />
                        {/* Back side extrusion */}
                        <path 
                          d="M 120,141 L 210,126 L 210,134 L 120,149 Z" 
                          fill={selectedBurnDegree >= 3 ? "#a16207" : "#eab308"} 
                          stroke={selectedBurnDegree >= 3 ? "#713f12" : "#fef08a"} 
                          strokeWidth="1.5"
                        />
                        <text x="120" y="123" textAnchor="middle" fill={selectedBurnDegree >= 3 ? "#fff" : "#713f12"} className="text-[10px] font-black tracking-wider pointer-events-none select-none">
                          HYPODERMIS (ჰიპოდერმისი)
                        </text>
                      </g>

                      {/* Bone base decoration */}
                      <path d="M 30,149 Q 120,165 210,149" stroke="#94a3b8" strokeWidth="3" fill="none" opacity="0.4" />
                    </svg>

                    {/* Description label on top of the graphics card as seen in screenshot */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 border-2 border-rose-350 px-3.5 py-2.5 rounded-xl shadow-md z-10">
                      <span className="text-[9px] uppercase font-black text-rose-600 block mb-0.5">სიმულატორის სტატუსი:</span>
                      <p className="text-[11px] text-slate-800 font-bold leading-relaxed">
                        {burnDegreeInfosGeo[selectedBurnDegree]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pill Buttons below simulator */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleBurnDegreeChange(1)}
                    className={`p-3.5 rounded-2xl text-[11px] font-black text-center transition-all cursor-pointer border-3 ${
                      selectedBurnDegree === 1
                        ? "bg-rose-500 text-white border-rose-600 shadow-md scale-[1.02]"
                        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    }`}
                  >
                    1-ლი ხარისხი (ეპიდერმისი)
                  </button>
                  <button
                    onClick={() => handleBurnDegreeChange(2)}
                    className={`p-3.5 rounded-2xl text-[11px] font-black text-center transition-all cursor-pointer border-3 ${
                      selectedBurnDegree === 2
                        ? "bg-orange-500 text-white border-orange-600 shadow-md scale-[1.02]"
                        : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                    }`}
                  >
                    მე-2 ხარისხი (დერმა)
                  </button>
                  <button
                    onClick={() => handleBurnDegreeChange(3)}
                    className={`p-3.5 rounded-2xl text-[11px] font-black text-center transition-all cursor-pointer border-3 ${
                      selectedBurnDegree === 3
                        ? "bg-amber-500 text-slate-950 border-amber-600 shadow-md scale-[1.02]"
                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    მე-3 ხარისხი (ჰიპოდერმისი)
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LANGER'S INCISION HEALER */}
            {activeSubTab === "langer" && (
              <div className="space-y-5">
                <div className="bg-sky-50 p-3.5 rounded-2xl border-2 border-sky-300 font-extrabold text-xs text-sky-950 leading-relaxed flex gap-2.5 items-start shadow-xs">
                  <Sparkles className="w-5 h-5 text-sky-500 shrink-0 mt-0.5 animate-pulse" />
                  <p>
                    🧬 **ლანგერის ხაზები (Tension Lines)** არის კოლაგენის ბოჭკოების ბუნებრივი მიმართულება კანში. 
                    განაკვეთი, რომელიც კეთდება ხაზების **პარალელურად**, მარტივად ხორცდება. ხოლო **პერპენდიკულარული** განაკვეთი იხევა და ტოვებს დიდ ნაწიბურს!
                  </p>
                </div>

                {/* Suture/Incision Stage */}
                <div className="bg-gradient-to-b from-sky-50 to-white p-5 rounded-2xl border-4 border-sky-200 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden">
                  
                  {/* Visual Langer patch */}
                  <div className="relative w-full max-w-[340px] aspect-[4/3] bg-rose-50/20 rounded-2xl border border-rose-150 flex flex-col items-center justify-center p-4 shadow-inner">
                    
                    {/* Background Faint Langer curves (Tension vectors) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                      <path d="M 10,40 Q 150,55 330,40" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                      <path d="M 10,80 Q 150,95 330,80" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                      <path d="M 10,120 Q 150,135 330,120" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                      <path d="M 10,160 Q 150,175 330,160" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                      <path d="M 10,200 Q 150,215 330,200" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                    </svg>

                    {/* Micro descriptive header */}
                    <span className="absolute top-3 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                      კანის ფართობი (ლანგერის ჰორიზონტალური ბოჭკოები)
                    </span>

                    {/* Suture & Cut Animation Stage */}
                    <div className="relative w-52 h-36 bg-white rounded-2xl border-3 border-dashed border-rose-350 flex items-center justify-center overflow-hidden shadow-md">
                      
                      {/* Idle state */}
                      {selectedCutType === null && (
                        <div className="text-center p-3">
                          <Scissors className="w-10 h-10 text-rose-500 mx-auto mb-2 animate-bounce" />
                          <span className="text-[11px] text-slate-600 font-extrabold block">აირჩიე განაკვეთის მიმართულება ქვემოთ</span>
                        </div>
                      )}

                      {/* HEALING ANIMATION IN ACTION */}
                      {isHealingAnimationActive && (
                        <div className="flex flex-col items-center justify-center text-center">
                          {/* Animated cutting laser line */}
                          {selectedCutType === "parallel" ? (
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: 140 }} 
                              transition={{ duration: 1.2 }}
                              className="h-2 bg-emerald-500 rounded-full relative"
                            >
                              <div className="absolute right-0 -top-1.5 w-5 h-5 bg-yellow-400 rounded-full animate-ping" />
                            </motion.div>
                          ) : (
                            <motion.div 
                              initial={{ height: 0 }} 
                              animate={{ height: 90 }} 
                              transition={{ duration: 1.2 }}
                              className="w-2.5 bg-rose-600 rounded-full relative"
                            >
                              <div className="absolute bottom-0 -left-1.5 w-5 h-5 bg-red-500 rounded-full animate-ping" />
                            </motion.div>
                          )}
                          <span className="text-[10px] text-rose-600 font-black tracking-wider uppercase mt-4 animate-pulse">
                            ქირურგიული კერვა... 🧵
                          </span>
                        </div>
                      )}

                      {/* OUTCOME: PARALLEL CUT (Minimal scar) */}
                      {!isHealingAnimationActive && langerHealedStatus === "good" && (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-3 flex flex-col items-center">
                          {/* Suture graphic */}
                          <div className="flex gap-1 items-center justify-center mb-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            <div className="h-1 bg-emerald-600 w-28 relative flex justify-around rounded-full">
                              <span className="text-[8px] -top-2 relative text-emerald-300 font-black">✖</span>
                              <span className="text-[8px] -top-2 relative text-emerald-300 font-black">✖</span>
                              <span className="text-[8px] -top-2 relative text-emerald-300 font-black">✖</span>
                              <span className="text-[8px] -top-2 relative text-emerald-300 font-black">✖</span>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-black block">იდეალური ნაკერი! ✨</span>
                          <span className="text-[10px] text-slate-600 font-bold block mt-1.5 leading-tight">ჭრილობა პარალელურია, დაჭიმულობა დაბალია. ნაწიბური მინიმალური იქნება!</span>
                        </motion.div>
                      )}

                      {/* OUTCOME: PERPENDICULAR CUT (Bad open scar) */}
                      {!isHealingAnimationActive && langerHealedStatus === "bad" && (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-2 flex flex-col items-center w-full px-4">
                          {/* Pull-apart force arrows */}
                          <div className="flex items-center justify-between w-full mb-1.5 text-[10px] text-red-500 font-extrabold">
                            <span>⬅️ გაწევა</span>
                            <span>გაწევა ➡️</span>
                          </div>
                          {/* Wide jagged scar gap */}
                          <div className="w-10 h-16 bg-red-100 border-2 border-red-500 rounded-xl flex flex-col justify-around py-1 items-center shadow-inner">
                            <span className="text-red-600 text-[10px] font-black">✖</span>
                            <span className="text-red-600 text-[10px] font-black">✖</span>
                            <span className="text-red-600 text-[10px] font-black">✖</span>
                          </div>
                          <span className="text-xs text-red-500 font-black block mt-2">მაღალი დაჭიმულობა! ⚠️</span>
                          <span className="text-[10px] text-slate-650 font-bold block mt-1 leading-tight">ჭრილობა პერპენდიკულარულია, ამიტომ კანი იხევა და ტოვებს დიდ ნაწიბურს!</span>
                        </motion.div>
                      )}

                    </div>

                    {/* Helpful indicator guide footer */}
                    {langerHealedStatus !== "none" && (
                      <button 
                        onClick={() => { setSelectedCutType(null); setLangerHealedStatus("none"); playSound("click"); }}
                        className="absolute bottom-2.5 bg-slate-100 border-2 border-slate-200 px-4 py-1.5 rounded-xl text-[10px] text-slate-700 font-black hover:bg-slate-200 cursor-pointer shadow-xs"
                      >
                        თავიდან სცადე ↻
                      </button>
                    )}
                  </div>
                </div>

                {/* Healer Interaction buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={isHealingAnimationActive}
                    onClick={() => handleCutAction("parallel")}
                    className={`p-3.5 rounded-2xl text-[11px] font-black text-center transition-all cursor-pointer border-3 ${
                      selectedCutType === "parallel"
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.02]"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    ↔️ პარალელური განაკვეთი (Parallel Cut)
                  </button>
                  <button
                    disabled={isHealingAnimationActive}
                    onClick={() => handleCutAction("perpendicular")}
                    className={`p-3.5 rounded-2xl text-[11px] font-black text-center transition-all cursor-pointer border-3 ${
                      selectedCutType === "perpendicular"
                        ? "bg-rose-500 text-white border-rose-600 shadow-md scale-[1.02]"
                        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    }`}
                  >
                    ↕️ პერპენდიკულარული განაკვეთი (Perpendicular)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Left panel subtle signature/branding */}
          <div className="mt-4 pt-4 border-t-2 border-rose-200 flex justify-between items-center text-[10px] text-slate-500 font-black relative z-10">
            <span>მოდული 3: EPIDERMAL THICKNESS & REPAIR</span>
            <span>CEREBRUM LABS CO. 🔬🧬</span>
          </div>
        </div>

        {/* RIGHT COLUMN: SKIN QUESTS / QUIZ SYSTEM - Col span 5 */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* SKIN QUESTS CONTAINER */}
          <div className="bg-white border-4 border-rose-400 p-6 rounded-3xl shadow-xl min-h-[500px] flex flex-col justify-between text-slate-900">
            
            {/* Quest Header */}
            <div>
              <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-rose-100">
                <span className="bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl border-2 border-rose-300 flex items-center gap-1">
                  ⚡ SKIN QUESTS
                </span>
                {/* Stars earned badge */}
                <div className="flex items-center gap-1 bg-amber-100 text-amber-800 border-2 border-amber-300 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
                  <span>{starsEarned}/3 ვარსკვლავი</span>
                </div>
              </div>

              {/* QUEST NOT ACTIVE: WELCOME CARDS */}
              {!questActive && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-1.5 leading-tight">
                      დაიბრუნე კანი-ფარი! 🛡️
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-extrabold mt-1.5">
                      კანი შენი სხეულის ერთგვარი აბჯარია. მოდი, გადავჭრათ რეალური კლინიკური და ქირურგიული ქეისები ეპიდერმისის ფენებისა და კანის დაჭიმულობის ხაზების ცოდნის გამოყენებით!
                    </p>
                  </div>

                  {/* Sub emergency status box */}
                  <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-200 relative overflow-hidden">
                    {/* Glowing effect inside */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl" />
                    
                    <span className="text-[10px] font-black text-rose-600 block uppercase tracking-widest mb-1">
                      🚨 გადაუდებელი შემთხვევა
                    </span>
                    <h5 className="text-xs font-extrabold text-slate-900 block mb-1">
                      სწრაფი დიაგნოსტიკის გამოწვევა
                    </h5>
                    <p className="text-[11px] text-slate-750 leading-normal font-extrabold">
                      დაიწყე კანის დაცვის მისია, რომ გამოსცადო შენი სამედიცინო უნარები და მიიღო ბონუს ქულები!
                    </p>
                  </div>

                  {/* Call to action button */}
                  <button
                    onClick={startQuest}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Sparkles className="w-4 h-4 text-white stroke-[3] animate-pulse" />
                    დაიწყე მისია (Start Quest)
                  </button>
                </div>
              )}

              {/* QUEST ACTIVE CASE */}
              {questActive && !questFinished && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Case Progress Status */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-extrabold border-b border-rose-100 pb-2">
                    <span>ქეისი {currentCaseIndex + 1} / {casesData.length}</span>
                    <span className="text-rose-600 font-black uppercase">{activeCase.title}</span>
                  </div>

                  {/* Scenario box */}
                  <div className="bg-rose-50/50 p-3.5 rounded-2xl border-2 border-rose-100">
                    <span className="text-[9px] font-black text-rose-500 block uppercase mb-1">სამედიცინო სცენარი:</span>
                    <p className="text-xs text-slate-800 font-bold leading-relaxed">
                      {activeCase.scenario}
                    </p>
                  </div>

                  {/* Question Prompt */}
                  <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-200">
                    <span className="text-[9px] font-black text-amber-600 block uppercase mb-1">კითხვა ექიმს:</span>
                    <p className="text-xs text-amber-900 font-extrabold leading-relaxed">
                      {activeCase.question}
                    </p>
                  </div>

                  {/* Question Options */}
                  <div className="space-y-2.5">
                    {activeCase.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      let btnClass = "bg-rose-50/30 border-rose-200 text-slate-800 hover:bg-rose-50 hover:border-rose-300";

                      if (answerSubmitted) {
                        if (idx === activeCase.correctAnswerIndex) {
                          btnClass = "bg-emerald-500 text-white border-emerald-600 font-black";
                        } else if (isSelected) {
                          btnClass = "bg-rose-500 text-white border-rose-600 font-black";
                        } else {
                          btnClass = "bg-slate-100/50 border-slate-100 text-slate-400 opacity-50";
                        }
                      } else if (isSelected) {
                        btnClass = "bg-rose-100 border-rose-450 text-rose-800 font-black shadow-md scale-102";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={answerSubmitted}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full p-3.5 rounded-2xl text-xs text-left border-3 transition-all flex items-start gap-2.5 cursor-pointer ${btnClass}`}
                        >
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight mt-0.5 select-none ${
                            answerSubmitted && idx === activeCase.correctAnswerIndex ? 'bg-white text-emerald-600' : 'bg-rose-200 text-rose-800'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-relaxed font-bold">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUEST COMPLETED SCREEN */}
              {questActive && questFinished && (
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 border-3 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <Award className="w-9 h-9 text-amber-500 fill-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-950">მისია წარმატებით შესრულდა! 🎉</h4>
                    <p className="text-xs text-slate-600 mt-1 font-bold leading-relaxed">
                      შენ წარმატებით გადაჭერი ყველა გადაუდებელი სამედიცინო და ქირურგიული ქეისი და დაიმსახურე ჯილდოები!
                    </p>
                  </div>

                  {/* Summary card stats */}
                  <div className="bg-gradient-to-br from-rose-50 to-sky-50 p-4 rounded-2xl border-3 border-rose-200 max-w-xs mx-auto text-left space-y-2 font-extrabold text-xs shadow-md">
                    <div className="flex justify-between">
                      <span className="text-slate-600">შესრულებული კურსი:</span>
                      <span className="text-rose-600 font-black">კანის ბარიერის დაცვა</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">მოპოვებული ვარსკვლავები:</span>
                      <span className="text-amber-600 flex items-center gap-1 font-black">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {starsEarned} / 3 ვარსკვლავი
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">ბონუს ქულები:</span>
                      <span className="text-emerald-600 font-black">+60 XP ქულა</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quest Footer Actions */}
            <div className="mt-4 pt-3 border-t-2 border-rose-100">
              {questActive && !questFinished && (
                <div>
                  {!answerSubmitted ? (
                    <button
                      disabled={selectedAnswer === null}
                      onClick={submitQuestAnswer}
                      className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                        selectedAnswer === null
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed border-3 border-slate-300"
                          : "bg-rose-500 hover:bg-rose-600 text-white cursor-pointer shadow-md border-3 border-rose-600"
                      }`}
                    >
                      პასუხის გაგზავნა 🩺
                    </button>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-rose-50 p-3.5 rounded-2xl border-2 border-rose-200 shadow-inner">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold mb-1.5">
                          {isCorrect ? (
                            <span className="text-emerald-600 flex items-center gap-1 font-black">✨ ბრწყინვალეა! სწორია!</span>
                          ) : (
                            <span className="text-rose-600 flex items-center gap-1 font-black">⚠️ უი, შეცდომაა!</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-bold">
                          {activeCase.explanation}
                        </p>
                      </div>
                      <button
                        onClick={nextCase}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg border-3 border-rose-600 transition-all active:scale-95 cursor-pointer uppercase flex items-center justify-center gap-1.5"
                      >
                        {currentCaseIndex === casesData.length - 1 ? "შედეგების ნახვა 🏆" : "შემდეგი შემთხვევა ➡️"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {questActive && questFinished && (
                <button
                  onClick={resetQuest}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs py-3.5 rounded-2xl transition-all cursor-pointer uppercase border-3 border-slate-350 shadow-md"
                >
                  მისიების მენიუში დაბრუნება ↻
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
