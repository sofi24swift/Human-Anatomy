import { useState } from "react";
import { QuizQuestion } from "../types";
import { playSound } from "../utils/audio";
import { motion, AnimatePresence } from "motion/react";
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight, Star, HelpCircle, Trophy } from "lucide-react";

// Educational pool of questions based on literature textbook
const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "რომელი ორგანო ტუმბავს სისხლს მთელ სხეულში და გვაძლევს სიცოცხლის ძალას?",
    options: ["ფილტვები", "კუჭი", "გული", "ღვიძლი"],
    correctAnswerIndex: 2,
    explanation: "სუპერ! ჩვენი გული დაუღალავი მებრძოლია, რომელიც დღითა და ღამით ტუმბავს ჟანგბადით სავსე სისხლს!"
  },
  {
    id: "q2",
    question: "რამდენი ძვალია ზრდასრული ადამიანის საოცარ ჩონჩხში?",
    options: ["100 ძვალი", "206 ძვალი", "350 ძვალი", "600 ძვალი"],
    correctAnswerIndex: 1,
    explanation: "ბრწყინვალეა! ჩვენს ჩონჩხში ზუსტად 206 ძვალია, თუმცა ბავშვებს დაბადებისას უფრო მეტი აქვთ, რომლებიც მერე ერთდება!"
  },
  {
    id: "q3",
    question: "რა ეწოდება ადამიანის სხეულის ყველაზე დიდ ორგანოს, რომელიც გარესამყაროსგან გვიცავს?",
    options: ["კანი", "თავის ტვინი", "კუნთები", "ხერხემალი"],
    correctAnswerIndex: 0,
    explanation: "ყოჩაღ! კანი ჩვენი სხეულის ყველაზე დიდი ორგანო და პირველი დამცავი ფარია ბაქტერიებისა და მზისგან!"
  },
  {
    id: "q4",
    question: "რომელი სახსარი მოძრაობს ყველა მიმართულებით, როგორც ბეისბოლის ბურთი ბუდეში?",
    options: ["იდაყვის ჭაღისებრი სახსარი", "მუხლის სახსარი", "მხრის ბურთულა-ბუდე სახსარი", "მაჯის სახსარი"],
    correctAnswerIndex: 2,
    explanation: "ბრავო! მხრის სახსარი ბურთულა-ბუდეს ტიპისაა, რაც გვაძლევს საშუალებას ხელი 360 გრადუსით დავატრიალოთ!"
  },
  {
    id: "q5",
    question: "რა ჰქვია ჭრილობის თავზე წარმოქმნილ ბუნებრივ დამცავ საფარს, რომელიც შეხორცებას უწყობს ხელს?",
    options: ["ფუფხი (Scab)", "ეპიდერმისი", "იოგი (Ligament)", "ოფლი"],
    correctAnswerIndex: 0,
    explanation: "ზუსტია! ფუფხი ჩვენი კანის ბუნებრივი დაცვაა. ის აკავებს ჭუჭყსა და ინფექციას, სანამ მის ქვეშ ახალი კანი იზრდება!"
  },
  {
    id: "q6",
    question: "რამდენი წყვილი ნეკნი იცავს ჩვენს ფილტვებსა და გულს გულმკერდის გალიაში?",
    options: ["8 წყვილი", "10 წყვილი", "12 წყვილი", "15 წყვილი"],
    correctAnswerIndex: 2,
    explanation: "ძალიან კარგია! ჩვენ გვაქვს 12 წყვილი ნეკნი, რომლებიც მყარ გალიასავით იცავენ გულსა და ფილტვებს დარტყმისგან."
  },
  {
    id: "q7",
    question: "რა ჰქვია კანის ყველაზე გარე, დამცავ ფენას?",
    options: ["ეპიდერმისი", "დერმა", "ჰიპოდერმა", "ცხიმოვანი ქსოვილი"],
    correctAnswerIndex: 0,
    explanation: "სწორია! ეპიდერმისი კანის ყველაზე გარე ფენაა, რომელიც ბარიერივით გვიცავს მიკრობებისა და წყლის დაკარგვისგან."
  }
];

interface QuizArenaProps {
  onEarnPoints: (points: number, stars: number) => void;
}

export default function QuizArena({ onEarnPoints }: QuizArenaProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const activeQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswerIndex(index);
    setIsAnswered(true);

    const isCorrect = index === activeQuestion.correctAnswerIndex;
    if (isCorrect) {
      playSound("success");
      setCorrectCount((prev) => prev + 1);
      onEarnPoints(20, 1);
    } else {
      playSound("fail");
    }
  };

  const handleNext = () => {
    playSound("click");
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      playSound("success");
    }
  };

  const handleRestart = () => {
    playSound("click");
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {quizFinished ? (
        /* Final Congratulatory Scoreboard */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/90 border-4 border-amber-400 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden text-slate-100"
        >
          {/* Confetti decoration particles */}
          <div className="absolute -top-10 -left-10 text-5xl animate-bounce">🎈</div>
          <div className="absolute -top-10 -right-10 text-5xl animate-bounce delay-100">🎉</div>
          
          <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 stroke-[1.5]" />
          <h2 className="text-2xl font-black text-amber-400 mb-2 uppercase tracking-wide">ვიქტორინა დასრულდა!</h2>
          <p className="text-sm text-slate-300 mb-6 font-bold">
            შესანიშნავი შედეგია! შენ აჩვენე ნამდვილი ანატომიის მკვლევრის ნიჭი!
          </p>

          <div className="bg-slate-950 max-w-xs mx-auto rounded-3xl p-5 border-2 border-amber-500/30 mb-6 shadow-inner">
            <span className="text-xs font-black text-slate-400 block uppercase mb-1">სწორი პასუხები</span>
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-4xl font-black text-amber-400">{correctCount}</span>
              <span className="text-slate-500 text-lg">/ {quizQuestions.length}</span>
            </div>
            <div className="mt-3 flex justify-center gap-1">
              {Array.from({ length: correctCount }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse" />
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-amber-950/40 p-3 rounded-xl max-w-md mx-auto mb-6 leading-relaxed font-bold border border-amber-500/20">
             შენ დაიმსახურე ანატომიის ვარსკვლავური აკადემიკოსის წოდება!
          </p>

          <button
            onClick={handleRestart}
            className="bg-amber-400 text-slate-950 px-8 py-3.5 rounded-2xl border-b-4 border-amber-600 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 mx-auto hover:bg-amber-300 active:scale-95 shadow-lg transition-all hover:scale-[1.03] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-950 stroke-[3]" />
            თავიდან თამაში ↻
          </button>
        </motion.div>
      ) : (
        /* Active Question Display */
        <div className="bg-slate-900/90 border-4 border-sky-500/80 p-6 rounded-3xl shadow-2xl text-slate-100">
          {/* Header information state */}
          <div className="flex justify-between items-center mb-6">
            <span className="bg-sky-950 border border-sky-500/30 text-sky-400 font-mono font-black text-xs uppercase px-3 py-1.5 rounded-full flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              კითხვა {currentQuestionIndex + 1} / {quizQuestions.length}
            </span>
            <div className="flex gap-1.5 text-xs font-bold text-slate-400">
              <span>სწორი: </span>
              <span className="text-emerald-400 font-black">{correctCount}</span>
            </div>
          </div>

          {/* Question text box */}
          <div className="bg-slate-950 rounded-2xl p-5 mb-5 border-2 border-slate-800 relative">
            <span className="absolute -top-3.5 left-6 bg-sky-950 border border-sky-500/30 text-sky-400 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">ანატომიის გამოცდა</span>
            <p className="text-base font-black text-white leading-relaxed text-left">
              {activeQuestion.question}
            </p>
          </div>

          {/* Multiple choice options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswerIndex === idx;
              const isCorrectAnswer = idx === activeQuestion.correctAnswerIndex;
              
              let btnClass = "bg-slate-950 border-2 border-slate-850 text-slate-300 hover:border-sky-400 hover:bg-sky-950/20 cursor-pointer";
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnClass = "bg-emerald-950 border-2 border-emerald-500 text-emerald-250 font-black";
                } else if (isSelected && !isCorrectAnswer) {
                  btnClass = "bg-rose-950 border-2 border-rose-500 text-rose-250 font-black";
                } else {
                  btnClass = "bg-slate-950/20 border border-slate-900 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  id={`btn-quiz-option-${idx}`}
                  disabled={isAnswered}
                  onClick={() => handleOptionClick(idx)}
                  className={`p-4 rounded-2xl text-xs font-black text-left transition-all duration-200 flex items-center justify-between ${btnClass} ${
                    !isAnswered ? "active:scale-95 hover:scale-[1.01]" : ""
                  }`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrectAnswer && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation layout and Next button toggle */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4.5 rounded-2xl mb-5 border-2 ${
                  selectedAnswerIndex === activeQuestion.correctAnswerIndex
                    ? "bg-emerald-950/40 border-emerald-505 text-emerald-300"
                    : "bg-rose-950/40 border-rose-505 text-rose-300"
                }`}
              >
                <div className="flex gap-2.5 items-start">
                  <div className="mt-0.5">
                    {selectedAnswerIndex === activeQuestion.correctAnswerIndex ? (
                      <span className="text-xl">🎉</span>
                    ) : (
                      <span className="text-xl">😢</span>
                    )}
                  </div>
                  <div>
                    <span className="font-black text-xs uppercase block mb-1">
                      {selectedAnswerIndex === activeQuestion.correctAnswerIndex
                        ? "შესანიშნავია! სწორია!"
                        : "არა უშავს, სცადე თავიდან! ↻"}
                    </span>
                    <p className="text-xs font-bold leading-relaxed text-slate-200">
                      {selectedAnswerIndex === activeQuestion.correctAnswerIndex 
                        ? activeQuestion.explanation 
                        : "ამჯერად ვერ გამოიცანი, მაგრამ არაუშავს! სწორი პასუხია: \"" + activeQuestion.options[activeQuestion.correctAnswerIndex] + "\". წაიკითხე განმარტება: " + activeQuestion.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Control */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="bg-indigo-600 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-2xl shadow-lg flex items-center gap-1.5 ml-auto hover:bg-indigo-505 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-indigo-500/30"
            >
              შემდეგი კითხვა
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
