import { useState, useEffect } from "react";
import { playSound } from "./utils/audio";
import { Compass, Dumbbell, Shield, HelpCircle, Book, Star, Award, Sparkles, LogIn, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import modular components
import BodyPlanes from "./components/BodyPlanes";
import JointGym from "./components/JointGym";
import SkinShield from "./components/SkinShield";
import QuizArena from "./components/QuizArena";
import LibraryTab from "./components/LibraryTab";
import OrgansTab from "./components/OrgansTab";
import AuthBar from "./components/AuthBar";

// Safely initialize Firebase client SDK with fallback
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

let db: any = null;
let auth: any = null;
let isFirebaseActive = false;

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: Database ID parameter
    auth = getAuth(app);
    isFirebaseActive = true;
    console.log("Firebase initialized successfully with config:", firebaseConfig.projectId);

    // CRITICAL CONSTRAINT: Test Firestore connection at boot
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.error("Please check your Firebase configuration. Client is offline.");
        }
      }
    };
    testConnection();
  } else {
    console.warn("No valid Firebase configuration found.");
  }
} catch (err) {
  console.error("Failed to initialize Firebase:", err);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"planes" | "joints" | "skin" | "quiz" | "library" | "organs">("organs");
  const [points, setPoints] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [user, setUser] = useState<{ email: string; uid: string } | null>(null);

  // Load points and stars initially on component load from localStorage
  useEffect(() => {
    const localPoints = localStorage.getItem("anatomy_kids_points");
    const localStars = localStorage.getItem("anatomy_kids_stars");
    if (localPoints) setPoints(parseInt(localPoints, 10));
    if (localStars) setStars(parseInt(localStars, 10));
  }, []);

  // Listen to Auth State if Firebase Active
  useEffect(() => {
    if (!isFirebaseActive || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({ email: firebaseUser.email || "", uid: firebaseUser.uid });
        // Retrieve scores from firestore
        const userDocPath = `users/${firebaseUser.uid}`;
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          let userDoc;
          try {
            userDoc = await getDoc(userDocRef);
          } catch (getErr) {
            handleFirestoreError(getErr, OperationType.GET, userDocPath);
          }

          if (userDoc && userDoc.exists()) {
            const data = userDoc.data();
            if (data.points !== undefined) {
              setPoints(data.points);
              localStorage.setItem("anatomy_kids_points", data.points.toString());
            }
            if (data.stars !== undefined) {
              setStars(data.stars);
              localStorage.setItem("anatomy_kids_stars", data.stars.toString());
            }
          } else {
            // Document doesn't exist, create initial sync document with local values
            try {
              await setDoc(userDocRef, {
                email: firebaseUser.email,
                uid: firebaseUser.uid,
                points: points,
                stars: stars,
                lastUpdate: Date.now()
              });
            } catch (createErr) {
              handleFirestoreError(createErr, OperationType.CREATE, userDocPath);
            }
          }
        } catch (err) {
          console.error("Error fetching user scores from Firestore:", err);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [points, stars]);

  // Earn points/stars handler
  const handleEarnPoints = async (earnedPoints: number, earnedStars: number) => {
    const nextPoints = points + earnedPoints;
    const nextStars = stars + earnedStars;

    setPoints(nextPoints);
    setStars(nextStars);

    localStorage.setItem("anatomy_kids_points", nextPoints.toString());
    localStorage.setItem("anatomy_kids_stars", nextStars.toString());

    // Sync to firestore if logged in
    if (isFirebaseActive && auth && auth.currentUser) {
      const userDocPath = `users/${auth.currentUser.uid}`;
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        try {
          await updateDoc(userDocRef, {
            points: nextPoints,
            stars: nextStars,
            lastUpdate: Date.now()
          });
        } catch (updateErr) {
          handleFirestoreError(updateErr, OperationType.UPDATE, userDocPath);
        }
      } catch (err) {
        console.error("Error updating scores to Firestore:", err);
      }
    }
  };

  // Login handler
  const handleLogin = async (email: string, pass: string) => {
    if (isFirebaseActive && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Offline local simulation
      setUser({ email: email, uid: "mock-uid-123" });
      localStorage.setItem("anatomy_kids_mock_user", email);
    }
  };

  // Registration handler
  const handleRegister = async (email: string, pass: string) => {
    if (isFirebaseActive && auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // Create user document in Firestore on registration
      if (db) {
        const userDocPath = `users/${userCredential.user.uid}`;
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            uid: userCredential.user.uid,
            points: points,
            stars: stars,
            lastUpdate: Date.now()
          });
        } catch (createErr) {
          handleFirestoreError(createErr, OperationType.CREATE, userDocPath);
        }
      }
    } else {
      // Offline local simulation
      setUser({ email: email, uid: "mock-uid-123" });
      localStorage.setItem("anatomy_kids_mock_user", email);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (isFirebaseActive && auth) {
      await signOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem("anatomy_kids_mock_user");
    }
  };

  // Local effect for mock user offline load fallback
  useEffect(() => {
    if (!isFirebaseActive) {
      const savedMockUser = localStorage.getItem("anatomy_kids_mock_user");
      if (savedMockUser) {
        setUser({ email: savedMockUser, uid: "mock-uid-123" });
      }
    }
  }, []);

  const handleTabChange = (tab: "planes" | "joints" | "skin" | "quiz" | "library" | "organs") => {
    setActiveTab(tab);
    playSound("click");
  };

  return (
    <div className="min-h-screen bg-sky-50/50 pb-12 font-sans overflow-x-hidden">
      
      {/* Georgian Playful light sky Header banner */}
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200 via-sky-100 to-sky-50 pb-8 pt-4 px-4 shadow-sm border-b border-sky-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Cute Application Brand & title */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="bg-amber-400 p-2.5 rounded-3xl border-3 border-amber-500 shadow-md transform rotate-[-3deg] hover:rotate-3 transition-transform">
              <span className="text-3xl">🦴</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">ანატომია ბავშვებისთვის</h1>
              <p className="text-xs text-sky-700 font-bold">შენი სხეული - საოცარი და საიდუმლო სამყარო ქართულად! 🇬🇪</p>
            </div>
          </div>

          {/* Points & Stars Game Counters Dashboard */}
          <div className="flex gap-3">
            {/* Stars counter */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-amber-400 border-3 border-amber-500 py-2.5 px-4 rounded-2xl flex items-center gap-2.5 shadow-md relative group select-none cursor-pointer"
              onClick={() => playSound("success")}
            >
              <div className="bg-white p-1 rounded-full"><Star className="w-5 h-5 text-amber-500 fill-amber-300 animate-spin-slow" /></div>
              <div className="text-left leading-none">
                <span className="text-[10px] font-black text-amber-900 block tracking-tight">ვარსკვლავები</span>
                <span className="text-xl font-black text-slate-900">{stars}</span>
              </div>
              <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">⭐</div>
            </motion.div>

            {/* Points counter */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-400 border-3 border-emerald-500 py-2.5 px-4 rounded-2xl flex items-center gap-2.5 shadow-md relative group select-none cursor-pointer"
              onClick={() => playSound("powerup")}
            >
              <div className="bg-white p-1 rounded-full"><Award className="w-5 h-5 text-emerald-500 stroke-[1.5]" /></div>
              <div className="text-left leading-none">
                <span className="text-[10px] font-black text-emerald-900 block tracking-tight">ქულა (Points)</span>
                <span className="text-xl font-black text-slate-900">{points}</span>
              </div>
              <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">XP</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main container content */}
      <div className="max-w-6xl mx-auto px-4 mt-6 flex flex-col gap-5">
        
        {/* Firebase Authentication Sync bar */}
        <AuthBar
          user={user}
          isFirebaseActive={isFirebaseActive}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
        />

        {/* Tab/Dashboard navigation */}
        <div className="bg-white p-3.5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-md flex overflow-x-auto gap-2.5 scrollbar-thin scrollbar-thumb-sky-200">
          <button
            onClick={() => handleTabChange("organs")}
            className={`flex-1 shrink-0 p-3.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "organs"
                ? "bg-pink-400 text-slate-950 shadow-md shadow-pink-100 scale-[1.02] border-b-4 border-pink-650"
                : "bg-slate-50 text-slate-600 hover:bg-pink-50"
            }`}
          >
            <Activity className="w-4 h-4" />
            შინაგანი ორგანოები
          </button>

          <button
            onClick={() => handleTabChange("planes")}
            className={`flex-1 shrink-0 p-3.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "planes"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-200 scale-[1.02] border-b-4 border-amber-600"
                : "bg-slate-50 text-slate-600 hover:bg-amber-50"
            }`}
          >
            <Compass className="w-4 h-4" />
            სხეულის სიბრტყეები
          </button>
          
          <button
            onClick={() => handleTabChange("joints")}
            className={`flex-1 shrink-0 p-3.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "joints"
                ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-200 scale-[1.02] border-b-4 border-emerald-600"
                : "bg-slate-50 text-slate-600 hover:bg-emerald-50"
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            სახსრების ვარჯიში
          </button>

          <button
            onClick={() => handleTabChange("skin")}
            className={`flex-1 shrink-0 p-3.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "skin"
                ? "bg-rose-400 text-slate-950 shadow-md shadow-rose-200 scale-[1.02] border-b-4 border-rose-600"
                : "bg-slate-50 text-slate-600 hover:bg-rose-50"
            }`}
          >
            <Shield className="w-4 h-4" />
            კანის ფარი
          </button>

          <button
            onClick={() => handleTabChange("quiz")}
            className={`flex-1 shrink-0 p-3.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "quiz"
                ? "bg-sky-400 text-slate-950 shadow-md shadow-sky-200 scale-[1.02] border-b-4 border-sky-600"
                : "bg-slate-50 text-slate-600 hover:bg-sky-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            ვიქტორინის არენა
          </button>

          <button
            onClick={() => handleTabChange("library")}
            className={`flex-1 shrink-0 p-3.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "library"
                ? "bg-indigo-400 text-slate-950 shadow-md shadow-indigo-200 scale-[1.02] border-b-4 border-indigo-600"
                : "bg-slate-50 text-slate-600 hover:bg-indigo-50"
            }`}
          >
            <Book className="w-4 h-4" />
            ლიტერატურა
          </button>
        </div>

        {/* Tab content renderer with animations */}
        <div className="relative mt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28 }}
            >
              {activeTab === "organs" && <OrgansTab onEarnPoints={handleEarnPoints} />}
              {activeTab === "planes" && <BodyPlanes onEarnPoints={handleEarnPoints} />}
              {activeTab === "joints" && <JointGym onEarnPoints={handleEarnPoints} />}
              {activeTab === "skin" && <SkinShield onEarnPoints={handleEarnPoints} />}
              {activeTab === "quiz" && <QuizArena onEarnPoints={handleEarnPoints} />}
              {activeTab === "library" && <LibraryTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer footer */}
      <footer className="mt-16 text-center text-slate-400 text-[11px] font-medium leading-normal max-w-md mx-auto px-4">
        <p>© 2026. ანატომია ბავშვებისთვის - ქართული საგანმანათლებლო პლატფორმა.</p>
        <p className="mt-1">დამზადებულია სიყვარულით პატარა მეცნიერებისთვის. 🧬✨</p>
      </footer>
    </div>
  );
}
