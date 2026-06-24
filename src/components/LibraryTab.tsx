import { Book, Bookmark, ExternalLink, HelpCircle } from "lucide-react";
import { playSound } from "../utils/audio";

interface LiteratureSource {
  title: string;
  originalName: string;
  author: string;
  description: string;
  kidsFriendlyHint: string;
}

const sourcesList: LiteratureSource[] = [
  {
    title: "გრეის ანატომია სტუდენტებისთვის (მე-4 გამოცემა)",
    originalName: "Gray's Anatomy for Students, 4th Edition",
    author: "რიჩარდ დრეიკი, ა. უეინ ვოგლი, ადამ მიტჩელი",
    description: "მსოფლიოში ყველაზე ცნობილი და აღიარებული ანატომიის წიგნი. აქ მოცემულია ადამიანის სხეულის უზუსტესი, საოცრად ლამაზი ფერადი ილუსტრაციები, რომლებიც მეცნიერებსა და ექიმებს სწავლაში ეხმარებათ.",
    kidsFriendlyHint: "💡 ბავშვებისთვის: ამ წიგნში ნახავთ საოცარ სურათებს, რომლებიც ნამდვილ რენტგენის სურათებსა და ნახატებს ჰგავს!"
  },
  {
    title: "მენოფიის უნივერსიტეტის ანატომიის გაიდი და ატლასი",
    originalName: "Menoufia University Anatomy Department Handbook",
    author: "ანატომიისა და ემბრიოლოგიის დეპარტამენტი",
    description: "სპეციალური სახელმძღვანელო, რომელზე დაყრდნობითაც აიგო ჩვენი აპლიკაციის სახსრებისა და სიბრტყეების განყოფილებები. ის გვეხმარება სწორად განვსაზღვროთ მოძრაობები და კოორდინატები.",
    kidsFriendlyHint: "💡 ბავშვებისთვის: ამ სახელმძღვანელომ გვასწავლა, რომ იდაყვის სახსარი ზუსტად კარის ანჯამასავით მუშაობს!"
  },
  {
    title: "გრანტის ანატომიის ატლასი",
    originalName: "Grant's Atlas of Anatomy",
    author: "ენ ეგური, არტურ დალი",
    description: "კლასიკური სამედიცინო ატლასი, რომელიც დეტალურად ასახავს კანის ფენებს, კუნთების მიმაგრების ადგილებსა და ნერვულ დაბოლოებებს.",
    kidsFriendlyHint: "💡 ბავშვებისთვის: აქ ნახატებითაა ნაჩვენები, როგორ გვეხმარება კუნთები ძვლების ამოძრავებაში!"
  },
  {
    title: "ბიოლოგიის სასკოლო გრიფირებული სახელმძღვანელოები",
    originalName: "School Biology Textbooks, Georgia",
    author: "სასკოლო პროგრამების ავტორები",
    description: "საქართველოს განათლების სამინისტროს მიერ გრიფირებული ბიოლოგიისა და ბუნებისმეტყველების საბავშვო სახელმძღვანელოები, სადაც მარტივი და გასაგები ენითაა აღწერილი გულის მუშაობა, ჰიგიენა და მზისგან დამცავი სახვევები.",
    kidsFriendlyHint: "💡 ბავშვებისთვის: ეს არის წიგნები, რომლებსაც სკოლაში კითხულობთ და რომლებიც გვიყვებიან, რატომ უნდა დავიცვათ კანი მზის მწველი სხივებისგან!"
  }
];

export default function LibraryTab() {
  const handleLinkClick = () => {
    playSound("pop");
  };

  return (
    <div className="bg-white p-6 rounded-3xl border-4 border-indigo-400 shadow-xl max-w-4xl mx-auto text-slate-850">
      <div className="flex items-center gap-2 mb-4">
        <Book className="w-8 h-8 text-indigo-600 stroke-[1.5] animate-pulse" />
        <div>
          <h2 className="text-xl font-black text-indigo-600 uppercase tracking-wider">წყაროები და სამეცნიერო ლიტერატურა</h2>
          <p className="text-xs text-indigo-700 font-bold">საიდან მოდის აპლიკაციაში მოცემული სამედიცინო ფაქტები?</p>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-250 mb-6 text-xs text-slate-700 leading-relaxed font-bold">
        🛡️ <span className="text-indigo-600 font-black">აკადემიური სიზუსტე:</span> ჩვენი აპლიკაციის თითოეული სამეცნიერო ფაქტი, დაწყებული სახსრების ლათინური სახელწოდებებიდან კანის შეხორცების ეტაპებამდე, ეყრდნობა ნამდვილ სამედიცინო სახელმძღვანელოებსა და კლინიკურ სახელმძღვანელოებს. აქ მოცემულია ძირითადი წყაროები:
      </div>

      {/* Grid of Literature */}
      <div className="grid grid-cols-1 gap-5">
        {sourcesList.map((source, index) => (
          <div
            key={index}
            className="border-2 border-slate-200 rounded-2.5xl p-5 hover:border-indigo-400 transition-colors duration-300 bg-slate-50 hover:bg-slate-100/50 flex flex-col md:flex-row gap-4 items-start shadow-xs"
          >
            <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 border border-indigo-200 shadow-xs">
              <Bookmark className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="font-black text-sm text-slate-800">{source.title}</h3>
                <span className="text-[10px] text-slate-600 font-mono italic">{source.originalName}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5 mb-2">ავტორი: {source.author}</span>
              <p className="text-xs text-slate-700 leading-relaxed mb-3 font-semibold">{source.description}</p>
              
              <div className="bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100 text-[11px] text-slate-700 font-bold leading-relaxed shadow-xs">
                {source.kidsFriendlyHint}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* External Resources Link */}
      <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          სურს თქვენს პატარას გაიგოს მეტი ანატომიის შესახებ?
        </span>
        <a
          href="https://ka.wikipedia.org/wiki/%E1%83%90%E1%83%9C%E1%83%90%E1%83%A2%E1%83%9D%E1%83%9B%E1%83%98%E1%83%90"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"
        >
          ანატომია ქართულ ვიკიპედიაში
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
