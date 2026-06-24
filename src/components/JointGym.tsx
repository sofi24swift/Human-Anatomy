import { useState } from "react";
import { JointInfo } from "../types";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { Dumbbell, RotateCw, Activity, Heart, Info, Star } from "lucide-react";

const jointsData: JointInfo[] = [
  {
    id: "shoulder",
    name: "მხრის სახსარი",
    type: "ბურთულა-ბუდე (Ball-and-Socket)",
    movements: ["მოხრა (Flexion)", "გაშლა (Extension)", "განზიდვა (Abduction)", "მოზიდვა (Adduction)", "როტაცია (Rotation)"],
    fact: "ეს არის ჩვენი ყოვლისშემძლე სახსარი! ის მოძრაობს თითქმის ყველა მიმართულებით. სწორედ ამის გამო გვიადვილდება ცურვა და კალათბურთის თამაში!",
    description: "აკავშირებს მხრის ძვალსა და ბეჭს. მას აქვს ყველაზე ფართო მოძრაობის დიაპაზონი ჩვენს სხეულში.",
    x: 70,
    y: 28
  },
  {
    id: "elbow",
    name: "იდაყვის სახსარი",
    type: "ჭაღისებრი (Hinge Joint)",
    movements: ["მოხრა (Flexion)", "გაშლა (Extension)"],
    fact: "ის მუშაობს ზუსტად ისე, როგორც ოთახის კარი! კარებს მხოლოდ გაღება და დაკეტვა შეუძლია, იდაყვს კი - მოხრა და გაშლა.",
    description: "აკავშირებს მხრის ძვალს წინამხრის ორ ძვალთან (სხივისა და იდაყვის ძვლები).",
    x: 82,
    y: 40
  },
  {
    id: "wrist",
    name: "მაჯის სახსარი",
    type: "ელიფსური / კონდილარული (Ellipsoid)",
    movements: ["მოხრა (Flexion)", "გაშლა (Extension)", "განზიდვა", "მოზიდვა", "წრიული ბრუნვა (Circumduction)"],
    fact: "მაჯის წყალობით შეგვიძლია ლამაზად ვწეროთ, დავხატოთ და ხალხს ხელით მივესალმოთ! ის მოძრაობს ორ ძირითად მიმართულებაში.",
    description: "აკავშირებს წინამხარს ხელის მტევანთან (მაჯის პატარა ძვლებთან).",
    x: 85,
    y: 53
  },
  {
    id: "hip",
    name: "მენჯ-ბარძაყის სახსარი",
    type: "ბურთულა-ბუდე (Ball-and-Socket)",
    movements: ["მოხრა", "გაშლა", "განზიდვა", "მოზიდვა", "ბრუნვა"],
    fact: "ეს არის სხეულის ერთ-ერთი ყველაზე ძლიერი სახსარი! ის ატარებს ჩვენი სხეულის მთელ წონას, როდესაც დავრბივართ ან ვხტუნავთ.",
    description: "აკავშირებს ბარძაყის ძვალს მენჯის ძვალთან. დაცულია მძლავრი კუნთებითა და იოგებით.",
    x: 65,
    y: 58
  },
  {
    id: "knee",
    name: "მუხლის სახსარი",
    type: "ჭაღისებრი (Hinge Joint)",
    movements: ["მოხრა (Flexion)", "გაშლა (Extension)"],
    fact: "მუხლი ყველაზე დიდი სახსარია სხეულში. მის წინა მხარეს დევს პატარა დამცავი ძვალი - კვირისტავი (Patella), რომელიც მუხლს დარტყმისგან იცავს!",
    description: "აკავშირებს ბარძაყის ძვალს დიდ წვივის ძვალთან.",
    x: 66,
    y: 77
  },
  {
    id: "ankle",
    name: "კოჭ-წვივის სახსარი",
    type: "ჭაღისებრი / ცილინდრული",
    movements: ["დორსალფლექსია (Dorsiflexion - ფეხის ზემოთ აწევა)", "პლანტარფლექსია (Plantar flexion - თითებზე დადგომა)"],
    fact: "კოჭის დახმარებით შეგიძლია ფეხის თითებზე აიწიო ან ქუსლზე დადგე! ის გვეხმარება წონასწორობის შენარჩუნებაში არასწორ გზაზე სიარულისას.",
    description: "აკავშირებს წვივის ძვლებს ფეხის თათთან (კოჭის ძვლებთან).",
    x: 65,
    y: 91
  }
];

interface JointGymProps {
  onEarnPoints: (p: number, s: number) => void;
}

export default function JointGym({ onEarnPoints }: JointGymProps) {
  const [selectedJoint, setSelectedJoint] = useState<string>("shoulder");
  const [muscleWorkoutLevel, setMuscleWorkoutLevel] = useState<number>(0);
  const [activeMovement, setActiveMovement] = useState<string | null>(null);

  const activeJoint = jointsData.find((j) => j.id === selectedJoint) || jointsData[0];

  const handleJointClick = (id: string) => {
    setSelectedJoint(id);
    setMuscleWorkoutLevel(0);
    setActiveMovement(null);
    playSound("click");
  };

  const handleSimulateMovement = (mov: string) => {
    setActiveMovement(mov);
    playSound("pop");
    
    // Simulate exercise level
    setMuscleWorkoutLevel((prev) => {
      const next = prev + 10;
      if (next >= 100) {
        playSound("powerup");
        onEarnPoints(20, 1);
        return 0; // reset
      }
      return next;
    });

    setTimeout(() => {
      setActiveMovement(null);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Skeleton / Clickable joints board */}
      <div className="lg:col-span-6 bg-white/85 p-5 rounded-3xl border-4 border-emerald-200 shadow-xl relative overflow-hidden flex flex-col items-center">
        <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 mb-2 self-start">
          <Dumbbell className="w-6 h-6 text-emerald-500 animate-bounce" />
          სახსრების სავარჯიშო დარბაზი
        </h3>
        <p className="text-xs text-emerald-600 mb-6 bg-emerald-50 p-2.5 rounded-xl self-start">
          🦴 დააკლიკე ჩონჩხის კაშკაშა მწვანე წერტილებს (სახსრებს), რომ გაიგო მათი სახელი და აიძულო ივარჯიშონ!
        </p>

        {/* Skeleton canvas drawing */}
        <div className="relative w-full max-w-[280px] h-[360px] bg-sky-900 rounded-3xl p-6 shadow-inner flex justify-center border-4 border-slate-700">
          {/* Neon Grid background */}
          <div className="absolute inset-0 bg-opacity-20 bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

          <svg viewBox="0 0 100 130" className="w-[124px] h-full overflow-visible relative z-10">
            {/* Simple skeletal system */}
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Skull */}
              <circle cx="50" cy="15" r="7" fill="#f8fafc" />
              <path d="M 47,21 L 53,21 L 50,24 Z" fill="#ffffff" />
              
              {/* Vertebral column / Spine */}
              <line x1="50" y1="22" x2="50" y2="75" strokeWidth="3" />
              {/* Rib cage lines */}
              <line x1="38" y1="35" x2="62" y2="35" />
              <line x1="36" y1="45" x2="64" y2="45" />
              <line x1="38" y1="55" x2="62" y2="55" />
              <line x1="42" y1="65" x2="58" y2="65" />

              {/* Pelvis bone */}
              <path d="M 40,75 L 60,75 L 56,83 L 44,83 Z" fill="rgba(255,255,255,0.7)" />

              {/* Left arm bones (viewer's left = biological right, let's keep it simple) */}
              <line x1="38" y1="30" x2="26" y2="47" strokeWidth="2" /> {/* Shoulder to elbow */}
              <line x1="26" y1="47" x2="16" y2="65" strokeWidth="1.8" /> {/* Elbow to wrist */}
              <circle cx="16" cy="65" r="2" fill="#ffffff" />

              {/* Right arm bones (biological left) */}
              <line x1="62" y1="30" x2="74" y2="47" strokeWidth="2" id="ske-left-shoulder" />
              <line x1="74" y1="47" x2="84" y2="65" strokeWidth="1.8" id="ske-left-elbow" />
              <circle cx="84" cy="65" r="2" fill="#ffffff" />

              {/* Left leg bones */}
              <line x1="44" y1="80" x2="40" y2="103" strokeWidth="2.5" /> {/* Hip to knee */}
              <line x1="40" y1="103" x2="42" y2="124" strokeWidth="2" /> {/* Knee to ankle */}
              <line x1="42" y1="124" x2="36" y2="125" strokeWidth="2.5" /> {/* Foot */}

              {/* Right leg bones */}
              <line x1="56" y1="80" x2="60" y2="103" strokeWidth="2.5" />
              <line x1="60" y1="103" x2="58" y2="124" strokeWidth="2" />
              <line x1="58" y1="124" x2="64" y2="125" strokeWidth="2.5" />
            </g>

            {/* Clickable Joint Circles Glowing / Overlaying */}
            {jointsData.map((joint) => {
              const isSelected = joint.id === selectedJoint;
              
              // Map SVG Coordinates to percentage alignment (simple mapping)
              // We'll calculate specific SVG cx, cy based on biological side matching bone segments
              let cx = 50;
              let cy = 50;

              if (joint.id === "shoulder") { cx = 62; cy = 30; }
              else if (joint.id === "elbow") { cx = 74; cy = 47; }
              else if (joint.id === "wrist") { cx = 84; cy = 65; }
              else if (joint.id === "hip") { cx = 56; cy = 80; }
              else if (joint.id === "knee") { cx = 60; cy = 103; }
              else if (joint.id === "ankle") { cx = 58; cy = 124; }

              const isWorkingOut = isSelected && activeMovement !== null;

              return (
                <g key={joint.id} className="cursor-pointer" onClick={() => handleJointClick(joint.id)}>
                  {/* Outer pulsating wave if selected */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isWorkingOut ? "15" : "8"}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      className="animate-ping opacity-60"
                    />
                  )}
                  {/* Main Joint target dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? "5.5" : "4.5"}
                    fill={isSelected ? "#10b981" : "#34d399"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="hover:scale-150 transition-transform duration-200 shadow-md"
                  />
                  {/* Tooltip name tag */}
                  {isSelected && (
                    <g transform={`translate(${cx + 8}, ${cy - 2})`}>
                      <rect x="0" y="-8" width="55" height="13" rx="3" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
                      <text x="5" y="1" fill="#047857" fontSize="6.5" fontWeight="bold">
                        {joint.name.split(" ")[0]}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Active Work-out Overlay notification */}
          <AnimatePresence>
            {activeMovement && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-4 right-4 bg-emerald-500/90 py-2 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-lg border border-emerald-300 backdrop-blur-xs"
              >
                <Activity className="w-4 h-4 text-white animate-pulse" />
                <span className="text-white font-extrabold text-xs tracking-tight uppercase">
                  {activeMovement}! 🏋️‍♂️
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected joint banner */}
        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl py-2 px-4 text-center">
          <span className="text-xs text-emerald-800">აკონტროლებ: </span>
          <span className="font-bold text-slate-800">{activeJoint.name}</span>
        </div>
      </div>

      {/* Joint Workout Console */}
      <div className="lg:col-span-6 flex flex-col gap-5">
        {/* Joint description card */}
        <div className="bg-white rounded-3xl border-4 border-slate-200 p-5 shadow-lg relative overflow-hidden">
          <div className="bg-amber-100 text-amber-900 font-bold text-xs uppercase px-3 py-1 rounded-full w-fit mb-3 flex items-center gap-1 shadow-inner">
            <Info className="w-4 h-4 text-amber-500" />
            სხეულის საიდუმლოებები
          </div>

          <h3 className="text-lg font-extrabold text-slate-800 mb-1">{activeJoint.name}</h3>
          <p className="text-[11px] font-bold text-emerald-600 uppercase mb-3 block">
            📐 ტიპი: {activeJoint.type}
          </p>

          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            {activeJoint.description}
          </p>

          {/* Fact balloon */}
          <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-150 relative">
            <span className="absolute top-2 right-3 text-2xl animate-spin-slow">🌟</span>
            <span className="text-xs font-bold text-sky-800 block mb-1">💡 საინტერესო ფაქტი ბავშვისთვის:</span>
            <p className="text-xs font-semibold text-sky-950 leading-relaxed italic">
              "{activeJoint.fact}"
            </p>
          </div>
        </div>

        {/* Joint Workout simulator actions */}
        <div className="bg-emerald-500 rounded-3xl border-4 border-emerald-600 p-5 text-white shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-extrabold flex items-center gap-1 text-emerald-100">
              <Dumbbell className="w-5 h-5" />
              გავავარჯიშოთ სახსრები!
            </span>
            <div className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-0.5 shadow-inner">
              <Star className="w-3.5 h-3.5 fill-white" />
              ⭐ +20 ქულა ბალანსზე!
            </div>
          </div>

          <p className="text-xs text-emerald-105 mb-4 leading-relaxed font-semibold">
            დააწკაპუნე სახსრის მოძრაობის რომელიმე ღილაკს, რომ ივარჯიშო და აავსო ვარჯიშის პროგრესის ზოლი!
          </p>

          {/* Progress Tracker bar */}
          <div className="mb-4 bg-emerald-700 rounded-full h-5 p-1 flex items-center shadow-inner relative">
            <motion.div
              animate={{ width: `${muscleWorkoutLevel}%` }}
              className="bg-amber-400 h-full rounded-full transition-all duration-300"
              style={{ minWidth: "10px" }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-50 text-center uppercase tracking-wide">
              {muscleWorkoutLevel === 0 ? "მიყევი მოძრაობებს აფეთქებამდე" : `ვარჯიშის ძალა: ${muscleWorkoutLevel}%`}
            </span>
          </div>

          {/* Training Action buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {activeJoint.movements.map((mov) => (
              <button
                key={mov}
                onClick={() => handleSimulateMovement(mov)}
                className="bg-white/95 text-emerald-800 hover:bg-white border-2 border-emerald-250 p-2.5 rounded-2xl text-xs font-bold shadow-md hover:scale-[1.03] active:scale-95 transition-all text-center flex items-center justify-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5 text-emerald-500" />
                {mov.split(" (")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
