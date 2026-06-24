import { useState } from "react";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { Award, HelpCircle, Check, RotateCcw, Info, Sparkles, BookOpen } from "lucide-react";

interface OrganInfo {
  id: string;
  name: string;
  latinName: string;
  emoji: string;
  analogyTitle: string;
  analogyDesc: string;
  description: string;
  funFact: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  };
}

const organsData: OrganInfo[] = [
  {
    id: "brain",
    name: "ტვინი",
    latinName: "Cerebrum",
    emoji: "🧠",
    analogyTitle: "მთავარი სუპერკომპიუტერი",
    analogyDesc: "ისევე როგორც კომპიუტერი მართავს ყველა აპლიკაციას, შენი ტვინი აკონტროლებს ყველაფერს, რასაც აკეთებ: ფიქრს, სიარულს, სიზმრებს, სიხარულსა და მეხსიერებას!",
    description: "ტვინი ჩვენი ნერვული სისტემის მთავარი ორგანოა. ის მუდმივად იღებს სიგნალებს თვალებიდან, ყურებიდან და კანიდან, სწრაფად ამუშავებს მათ და ეუბნება სხეულს, როგორ იმოქმედოს. ის არასდროს იძინებს, მაშინაც კი, როდესაც შენ ტკბილად გძინავს!",
    funFact: "ტვინი თავად ვერ გრძნობს ტკივილს, რადგან მასში ტკივილის რეცეპტორები არ არსებობს! თუმცა, ის სხვებს ეხმარება ტკივილის შეგრძნებაში.",
    color: "#ec4899", // pink
    textColor: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    quiz: {
      question: "რა ფუნქციას ასრულებს ტვინი ჩვენს ორგანიზმში?",
      options: [
        "სისხლს ატარებს მთელ სხეულში",
        "მართავს და აკონტროლებს ჩვენს ფიქრებს, მოძრაობასა და გრძნობებს",
        "ინახავს და გადაამუშავებს საკვებს"
      ],
      correctAnswerIndex: 1,
      explanation: "სწორია! ტვინი მართლაც ჩვენი სხეულის მთავარი სუპერკომპიუტერია, რომელიც ყველა მოქმედებასა და შეგრძნებას აკონტროლებს!"
    }
  },
  {
    id: "heart",
    name: "გული",
    latinName: "Cor",
    emoji: "❤️",
    analogyTitle: "უდაღლელი სუპერ-ტუმბო",
    analogyDesc: "წარმოიდგინე მძლავრი წყლის ტუმბო, რომელიც მილებში წყალს გამუდმებით ატარებს. გული ზუსტად ასეთი ტუმბოა, ოღონდ წყლის ნაცვლად სისხლს ამოძრავებს!",
    description: "გული არის ძლიერი კუნთი, რომელიც მკერდის შუაში, ოდნავ მარცხნივ მდებარეობს. ის დაუღალავად იკუმშება და ფართოვდება, რათა ჟანგბადითა და სასარგებლო ნივთიერებებით მდიდარი სისხლი სხეულის ყველა უჯრედამდე მიიტანოს.",
    funFact: "შენი გული დაახლოებით შენივე შეკრული მუშტის ხელაა! ის დღეში დაახლოებით 100,000-ჯერ ფეთქავს.",
    color: "#ef4444", // red
    textColor: "text-red-750",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    quiz: {
      question: "რა ზომისაა დაახლოებით ჩვენი გული?",
      options: [
        "ჩვენი შეკრული მუშტის ხელა",
        "საფეხბურთო ბურთის ხელა",
        "პატარა კაკლის ხელა"
      ],
      correctAnswerIndex: 0,
      explanation: "ყოჩაღ! შენი გული ზუსტად შენივე შეკრული მუშტის ხელაა და ძალიან ბევრს შრომობს ყოველდღე!"
    }
  },
  {
    id: "lungs",
    name: "ფილტვები",
    latinName: "Pulmones",
    emoji: "🫁",
    analogyTitle: "ორი მხიარული საჰაერო ბუშტი",
    analogyDesc: "როდესაც ჰაერს ისუნთქავ, ეს ბუშტები სასარგებლო ჟანგბადით ივსება და იბერება, ხოლო ამოსუნთქვისას იკუმშება და არასაჭირო აირებს გარეთ უშვებს!",
    description: "ფილტვები წყვილი ორგანოა, რომელიც ნეკნების მყარი ფარის ქვეშ იმყოფება. მათი დახმარებით ჩვენ ვსუნთქავთ. ისინი ჰაერიდან იღებენ ჟანგბადს, რომელიც სხეულს ენერგიისთვის სჭირდება, და ათავისუფლებენ ნახშირორჟანგს ამოსუნთქვის დროს.",
    funFact: "ფილტვები ერთადერთი ორგანოა ადამიანის სხეულში, რომელსაც წყალზე ტივტივი შეუძლია, რადგან ის სავსეა მილიონობით ციცქნა საჰაერო ბუშტით (ალვეოლით)!",
    color: "#06b6d4", // cyan
    textColor: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    quiz: {
      question: "რატომ შეუძლია ფილტვებს წყალზე ტივტივი?",
      options: [
        "რადგან ისინი ძალიან მძიმეა",
        "რადგან ისინი სავსეა მილიონობით ციცქნა საჰაერო ბუშტით (ალვეოლით)",
        "რადგან ისინი წყალგამძლე მასალისგანაა დამზადებული"
      ],
      correctAnswerIndex: 1,
      explanation: "მართალია! ფილტვებში არსებული მილიონობით პატარა საჰაერო ბუშტი ჰაერითაა სავსე, რაც მას წყალზე ტივტივის საოცარ უნარს აძლევს!"
    }
  },
  {
    id: "stomach",
    name: "კუჭი",
    latinName: "Gaster",
    emoji: "🥣",
    analogyTitle: "ჯადოსნური ბლენდერი",
    analogyDesc: "კუჭი ჰგავს სამზარეულოს მძლავრ ბლენდერს, რომელიც შენს მიერ შეჭამილ გემრიელ საჭმელს სპეციალური წვენებით ფაფად აქცევს, რათა ორგანიზმმა მარტივად შეიწოვოს ის!",
    description: "კუჭი არის ელასტიური ტომარა, რომელშიც ხვდება საკვები საყლაპავი მილიდან. აქ საკვები ერევა კუჭის მჟავასა და ფერმენტებს, რომლებიც შლიან ცილებსა და სხვა ნივთიერებებს. კუჭი საჭმელს რამდენიმე საათის განმავლობაში ამუშავებს, სანამ მას ნაწლავებში გადაუშვებს.",
    funFact: "კუჭი იმდენად ძლიერ მჟავას გამოიმუშავებს, რომ მას ზოგიერთი ლითონის დადნობაც კი შეუძლია! თუმცა, საკუთარ თავს არ აზიანებს, რადგან სპეციალური დამცავი ლორწოთია დაფარული.",
    color: "#f59e0b", // amber
    textColor: "text-amber-805",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    quiz: {
      question: "რას ჰგავს კუჭის მუშაობის პროცესი?",
      options: [
        "ტუმბოს, რომელიც სითხეს ქაჩავს",
        "ბლენდერს, რომელიც საკვებს ფაფად აქცევს და შლის",
        "საცერს, რომელიც მხოლოდ წყალს ატარებს"
      ],
      correctAnswerIndex: 1,
      explanation: "ზუსტად! კუჭი ნამდვილი ჯადოსნური ბლენდერია, სადაც საჭმელი წვენებთან ერთად კარგად იზილება და მზადდება ენერგიის გამოსამუშავებლად!"
    }
  },
  {
    id: "liver",
    name: "ღვიძლი",
    latinName: "Hepar",
    emoji: "🛡️",
    analogyTitle: "ჭკვიანი ქიმიური ლაბორატორია",
    analogyDesc: "წარმოიდგინე სუპერ-ლაბორატორია, რომელიც წმენდს სხეულს მავნე ნივთიერებებისგან, აწესრიგებს ვიტამინებს და ინახავს ენერგიას თამაშისთვის!",
    description: "ღვიძლი ჩვენი სხეულის ყველაზე დიდი შინაგანი ორგანოა. ის ასრულებს 500-ზე მეტ მნიშვნელოვან საქმეს! ის მუშაობს როგორც ფილტრი: წმენდს სისხლს ტოქსინებისგან, გამოიმუშავებს ნაღველს საჭმლის მონელებისთვის და ინახავს გლუკოზას (შაქარს), რომელიც მოულოდნელი სირბილისას ენერგიას გაძლევს.",
    funFact: "ღვიძლს აქვს საოცარი სუპერძალა: თუ მისი დიდი ნაწილი დაზიანდა, მას შეუძლია თავიდან გაიზარდოს და სრულად აღიდგინოს თავისი პირვანდელი ზომა კისრამდე!",
    color: "#8b5cf6", // purple
    textColor: "text-purple-750",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    quiz: {
      question: "რა არის ღვიძლის საოცარი 'სუპერძალა'?",
      options: [
        "მას შეუძლია სინათლეზე ანათებდეს",
        "დაზიანების შემთხვევაში, მას შეუძლია ხელახლა გაიზარდოს და აღდგეს",
        "მას შეუძლია მთელი დღე ჰაერის გარეშე გაძლოს"
      ],
      correctAnswerIndex: 1,
      explanation: "საოცარია, არა? ღვიძლი მართლაც ერთადერთი ორგანოა, რომელსაც რეგენერაციის (ხელახლა გაზრდის) ასეთი საოცარი უნარი აქვს!"
    }
  },
  {
    id: "kidneys",
    name: "თირკმელები",
    latinName: "Renes",
    emoji: "🧼",
    analogyTitle: "წყლის გამწმენდი ფილტრები",
    analogyDesc: "ორგანიზმში წყლისა და სითხის ბალანსის ხელშეწყობისთვის, ეს ორი პატარა ლობიო ფილტრავს ჩვენს სისხლს და ზედმეტ, უსარგებლო წყალს შარდად აქცევს!",
    description: "თირკმელები არის ორი ლობიოს ფორმის პატარა ორგანო, რომლებიც ზურგის მხარეს, წელის ოდნავ ზემოთ მდებარეობს. ისინი დღე-ღამეში ბევრჯერ ფილტრავენ მთელ ჩვენს სისხლს, აშორებენ ნარჩენებს და არეგულირებენ ორგანიზმში სითხისა და მარილების რაოდენობას.",
    funFact: "თუმცა ადამიანს ორი თირკმელი აქვს, სრულიად ჯანმრთელი და ხანგრძლივი ცხოვრება მხოლოდ ერთი თირკმლითაც კი არის შესაძლებელი!",
    color: "#10b981", // emerald
    textColor: "text-emerald-750",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    quiz: {
      question: "რა ფორმა აქვთ ჩვენს თირკმელებს?",
      options: [
        "მრგვალი ვაშლის ფორმა",
        "ლობიოს მარცვლის ფორმა",
        "გრძელი სტაფილოს ფორმა"
      ],
      correctAnswerIndex: 1,
      explanation: "ბრავო! თირკმელები მართლაც მინიატურული, ლობიოს ფორმის საოცარი ფილტრებია, რომლებიც ზურგის მხარეს გვფარავენ!"
    }
  }
];

interface OrgansTabProps {
  onEarnPoints: (points: number, stars: number) => void;
}

export default function OrgansTab({ onEarnPoints }: OrgansTabProps) {
  const [selectedOrgan, setSelectedOrgan] = useState<string>("brain");
  const [solvedOrgans, setSolvedOrgans] = useState<string[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const activeOrgan = organsData.find((o) => o.id === selectedOrgan) || organsData[0];

  const handleOrganClick = (id: string) => {
    setSelectedOrgan(id);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setIsAnswerCorrect(null);
    playSound("click");
  };

  const handleOptionSelect = (index: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(index);
    playSound("pop");
  };

  const handleSubmitAnswer = () => {
    if (selectedQuizOption === null || quizSubmitted) return;

    const correct = selectedQuizOption === activeOrgan.quiz.correctAnswerIndex;
    setIsAnswerCorrect(correct);
    setQuizSubmitted(true);

    if (correct) {
      playSound("success");
      // Prevent double points for farming
      if (!solvedOrgans.includes(activeOrgan.id)) {
        setSolvedOrgans((prev) => [...prev, activeOrgan.id]);
        onEarnPoints(20, 1);
      }
    } else {
      playSound("fail");
    }
  };

  const handleRetry = () => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setIsAnswerCorrect(null);
    playSound("click");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* SECTION 1: INTERACTIVE SILHOUETTE VIEWER - 7 cols */}
      <div className="lg:col-span-7 bg-white/80 p-5 md:p-6 rounded-3xl border-4 border-amber-200 shadow-xl relative overflow-hidden">
        <h3 className="text-xl font-bold text-amber-700 mb-2 flex items-center gap-2">
          <span>🫁 ორგანოთა ინტერაქტიული რუკა</span>
        </h3>
        <p className="text-xs text-amber-600 mb-4 bg-amber-50 p-2.5 rounded-xl font-medium leading-relaxed">
          💡 დააკლიკე ადამიანის სხეულზე გამოსახულ ნებისმიერ ფერად ორგანოს, რომ გაიგო რას აკეთებს ის და გაიარო საინტერესო ქვიზი!
        </p>

        {/* Silhouette Vector Stage */}
        <div className="relative w-full h-[390px] md:h-[430px] flex justify-center items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-50 via-sky-100/50 to-white rounded-2xl border border-sky-100 p-4">
          <svg viewBox="0 0 200 300" className="w-[190px] h-full overflow-visible select-none">
            {/* Soft grid decoration */}
            <rect width="200" height="300" fill="none" rx="10" />

            {/* Human body outline outer shadow */}
            <g className="opacity-40 blur-xs">
              <path d="M 100,20 C 120,20 125,50 115,65 C 112,70 117,80 128,85 C 145,95 155,108 152,145 C 150,165 142,175 145,190 C 148,205 138,245 135,275 C 132,290 122,295 115,295 C 108,295 105,285 100,285 C 95,285 92,295 85,295 C 78,295 68,290 65,275 C 62,245 52,205 55,190 C 58,175 50,165 48,145 C 45,108 55,95 72,85 C 83,80 88,70 85,65 C 75,50 80,20 100,20 Z" fill="#d1e2f3" />
            </g>

            {/* Human body main silhouette */}
            <path 
              d="M 100,20 C 120,20 125,50 115,65 C 112,70 117,80 128,85 C 145,95 155,108 152,145 C 150,165 142,175 145,190 C 148,205 138,245 135,275 C 132,290 122,295 115,295 C 108,295 105,285 100,285 C 95,285 92,295 85,295 C 78,295 68,290 65,275 C 62,245 52,205 55,190 C 58,175 50,165 48,145 C 45,108 55,95 72,85 C 83,80 88,70 85,65 C 75,50 80,20 100,20 Z" 
              fill="#f1f5f9" 
              stroke="#cbd5e1" 
              strokeWidth="2.5" 
              strokeLinejoin="round"
            />

            {/* Cute face decoration */}
            <g className="opacity-95 pointer-events-none">
              <circle cx="94" cy="42" r="2.2" fill="#334155" />
              <circle cx="106" cy="42" r="2.2" fill="#334155" />
              {/* Joyous smile */}
              <path d="M 95 48 Q 100 53 105 48" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              {/* Pink cheeks */}
              <circle cx="90" cy="47" r="2" fill="#fda4af" opacity="0.8" />
              <circle cx="110" cy="47" r="2" fill="#fda4af" opacity="0.8" />
            </g>

            {/* INTERACTIVE ORGAN GRAPHICS */}
            
            {/* 1. BRAIN (PINK) */}
            <g 
              className="cursor-pointer group" 
              onClick={() => handleOrganClick("brain")}
            >
              {/* Glow backdrop when active */}
              {selectedOrgan === "brain" && (
                <circle cx="100" cy="30" r="14" fill="rgba(236, 72, 153, 0.25)" className="animate-ping" />
              )}
              {/* Detailed brain shape */}
              <path 
                d="M 90,32 C 86,30 85,24 91,20 C 93,17 98,17 100,20 C 102,17 107,17 109,20 C 115,24 114,30 110,32 C 109,34 91,34 90,32 Z" 
                fill={selectedOrgan === "brain" ? "#ec4899" : "#fbcfe8"} 
                stroke={selectedOrgan === "brain" ? "#db2777" : "#f472b6"}
                strokeWidth="2"
                className="transition-all duration-305 hover:scale-105"
              />
              <path d="M 100,20 L 100,31 M 95,24 Q 100,25 105,24 M 92,28 Q 100,29 108,28" stroke={selectedOrgan === "brain" ? "#fff" : "#ec4899"} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
              {/* Label pin */}
              <circle cx="100" cy="27" r="4" fill={solvedOrgans.includes("brain") ? "#10b981" : "#ec4899"} stroke="#fff" strokeWidth="1" />
            </g>

            {/* 2. LUNGS (CYAN) */}
            <g 
              className="cursor-pointer group" 
              onClick={() => handleOrganClick("lungs")}
            >
              {selectedOrgan === "lungs" && (
                <rect x="74" y="80" width="53" height="40" rx="10" fill="rgba(6, 182, 212, 0.2)" className="animate-pulse" />
              )}
              {/* Left Lung */}
              <path 
                d="M 94,84 C 94,80 82,78 78,86 C 74,94 77,112 85,116 C 90,118 94,106 94,100 Z" 
                fill={selectedOrgan === "lungs" ? "#06b6d4" : "#a5f3fc"} 
                stroke={selectedOrgan === "lungs" ? "#0891b2" : "#22d3ee"}
                strokeWidth="2"
                className="transition-all duration-305"
              />
              {/* Right Lung */}
              <path 
                d="M 106,84 C 106,80 118,78 122,86 C 126,94 123,112 115,116 C 110,118 106,106 106,100 Z" 
                fill={selectedOrgan === "lungs" ? "#06b6d4" : "#a5f3fc"} 
                stroke={selectedOrgan === "lungs" ? "#0891b2" : "#22d3ee"}
                strokeWidth="2"
                className="transition-all duration-305"
              />
              {/* Bronchi tree lines */}
              <path d="M 100,82 L 100,92 M 100,92 L 88,98 M 100,92 L 112,98" stroke={selectedOrgan === "lungs" ? "#fff" : "#0891b2"} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <circle cx="100" cy="92" r="4" fill={solvedOrgans.includes("lungs") ? "#10b981" : "#06b6d4"} stroke="#fff" strokeWidth="1" />
            </g>

            {/* 3. HEART (RED) */}
            <g 
              className="cursor-pointer group" 
              onClick={() => handleOrganClick("heart")}
            >
              {selectedOrgan === "heart" && (
                <circle cx="101" cy="103" r="11" fill="rgba(239, 68, 68, 0.25)" className="animate-ping" />
              )}
              {/* Heart shape */}
              <path 
                d="M 101,98 C 98,94 93,96 95,102 C 97,106 101,111 101,111 C 101,111 105,106 107,102 C 109,96 104,94 101,98 Z" 
                fill={selectedOrgan === "heart" ? "#ef4444" : "#fecaca"} 
                stroke={selectedOrgan === "heart" ? "#dc2626" : "#f87171"}
                strokeWidth="2.2"
                className="transition-all duration-305 hover:scale-110"
              />
              <circle cx="101" cy="102" r="3" fill={solvedOrgans.includes("heart") ? "#10b981" : "#ef4444"} stroke="#fff" strokeWidth="0.8" />
            </g>

            {/* 4. LIVER (PURPLE/DARK RED) - large right (viewer's left side) */}
            <g 
              className="cursor-pointer group" 
              onClick={() => handleOrganClick("liver")}
            >
              {selectedOrgan === "liver" && (
                <ellipse cx="84" cy="125" rx="14" ry="10" fill="rgba(139, 92, 246, 0.25)" className="animate-pulse" />
              )}
              {/* Liver wedge */}
              <path 
                d="M 72,125 C 72,118 92,118 94,124 C 94,130 84,133 74,131 Z" 
                fill={selectedOrgan === "liver" ? "#8b5cf6" : "#ddd6fe"} 
                stroke={selectedOrgan === "liver" ? "#7c3aed" : "#a78bfa"}
                strokeWidth="2"
                className="transition-all duration-305"
              />
              <circle cx="83" cy="125" r="3.5" fill={solvedOrgans.includes("liver") ? "#10b981" : "#8b5cf6"} stroke="#fff" strokeWidth="0.8" />
            </g>

            {/* 5. STOMACH (AMBER) - left (viewer's right side) */}
            <g 
              className="cursor-pointer group" 
              onClick={() => handleOrganClick("stomach")}
            >
              {selectedOrgan === "stomach" && (
                <ellipse cx="113" cy="130" rx="13" ry="11" fill="rgba(245, 158, 11, 0.25)" className="animate-pulse" />
              )}
              {/* J-shaped stomach */}
              <path 
                d="M 103,122 Q 115,118 122,126 Q 124,138 111,138 C 102,136 102,128 103,122 Z" 
                fill={selectedOrgan === "stomach" ? "#f59e0b" : "#fde68a"} 
                stroke={selectedOrgan === "stomach" ? "#d97706" : "#fbbf24"}
                strokeWidth="2"
                className="transition-all duration-305"
              />
              <circle cx="113" cy="130" r="3.5" fill={solvedOrgans.includes("stomach") ? "#10b981" : "#f59e0b"} stroke="#fff" strokeWidth="0.8" />
            </g>

            {/* 6. KIDNEYS (EMERALD) - bean shapes lower back */}
            <g 
              className="cursor-pointer group" 
              onClick={() => handleOrganClick("kidneys")}
            >
              {selectedOrgan === "kidneys" && (
                <rect x="80" y="146" width="40" height="20" rx="6" fill="rgba(16, 185, 129, 0.2)" className="animate-pulse" />
              )}
              {/* Left kidney bean */}
              <path 
                d="M 87,148 C 84,148 84,158 87,158 Q 89,153 87,148 Z" 
                fill={selectedOrgan === "kidneys" ? "#10b981" : "#a7f3d0"} 
                stroke={selectedOrgan === "kidneys" ? "#059669" : "#34d399"}
                strokeWidth="1.8"
                className="transition-all duration-305"
              />
              {/* Right kidney bean */}
              <path 
                d="M 113,148 C 116,148 116,158 113,158 Q 111,153 113,148 Z" 
                fill={selectedOrgan === "kidneys" ? "#10b981" : "#a7f3d0"} 
                stroke={selectedOrgan === "kidneys" ? "#059669" : "#34d399"}
                strokeWidth="1.8"
                className="transition-all duration-305"
              />
              {/* Connecting tubes mock */}
              <path d="M 89,153 Q 100,158 111,153" stroke={selectedOrgan === "kidneys" ? "#10b981" : "#cbd5e1"} strokeWidth="1" fill="none" opacity="0.6" />
              <circle cx="100" cy="154" r="3.5" fill={solvedOrgans.includes("kidneys") ? "#10b981" : "#10b981"} stroke="#fff" strokeWidth="0.8" />
            </g>
          </svg>

          {/* Micro badges on the stage listing the organs for interactive helper */}
          <div className="absolute top-3 left-3 bg-white/90 border border-amber-200 py-1.5 px-3 rounded-xl shadow-xs text-[10px] flex flex-col gap-1 text-slate-700">
            <span className="font-bold text-amber-800">✅ პასუხის სტატუსი:</span>
            <div className="flex flex-col gap-0.5 font-semibold">
              <span className="flex items-center gap-1">🧠 ტვინი: {solvedOrgans.includes("brain") ? "🟢" : "⚪"}</span>
              <span className="flex items-center gap-1">🫁 ფილტვები: {solvedOrgans.includes("lungs") ? "🟢" : "⚪"}</span>
              <span className="flex items-center gap-1">❤️ გული: {solvedOrgans.includes("heart") ? "🟢" : "⚪"}</span>
              <span className="flex items-center gap-1">🛡️ ღვიძლი: {solvedOrgans.includes("liver") ? "🟢" : "⚪"}</span>
              <span className="flex items-center gap-1">🥣 კუჭი: {solvedOrgans.includes("stomach") ? "🟢" : "⚪"}</span>
              <span className="flex items-center gap-1">🧼 თირკმელები: {solvedOrgans.includes("kidneys") ? "🟢" : "⚪"}</span>
            </div>
          </div>
        </div>

        {/* Small educational prompt at the footer of the stage */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center text-[10px]">
          {organsData.map((org) => (
            <button
              key={org.id}
              onClick={() => handleOrganClick(org.id)}
              className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border-2 transition-all ${
                selectedOrgan === org.id
                  ? `${org.textColor} ${org.bgColor} ${org.borderColor} scale-[1.05] shadow-xs`
                  : "bg-white text-slate-650 hover:bg-amber-50"
              }`}
            >
              <span>{org.emoji}</span>
              <span>{org.name}</span>
              {solvedOrgans.includes(org.id) && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: EDUCATIONAL DETAILED READER & QUIZ SYSTEM - 5 cols */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        
        {/* Playful Informational Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeOrgan.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className={`rounded-3xl border-4 ${activeOrgan.borderColor} ${activeOrgan.bgColor} p-5 shadow-lg relative`}
          >
            {/* Latin / Scientific header badge */}
            <div className="flex justify-between items-start gap-2 mb-3">
              <span className="bg-white/80 text-[10px] uppercase font-mono font-black text-slate-700 px-2.5 py-1 rounded-full border border-slate-205 shadow-2xs">
                🧬 {activeOrgan.latinName}
              </span>
              {solvedOrgans.includes(activeOrgan.id) && (
                <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                  <Check className="w-2.5 h-2.5 stroke-[4]" /> შესრულებულია
                </span>
              )}
            </div>

            {/* Organ title and main children icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white p-2.5 rounded-2xl text-3xl shadow-sm border border-slate-100 transform -rotate-3 hover:rotate-3 transition-transform">
                {activeOrgan.emoji}
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 leading-none">{activeOrgan.name}</h4>
                <p className="text-xs text-slate-500 font-bold mt-1 italic">ლათინურად: {activeOrgan.latinName}</p>
              </div>
            </div>

            {/* Analogy Box (Super Important for Child Learning style!) */}
            <div className="bg-white/90 p-4 rounded-2xl border-2 border-dashed border-amber-300 shadow-sm mb-4">
              <span className="text-[10px] font-black text-amber-805 block tracking-tight uppercase mb-0.5">💡 მარტივი ანალოგია ბავშვებისთვის:</span>
              <span className="font-extrabold text-sm text-slate-800 block mb-1">✨ {activeOrgan.analogyTitle}</span>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {activeOrgan.analogyDesc}
              </p>
            </div>

            {/* Scientific Description made easy */}
            <div className="mb-4">
              <span className="text-[10px] font-black text-slate-500 block uppercase tracking-wider mb-1">🔍 რას აკეთებს სხეულში?</span>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {activeOrgan.description}
              </p>
            </div>

            {/* Fun Fact */}
            <div className="bg-white/50 p-3.5 rounded-2xl border border-slate-200 shadow-inner">
              <span className="text-[10px] font-black text-slate-505 uppercase block mb-1 flex items-center gap-1">
                <span>⭐ საინტერესო ფაქტი:</span>
              </span>
              <p className="text-xs text-slate-600 italic font-medium leading-relaxed">
                "{activeOrgan.funFact}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ORGAN QUIZ BLOCK */}
        <div className="bg-green-50 rounded-3xl border-4 border-green-200 p-5 shadow-lg flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-green-150 p-1.5 rounded-full">
              <HelpCircle className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h4 className="text-sm font-black text-green-800 leading-none">შეამოწმე შენი ცოდნა!</h4>
              <p className="text-[9px] text-green-600 font-bold tracking-tight uppercase mt-0.5">პასუხისთვის მიიღე +20 ქულა და ⭐ 1 ვარსკვლავი!</p>
            </div>
          </div>

          <p className="text-xs text-slate-800 font-extrabold leading-relaxed bg-white/70 p-3 rounded-xl border border-green-105">
            {activeOrgan.quiz.question}
          </p>

          {/* Quiz option list */}
          <div className="flex flex-col gap-2">
            {activeOrgan.quiz.options.map((option, idx) => {
              const isSelected = selectedQuizOption === idx;
              let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-green-300 hover:bg-green-50/20";
              
              if (quizSubmitted) {
                if (idx === activeOrgan.quiz.correctAnswerIndex) {
                  // highlight correct
                  btnClass = "bg-green-100 border-green-450 text-green-900 font-extrabold shadow-sm";
                } else if (isSelected) {
                  // incorrect selection
                  btnClass = "bg-red-100 border-red-400 text-red-900 font-bold";
                } else {
                  btnClass = "bg-white border-slate-200 text-slate-400 opacity-60";
                }
              } else if (isSelected) {
                btnClass = "bg-amber-100 border-amber-400 text-slate-900 font-bold shadow-xs";
              }

              return (
                <button
                  key={idx}
                  disabled={quizSubmitted}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full p-3 rounded-xl text-xs font-semibold text-left border-2 transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span className="leading-normal">{option}</span>
                  {quizSubmitted && idx === activeOrgan.quiz.correctAnswerIndex && (
                    <span className="text-xs">✅</span>
                  )}
                  {quizSubmitted && isSelected && idx !== activeOrgan.quiz.correctAnswerIndex && (
                    <span className="text-xs">❌</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Trigger Buttons */}
          <div className="mt-1">
            {!quizSubmitted ? (
              <button
                disabled={selectedQuizOption === null}
                onClick={handleSubmitAnswer}
                className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wide shadow-md transition-all active:scale-95 ${
                  selectedQuizOption === null
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                }`}
              >
                პასუხის გაგზავნა 🚀
              </button>
            ) : (
              <div className="flex flex-col gap-2.5 bg-white/60 p-3.5 rounded-xl border border-green-150 animate-fade-in">
                {isAnswerCorrect ? (
                  <div>
                    <div className="flex items-center gap-2 text-green-800 mb-1">
                      <Award className="w-5 h-5 text-emerald-600 animate-bounce" />
                      <span className="text-xs font-black">სუპერ! სწორია! 🎉</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal font-medium">
                      {activeOrgan.quiz.explanation}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-red-700 mb-1">
                      <RotateCcw className="w-4 h-4 animate-spin-slow" />
                      <span className="text-xs font-black">უი, შეცდომაა! სცადე ხელახლა ↻</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal mb-2.5">
                      არ მოიწყინო! წაიკითხე ანალოგიისა და ფუნქციის აღწერა ზემოთ, რათა იპოვო სწორი პასუხი.
                    </p>
                    <button
                      onClick={handleRetry}
                      className="bg-red-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-red-600"
                    >
                      თავიდან სცადე
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
