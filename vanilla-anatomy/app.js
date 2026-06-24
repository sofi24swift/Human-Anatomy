// Production-Ready interactive logic for Georgian Children's Human Anatomy App.
// Contains full Firebase Auth, Firestore syncing, local synchronization, and modules interaction.

// -----------------------------------------
// 1. 🔥 Firebase Configuration Template
// -----------------------------------------
// Paste your own values from the Firebase console here to enable persistent cloud sync:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
let auth = null;
let isFirebaseActive = false;

// Graceful Firebase Check & Initialization
try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    isFirebaseActive = true;
    console.log("Firebase Auth & Firestore successfully connected!");
  } else {
    console.log("Firebase credentials not set. Running in resilient LocalStorage fallback mode!");
  }
} catch (err) {
  console.error("Firebase Initialization failed:", err);
}

// -----------------------------------------
// 2. 🎛️ App States & Progress Management
// -----------------------------------------
let points = 0;
let stars = 0;
let currentUser = null;

// Audio synth helper (Web Audio API)
function playSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "fail") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(110, now + 0.35); // A2
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // standard snapy pop
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    // blocked or not supported
  }
}

// Update UI counters
function updateCountersUI() {
  document.getElementById("points-display").textContent = points;
  document.getElementById("stars-display").textContent = stars;
}

// Earn rewards and sync to database / local-storage
async function earnRewards(earnedPoints, earnedStars) {
  points += earnedPoints;
  stars += earnedStars;
  updateCountersUI();

  localStorage.setItem("v_point_score", points);
  localStorage.setItem("v_star_score", stars);

  if (isFirebaseActive && currentUser) {
    try {
      await db.collection("users").doc(currentUser.uid).update({
        points: points,
        stars: stars,
        lastUpdate: Date.now()
      });
    } catch (e) {
      console.warn("Firestore sync score error:", e);
    }
  }
}

// Load Scores on load
function loadLocalProgress() {
  const localPoints = localStorage.getItem("v_point_score");
  const localStars = localStorage.getItem("v_star_score");
  if (localPoints) points = parseInt(localPoints, 10);
  if (localStars) stars = parseInt(localStars, 10);
  updateCountersUI();
}

// -----------------------------------------
// 3. 🔐 Authentication Interface
// -----------------------------------------
const authToggleBtn = document.getElementById("auth-toggle-btn");
const logoutBtn = document.getElementById("logout-btn");
const authPanel = document.getElementById("auth-panel");
const authForm = document.getElementById("auth-form");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");
const authActionTitle = document.getElementById("auth-action-title");
const authSubmitBtn = document.getElementById("auth-submit-btn");
const authModeSwitch = document.getElementById("auth-mode-switch");
const authStatusTitle = document.getElementById("auth-status-title");
const authStatusDesc = document.getElementById("auth-status-desc");
const authAlertIcon = document.getElementById("auth-alert-icon");

let isRegisterMode = false;

authToggleBtn.addEventListener("click", () => {
  authPanel.classList.toggle("hidden");
  authError.classList.add("hidden");
  playSound("pop");
});

authModeSwitch.addEventListener("click", () => {
  isRegisterMode = !isRegisterMode;
  authActionTitle.textContent = isRegisterMode ? "ანგარიშის შექმნა (Registration)" : "ავტორიზაცია (Login)";
  authSubmitBtn.textContent = isRegisterMode ? "რეგისტრაცია" : "შესვლა";
  authModeSwitch.textContent = isRegisterMode ? "უკვე გაქვთ ანგარიში? შედით აქ" : "არ გაქვთ ანგარიში? შეიქმენით აქ";
  playSound("pop");
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = authEmail.value;
  const password = authPassword.value;

  if (!email || !password) {
    showAuthError("გთხოვთ შეავსოთ ველები!");
    return;
  }

  authError.classList.add("hidden");

  try {
    if (isFirebaseActive) {
      if (isRegisterMode) {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection("users").doc(cred.user.uid).set({
          email: email,
          uid: cred.user.uid,
          points: points,
          stars: stars,
          lastUpdate: Date.now()
        });
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      authPanel.classList.add("hidden");
    } else {
      // Local Mock auth fallback
      currentUser = { email: email, uid: "mock-uid-123" };
      localStorage.setItem("v_mock_user", email);
      syncUIForLoggedIn();
      authPanel.classList.add("hidden");
      playSound("success");
    }
  } catch (err) {
    showAuthError(err.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  if (isFirebaseActive) {
    await auth.signOut();
  } else {
    currentUser = null;
    localStorage.removeItem("v_mock_user");
    syncUIForLoggedOut();
  }
  playSound("pop");
});

function showAuthError(msg) {
  authError.textContent = "⚠️ " + msg;
  authError.classList.remove("hidden");
  playSound("fail");
}

function syncUIForLoggedIn() {
  authToggleBtn.classList.add("hidden");
  logoutBtn.classList.remove("hidden");
  authStatusTitle.textContent = "შესული ხართ სისტემაში: " + (currentUser ? currentUser.email : "");
  authStatusTitle.className = "text-xs font-bold text-emerald-700 block";
  authStatusDesc.textContent = "თქვენი დაგროვილი ქულები უსაფრთხოდ სინქრონიზებულია მენეჯერთან!";
  authAlertIcon.textContent = "🛡️";
  authAlertIcon.className = "bg-emerald-100 p-2 rounded-full text-emerald-600 text-lg";
}

function syncUIForLoggedOut() {
  authToggleBtn.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  authStatusTitle.textContent = "გთხოვთ, გაიარო ავტორიზაცია პროგრესის შესანახად";
  authStatusTitle.className = "text-xs font-bold text-amber-700 block";
  authStatusDesc.textContent = "პროგრესი შეინახება ადგილობრივად, სანამ შეხვალთ სისტემაში.";
  authAlertIcon.textContent = "⚠️";
  authAlertIcon.className = "bg-amber-100 p-2 rounded-full text-amber-600 animate-pulse text-lg";
}

// On Authentication Monitor
if (isFirebaseActive) {
  auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      currentUser = { email: firebaseUser.email, uid: firebaseUser.uid };
      syncUIForLoggedIn();
      // fetch scores
      try {
        const userDoc = await db.collection("users").doc(firebaseUser.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          if (data.points !== undefined) points = data.points;
          if (data.stars !== undefined) stars = data.stars;
          updateCountersUI();
        }
      } catch (err) {}
    } else {
      currentUser = null;
      syncUIForLoggedOut();
    }
  });
} else {
  // check local mock fallback user
  const savedMock = localStorage.getItem("v_mock_user");
  if (savedMock) {
    currentUser = { email: savedMock, uid: "mock-uid-123" };
    syncUIForLoggedIn();
  }
}

// -----------------------------------------
// 4. 🗂️ Universal Tabs Router navigation
// -----------------------------------------
window.switchTab = function (tabId) {
  playSound("pop");
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.add("hidden"));
  document.getElementById("content-" + tabId).classList.remove("hidden");

  document.querySelectorAll(".tab-button").forEach((el) => el.classList.remove("active"));
  document.getElementById("tab-" + tabId).classList.add("active");
};

// -----------------------------------------
// 5. 🧭 Module (1) Body Planes
// -----------------------------------------
const planesData = {
  sagittal: {
    title: "საგიტალური სიბრტყე",
    desc: "წარმოიდგინე უხილავი სარკე, რომელიც შენს სხეულს ზუსტად შუაზე ყოფს!",
    impact: "ყოფს სხეულს მარცხენა და მარჯვენა ნაწილებად."
  },
  coronal: {
    title: "კორონალური სიბრტყე",
    desc: "წარმოიდგინე სიბრტყე, რომელიც ყურებიდან ყურებამდე ჩადის!",
    impact: "ყოფს სხეულს წინა (Anterior) და უკანა (Posterior) მხარედ."
  },
  transverse: {
    title: "ტრანსვერსიული სიბრტყე",
    desc: "წარმოიდგინე განივი წრე წელის გარშემო, როგორც ჰულაჰუპი!",
    impact: "ყოფს სხეულს ზედა (Superior) და ქვედა (Inferior) ნაწილებად."
  }
};

window.selectPlane = function (planeId) {
  playSound("pop");
  document.querySelectorAll(".plane-sel-btn").forEach((el) => el.classList.remove("bg-amber-400", "font-black"));
  document.getElementById("btn-plane-" + planeId).classList.add("bg-amber-400", "font-black");

  const data = planesData[planeId];
  document.getElementById("plane-display-title").textContent = data.title;
  document.getElementById("plane-display-desc").textContent = `"${data.desc}"`;
  document.getElementById("plane-display-impact").textContent = data.impact;

  // Toggle visual SVG shapes
  const splitLine = document.getElementById("svg-split-line");
  const horizontalEllipse = document.getElementById("svg-horizontal-ellipse");

  if (planeId === "sagittal") {
    splitLine.style.display = "block";
    horizontalEllipse.classList.add("hidden");
  } else if (planeId === "transverse") {
    splitLine.style.display = "none";
    horizontalEllipse.classList.remove("hidden");
  } else {
    splitLine.style.display = "block";
    horizontalEllipse.classList.add("hidden");
  }
};

window.showDirectionDesc = function (title, term, desc) {
  playSound("success");
  const toast = document.getElementById("planes-info-toast");
  toast.classList.remove("hidden");
  document.getElementById("toast-title").textContent = `${title} (${term})`;
  document.getElementById("toast-desc").textContent = desc;
};

window.checkMicroQuiz = function (isCorrect) {
  const fback = document.getElementById("plane-micro-feedback");
  fback.classList.remove("hidden");
  if (isCorrect) {
    fback.textContent = "🎉 სწორია! ტრანსვერსიული სიბრტყე ორ ნაწილად ყოფს სხეულს! შენ დაიმსახურე ⭐ +15 ქულა!";
    fback.className = "text-xs font-bold text-green-800 mt-2 bg-green-150 p-2 rounded-lg";
    playSound("success");
    earnRewards(15, 1);
  } else {
    fback.textContent = "არა უშავს, სცადე თავიდან! ↻  საგიტალური ხომ შუაზე ყოფს!";
    fback.className = "text-xs font-bold text-red-800 mt-2 bg-red-50 p-2 rounded-lg";
    playSound("fail");
  }
};

// -----------------------------------------
// 6. 🏋️‍♂️ Module (2) Joint Gym
// -----------------------------------------
const jointsData = {
  shoulder: {
    name: "მხრის სახსარი",
    type: "ბურთულა-ბუდე (Ball-and-Socket)",
    desc: "აკავშირებს მხრის ძვალსა და ბეჭს. მას აქვს ყველაზე ფართო მოძრაობის დიაპაზონი.",
    fact: "ხელს გვიწყობს ცურვასა და კალათბურთის თამაშში!",
    movements: ["მოხრა", "გაშლა", "განზიდვა", "როტაცია"]
  },
  elbow: {
    name: "იდაყვის სახსარი",
    type: "ჭაღისებრი (Hinge Joint)",
    desc: "აკავშირებს წინამხარს მხართან. მუშაობს როგორც ოთახის კარი.",
    fact: "მას მხოლოდ მოხრა და გაშლა შეუძლია!",
    movements: ["მოხრა", "გაშლა"]
  },
  wrist: {
    name: "მაჯის სახსარი",
    type: "ელიფსური (Ellipsoid)",
    desc: "გვეხმარება წერაში, ხატვასა და ხალხთან ხელის ჩამორთმევაში.",
    fact: "მოძრაობს ორ სხვადასხვა მიმართულებაში და ბრუნავს!",
    movements: ["მოხრა", "გაშლა", "ტრიალი"]
  },
  hip: {
    name: "მენჯ-ბარძაყი",
    type: "ბურთულა-ბუდე (Ball-and-Socket)",
    desc: "აკავშირებს ბარძაყის ძვალს მენჯთან. ატარებს სხეულის მთელ წონას.",
    fact: "დაცულია უძლიერესი კავშირებითა და კუნთებით!",
    movements: ["მოხრა", "გაშლა", "განზიდვა"]
  },
  knee: {
    name: "მუხლის სახსარი",
    type: "ჭაღისებრი (Hinge Joint)",
    desc: "ყველაზე დიდი სახსარი. წინა მხრიდან იცავს კვირისტავი.",
    fact: "გვეხმარება სირბილსა და სკამზე დაჯდომაში!",
    movements: ["მოხრა", "გაშლა"]
  },
  ankle: {
    name: "კოჭ-წვივი",
    type: "ხრტილოვანი / ჭაღისებრი",
    desc: "აკავშირებს წვივს ფეხის თათთან. ინარჩუნებს წონასწორობას.",
    fact: "ფეხის თითებზე აწევა სწორედ კოჭის დამსახურებაა!",
    movements: ["ზემოთ აწევა", "თითებზე დადგომა"]
  }
};

let selectedJointId = "shoulder";
let workoutProgress = 10;

window.selectJoint = function (jointId) {
  selectedJointId = jointId;
  playSound("pop");

  const joint = jointsData[jointId];
  document.getElementById("joint-display-name").textContent = joint.name;
  document.getElementById("joint-display-type").textContent = `ტიპი: ${joint.type}`;
  document.getElementById("joint-display-desc").textContent = joint.desc;
  document.getElementById("joint-display-fact").textContent = `"${joint.fact}"`;

  // populate buttons
  const container = document.getElementById("joint-movements-container");
  container.innerHTML = "";
  
  joint.movements.forEach((mov) => {
    const btn = document.createElement("button");
    btn.className = "bg-white text-emerald-800 border p-2 rounded-xl text-xs font-bold hover:bg-emerald-50 active:scale-95 transition-all text-center";
    btn.innerHTML = `🔄 ${mov}`;
    btn.onclick = () => simulateJointWorkout(mov);
    container.appendChild(btn);
  });
};

function simulateJointWorkout(movement) {
  playSound("success");
  const overlay = document.getElementById("joint-gym-animation-overlay");
  overlay.textContent = `${movement} აქტიურია! 🏋️‍♂️`;
  overlay.classList.remove("hidden");
  
  setTimeout(() => overlay.classList.add("hidden"), 1000);

  workoutProgress += 15;
  if (workoutProgress >= 100) {
    playSound("powerup");
    earnRewards(20, 1);
    workoutProgress = 10;
  }

  document.getElementById("joint-workout-progress").style.width = `${workoutProgress}%`;
  document.getElementById("joint-progress-text").textContent = `ვარჯიშის ძალა: ${workoutProgress}%`;
}

// -----------------------------------------
// 7. 🛡️ Module (3) Skin Shield
// -----------------------------------------
let currentCutStep = 1;
window.selectSkinSubTab = function(subId) {
  playSound("pop");
  document.querySelectorAll(".subtab-button").forEach((el) => el.classList.remove("active", "bg-rose-500", "text-white"));
  document.getElementById("subtab-" + subId).classList.add("active");

  document.getElementById("skin-cut-panel").classList.add("hidden");
  document.getElementById("skin-burn-panel").classList.add("hidden");
  document.getElementById("skin-sun-panel").classList.add("hidden");

  document.getElementById("skin-" + subId + "-panel").classList.remove("hidden");
};

window.advanceCutStep = function() {
  currentCutStep++;
  const label = document.getElementById("cut-graphics-state");
  const panel = document.getElementById("cut-instructions-container");
  const actionBtn = document.getElementById("cut-step-action");
  const instructionP = document.getElementById("cut-instruction-p");
  
  playSound("success");

  if (currentCutStep === 2) {
    label.textContent = "სახვევი დადებულია! 🩹";
    label.className = "text-xs text-slate-800 bg-amber-400 p-1.5 rounded-md";
    instructionP.textContent = "თრომბოციტები ერთიანდებიან და ქმნიან დროებით ფუფხს. არ მოირბინო ხელი!";
    actionBtn.textContent = "დროის გასვლა ⏳";
  } else if (currentCutStep === 3) {
    label.textContent = "ფუფხის დაცვა! 🛡️";
    label.className = "text-xs text-white bg-amber-900 p-1.5 rounded-full";
    instructionP.textContent = "კანიდან ახალი ეპიდერმისი გაიზარდა! ფუფხი მალე თავისით ჩამოვარდება.";
    actionBtn.textContent = "დასრულება და განკურნება ✨";
  } else {
    label.textContent = "განკურნებულია! 🎉";
    label.className = "text-xs text-white bg-emerald-500 p-2 rounded-full";
    instructionP.textContent = "ყოჩაღ! ჭრილობა წარმატებით განკურნე! დაიმსახურე ⭐ +25 ქულა!";
    actionBtn.innerHTML = "თავიდან დაწყება ↻";
    actionBtn.onclick = () => {
      currentCutStep = 0;
      window.advanceCutStep();
    };
    earnRewards(25, 1);
  }
};

window.coolBurnAction = function(btn) {
  playSound("success");
  document.getElementById("burn-simulator-box").innerHTML = `
    <span class="text-xs text-emerald-800 font-extrabold flex items-center gap-1">
      💧 შესანიშნავია! ტემპერატურა დაეცა! ცივმა წყალმა შეაჩერა დამწვრობის გავრცელება დერმაში! ⭐ +15 ქულა!
    </span>
  `;
  earnRewards(15, 1);
};

let sunHat = false;
let sunSpf = false;

window.applySunProtection = function(type, btn) {
  playSound("pop");
  btn.disabled = true;
  btn.classList.add("bg-slate-200", "text-slate-400", "cursor-not-allowed");

  if (type === "hat") {
    sunHat = true;
    document.getElementById("sun-graphics-hat").classList.remove("hidden");
    document.getElementById("sun-status-hat").textContent = "ქუდი: ✅ დაფარულია!";
  } else {
    sunSpf = true;
    document.getElementById("sun-status-spf").textContent = "SPF მზის კრემი: ✅ წასმულია!";
  }

  if (sunHat && sunSpf) {
    playSound("success");
    document.getElementById("sun-graphics-face").textContent = "😀 დაცული!";
    document.getElementById("sun-graphics-face").className = "w-14 h-14 bg-emerald-100 border-2 border-emerald-300 rounded-full flex flex-col items-center justify-center font-bold text-xs text-emerald-600";
    
    const container = document.getElementById("sun-shield-selector");
    container.innerHTML = `<p class="col-span-2 text-center text-xs font-bold text-emerald-800">🎉 ბრწყინვალეა! ნიკა მზისგან სრულად დაცულია! ⭐ +20 ქულა ბალანსზე!</p>`;
    earnRewards(20, 1);
  }
};

// -----------------------------------------
// 8. ❓ Module (4) Quiz Arena
// -----------------------------------------
const quizQuestions = [
  {
    question: "რომელი ორგანო ტუმბავს სისხლს მთელ სხეულში?",
    options: ["ფილტვები", "კუჭი", "გული", "ღვიძლი"],
    correct: 2,
    exp: "ჩვენი გული დაუღალავად ტუმბავს ჟანგბადით სავსე სისხლს!"
  },
  {
    question: "რამდენი ძვალია ზრდასრული ადამიანის სხეულში?",
    options: ["120 ძვალი", "206 ძვალი", "300 ძვალი", "600 ძვალი"],
    correct: 1,
    exp: "ჩვენს ჩონჩხში ზუსტად 206 მკვრივი ძვალია!"
  },
  {
    question: "რა არის ადამიანის სხეულის ყველაზე დიდი ორგანო?",
    options: ["კანი", "ფილტვები", "კუნთები", "თირკმელები"],
    correct: 0,
    exp: "კანი ჩვენი სხეულის ყველაზე დიდი ორგანო და პირველი დამცავი ფარია!"
  }
];

let currentIdx = 0;
let quizScore = 0;

function renderQuiz() {
  const currentQ = quizQuestions[currentIdx];
  document.getElementById("quiz-badge").textContent = `კითხვა ${currentIdx + 1} / ${quizQuestions.length}`;
  document.getElementById("quiz-score-indicator").textContent = `სწორი: ${quizScore} / ${quizQuestions.length}`;
  document.getElementById("quiz-question-text").textContent = currentQ.question;

  const container = document.getElementById("quiz-options-container");
  container.innerHTML = "";

  currentQ.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "bg-white border-2 border-slate-200 text-slate-705 p-3 rounded-2xl text-xs font-bold transition-all text-left hover:border-sky-305";
    btn.textContent = opt;
    btn.onclick = () => selectQuizAnswer(index, btn);
    container.appendChild(btn);
  });

  // hide next or explanation
  document.getElementById("quiz-explanation-box").classList.add("hidden");
  document.getElementById("quiz-next-btn").classList.add("hidden");
}

function selectQuizAnswer(answerIndex, clickedBtn) {
  const currentQ = quizQuestions[currentIdx];
  const isCorrect = answerIndex === currentQ.correct;

  // disable all option buttons
  const buttons = document.querySelectorAll("#quiz-options-container button");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentQ.correct) {
      btn.className = "p-3 rounded-2xl text-xs font-bold text-left bg-emerald-100 border-2 border-emerald-500 text-emerald-900";
    } else if (idx === answerIndex) {
      btn.className = "p-3 rounded-2xl text-xs font-bold text-left bg-rose-100 border-2 border-rose-500 text-rose-900";
    } else {
      btn.className = "p-3 rounded-2xl text-xs font-bold text-left bg-slate-50 border border-slate-200 text-slate-400 opacity-60";
    }
  });

  // show explanation
  const expBox = document.getElementById("quiz-explanation-box");
  const expTitle = document.getElementById("quiz-exp-title");
  const expText = document.getElementById("quiz-explanation-text");

  expBox.classList.remove("hidden");
  if (isCorrect) {
    quizScore++;
    playSound("success");
    expBox.className = "p-4 rounded-xl border-2 mb-4 bg-emerald-50 border-emerald-300 text-emerald-905";
    expTitle.textContent = "🎉 სწორია! ყოჩაღ!";
    expText.textContent = currentQ.exp;
    earnRewards(30, 1);
  } else {
    playSound("fail");
    expBox.className = "p-4 rounded-xl border-2 mb-4 bg-rose-50 border-rose-250 text-rose-905";
    expTitle.textContent = "არა უშავს, სცადე თავიდან! ↻";
    expText.textContent = `სწორი პასუხია: "${currentQ.options[currentQ.correct]}". ${currentQ.exp}`;
  }

  // show next button
  document.getElementById("quiz-next-btn").classList.remove("hidden");
}

window.nextQuizQuestion = function() {
  playSound("pop");
  currentIdx++;
  if (currentIdx < quizQuestions.length) {
    renderQuiz();
  } else {
    document.getElementById("quiz-question-box").classList.add("hidden");
    document.getElementById("quiz-finished-box").classList.remove("hidden");
    document.getElementById("quiz-final-correct").textContent = quizScore;
    playSound("success");
  }
};

window.restartQuiz = function() {
  playSound("pop");
  currentIdx = 0;
  quizScore = 0;
  document.getElementById("quiz-question-box").classList.remove("hidden");
  document.getElementById("quiz-finished-box").classList.add("hidden");
  renderQuiz();
};

// Initialize App
loadLocalProgress();
selectJoint("shoulder");
renderQuiz();
selectPlane("sagittal");
