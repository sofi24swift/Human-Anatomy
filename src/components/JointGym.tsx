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
      <div className="lg:col-span-6 bg-white p-5 rounded-3xl border-4 border-emerald-500 shadow-xl relative overflow-hidden flex flex-col items-center text-slate-850">
        <h3 className="text-xl font-black text-emerald-600 flex items-center gap-2 mb-2 self-start uppercase tracking-wider">
          <Dumbbell className="w-6 h-6 text-emerald-500 animate-bounce" />
          სახსრების სავარჯიშო დარბაზი
        </h3>
        <p className="text-xs text-emerald-900 mb-6 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 self-start font-bold leading-relaxed">
          🦴 დააკლიკე ჩონჩხის კაშკაშა მწვანე წერტილებს (სახსრებს), რომ გაიგო მათი სახელი და აიძულო ივარჯიშონ!
        </p>

        {/* Skeleton canvas drawing */}
        <div className="relative w-full max-w-[280px] h-[360px] bg-slate-50 rounded-3xl p-6 shadow-inner flex justify-center border-4 border-slate-200">
          {/* Neon Grid background */}
          <div className="absolute inset-0 bg-opacity-10 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

          <svg viewBox="0 0 100 130" className="w-[124px] h-full overflow-visible relative z-10">
            {/* Simple skeletal system */}
            <g stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Skull */}
              <circle cx="50" cy="15" r="7" fill="#ffffff" />
              <path d="M 47,21 L 53,21 L 50,24 Z" fill="#475569" />
              
              {/* Vertebral column / Spine */}
              <line x1="50" y1="22" x2="50" y2="75" strokeWidth="3" />
              {/* Rib cage lines */}
              <line x1="38" y1="35" x2="62" y2="35" />
              <line x1="36" y1="45" x2="64" y2="45" />
              <line x1="38" y1="55" x2="62" y2="55" />
              <line x1="42" y1="65" x2="58" y2="65" />

              {/* Pelvis bone */}
              <path d="M 40,75 L 60,75 L 56,83 L 44,83 Z" fill="rgba(71, 85, 105, 0.4)" />

              {/* Left arm bones (viewer's left = biological right, let's keep it simple) */}
              <line x1="38" y1="30" x2="26" y2="47" strokeWidth="2" /> {/* Shoulder to elbow */}
              <line x1="26" y1="47" x2="16" y2="65" strokeWidth="1.8" /> {/* Elbow to wrist */}
              <circle cx="16" cy="65" r="2" fill="#475569" />

              {/* Right arm bones (biological left) */}
              <line x1="62" y1="30" x2="74" y2="47" strokeWidth="2" id="ske-left-shoulder" />
              <line x1="74" y1="47" x2="84" y2="65" strokeWidth="1.8" id="ske-left-elbow" />
              <circle cx="84" cy="65" r="2" fill="#475569" />

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
                      <rect x="0" y="-8" width="55" height="13" rx="3" fill="white" stroke="#10b981" strokeWidth="1.5" />
                      <text x="5" y="1" fill="#059669" fontSize="6.5" fontWeight="bold">
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
        <div className="mt-4 bg-slate-50 border-2 border-slate-200 rounded-2xl py-2 px-4 text-center shadow-xs">
          <span className="text-xs text-emerald-600 font-bold">აკონტროლებ: </span>
          <span className="font-black text-slate-800">{activeJoint.name}</span>
        </div>
      </div>

      {/* Joint Workout Console */}
      <div className="lg:col-span-6 flex flex-col gap-5">
        {/* Joint description card */}
        <div className="bg-white rounded-3xl border-4 border-slate-200 p-5 shadow-lg relative overflow-hidden text-slate-800">
          <div className="bg-amber-50 text-amber-700 font-black text-xs uppercase px-3 py-1.5 rounded-full w-fit mb-3 flex items-center gap-1 border border-amber-200">
            <Info className="w-4 h-4 text-amber-600" />
            სხეულის საიდუმლოებები
          </div>

          <h3 className="text-lg font-black text-slate-900 mb-1">{activeJoint.name}</h3>
          <p className="text-[11px] font-black text-emerald-600 uppercase mb-3 block">
            📐 ტიპი: {activeJoint.type}
          </p>

          <p className="text-sm text-slate-700 mb-4 leading-relaxed font-bold">
            {activeJoint.description}
          </p>

          {/* Fact balloon */}
          <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 shadow-sm relative">
            <span className="absolute top-2 right-3 text-2xl animate-spin-slow">🌟</span>
            <span className="text-xs font-black text-sky-600 block mb-1">💡 საინტერესო ფაქტი ბავშვისთვის:</span>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
              "{activeJoint.fact}"
            </p>
          </div>
        </div>

        {/* Joint Workout simulator actions */}
        <div className="bg-white rounded-3xl border-4 border-emerald-500 p-5 text-slate-850 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-black flex items-center gap-1 text-emerald-600 uppercase tracking-wider">
              <Dumbbell className="w-5 h-5" />
              გავავარჯიშოთ სახსრები!
            </span>
            <div className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-black text-emerald-700 flex items-center gap-0.5 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              ⭐ +20 ქულა ბალანსზე!
            </div>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed font-bold">
            დააწკაპუნე სახსრის მოძრაობის რომელიმე ღილაკს, რომ ივარჯიშო და აავსო ვარჯიშის პროგრესის ზოლი!
          </p>

          {/* Progress Tracker bar */}
          <div className="mb-4 bg-slate-100 border border-slate-200 rounded-full h-5 p-1 flex items-center shadow-inner relative">
            <motion.div
              animate={{ width: `${muscleWorkoutLevel}%` }}
              className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-300"
              style={{ minWidth: "10px" }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-800 text-center uppercase tracking-wider">
              {muscleWorkoutLevel === 0 ? "მიყევი მოძრაობებს აფეთქებამდე" : `ვარჯიშის ძალა: ${muscleWorkoutLevel}%`}
            </span>
          </div>

          {/* Training Action buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {activeJoint.movements.map((mov) => (
              <button
                key={mov}
                onClick={() => handleSimulateMovement(mov)}
                className="bg-white text-emerald-600 hover:text-emerald-500 hover:border-emerald-400 border-2 border-slate-200 p-3 rounded-2xl text-xs font-black shadow-sm hover:scale-[1.03] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                {mov.split(" (")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
