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
    question: "რა ჰქვია კანის ყველაზე ზედაპირულ ფენას, რომელსაც არ აქვს სისხლძარღვები და ამიტომ გაკაწვრისას სისხლი არ მოგვდის?",
    options: ["დერმა (Dermis)", "ეპიდერმისი (Epidermis)", "ფასცია (Fascia)", "ეპილაცია"],
    correctAnswerIndex: 1,
    explanation: "ყოჩაღ! ეპიდერმისი არის გარე თხელი ფენა. ის უსისხლოა, მაგრამ მუდმივად ახლდება და გვიცავს მიკრობებისგან."
  },
  {
    id: "q8",
    question: "რა ეხმარება ჩვენს მყარ ძვლებს მოძრაობაში, სირბილსა და სიმძიმეების აწევაში?",
    options: ["ფრჩხილები", "კუნთები", "თმები", "ნერვები"],
    correctAnswerIndex: 1,
    explanation: "სუპერ! კუნთები ძვლებს გარედან ეკვრის და ტვინიდან წამოსული ბრძანებებით იკუმშება, რომ გვამოძრაოს!"
  }
];

interface QuizArenaProps {
  onEarnPoints: (p: number, s: number) => void;
}

export default function QuizArena({ onEarnPoints }: QuizArenaProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const activeQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionClick = (optionIdx: number) => {
    if (isAnswered) return;
    
    setSelectedAnswerIndex(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === activeQuestion.correctAnswerIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      playSound("success");
      onEarnPoints(30, 1); // Generous reward for quiz master
    } else {
      playSound("fail");
    }
  };

  const handleNext = () => {
    playSound("click");
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      playSound("powerup");
    }
  };

  const handleRestart = () => {
    playSound("click");
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setQuizFinished(false);
    setCorrectCount(0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {quizFinished ? (
        /* Final Congratulatory Scoreboard */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 border-4 border-amber-300 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden"
        >
          {/* Confetti decoration particles */}
          <div className="absolute -top-10 -left-10 text-5xl animate-bounce">🎈</div>
          <div className="absolute -top-10 -right-10 text-5xl animate-bounce delay-100">🎉</div>
          
          <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-4 stroke-[1.5]" />
          <h2 className="text-2xl font-black text-amber-800 mb-2">ვიქტორინა დასრულდა!</h2>
          <p className="text-sm text-slate-600 mb-6 font-medium">
            შესანიშნავი შედეგია! შენ აჩვენე ნამდვილი ანატომიის მკვლევრის ნიჭი!
          </p>

          <div className="bg-amber-50 max-w-xs mx-auto rounded-3xl p-5 border-2 border-amber-200 mb-6 shadow-inner">
            <span className="text-xs font-bold text-slate-500 block uppercase mb-1">სწორი პასუხები</span>
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-4xl font-extrabold text-amber-700">{correctCount}</span>
              <span className="text-slate-400 text-lg">/ {quizQuestions.length}</span>
            </div>
            <div className="mt-3 flex justify-center gap-1">
              {Array.from({ length: correctCount }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse" />
              ))}
            </div>
          </div>

          <p className="text-xs text-amber-700 bg-amber-50/50 p-2.5 rounded-xl max-w-md mx-auto mb-6 leading-relaxed font-semibold">
             შენ დაიმსახურე ანატომიის ვარსკვლავური აკადემიკოსის წოდება! დახარჯული ენერგია დაგეხმარება ანალიზში.
          </p>

          <button
            onClick={handleRestart}
            className="bg-amber-500 text-slate-950 px-8 py-3.5 rounded-2xl border-b-4 border-amber-700 font-extrabold text-sm flex items-center justify-center gap-1.5 mx-auto hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-200 transition-all hover:scale-[1.03]"
          >
            <RotateCcw className="w-4 h-4" />
            თავიდან თამაში ↻
          </button>
        </motion.div>
      ) : (
        /* Active Question Display */
        <div className="bg-white/95 border-4 border-sky-200 p-6 rounded-3xl shadow-xl">
          {/* Header information state */}
          <div className="flex justify-between items-center mb-6">
            <span className="bg-sky-100 text-sky-800 font-mono font-bold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              კითხვა {currentQuestionIndex + 1} / {quizQuestions.length}
            </span>
            <div className="flex gap-1.5 text-xs font-bold text-slate-500">
              <span>სწორი: </span>
              <span className="text-emerald-600">{correctCount}</span>
            </div>
          </div>

          {/* Question text box */}
          <div className="bg-sky-50 rounded-2xl p-5 mb-5 border-2 border-sky-150 relative">
            <span className="absolute -top-3.5 left-6 bg-sky-200 text-sky-850 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">ანატომიის გამოცდა</span>
            <p className="text-base font-extrabold text-slate-800 leading-relaxed text-left">
              {activeQuestion.question}
            </p>
          </div>

          {/* Multiple choice options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswerIndex === idx;
              const isCorrectAnswer = idx === activeQuestion.correctAnswerIndex;
              
              let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/20";
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnClass = "bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold";
                } else if (isSelected && !isCorrectAnswer) {
                  btnClass = "bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold";
                } else {
                  btnClass = "bg-slate-50 border border-slate-200 text-slate-400 opacity-60";
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
                  {isAnswered && isCorrectAnswer && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
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
                    ? "bg-emerald-50 border-emerald-250 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
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
                    <span className="font-extrabold text-xs uppercase block mb-1">
                      {selectedAnswerIndex === activeQuestion.correctAnswerIndex
                        ? "შესანიშნავია! სწორია!"
                        : "არა უშავს, სცადე თავიდან! ↻"}
                    </span>
                    <p className="text-xs font-semibold leading-relaxed text-slate-700">
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
              className="bg-indigo-600 text-white font-extrabold text-xs py-3 px-6 rounded-2xl shadow-md shadow-indigo-100 flex items-center gap-1.5 ml-auto hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
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
