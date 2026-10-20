import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail
} from 'firebase/auth';

// Read config from Vite env (set in .env locally, set in Vercel dashboard for production)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyDfBugadIFstqO0eLe_rjwS8o7bvM62qhY",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "santostark15.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "santostark15",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "santostark15.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| "954943805473",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:954943805473:web:3c72a885a91bc879916b60"
};

// Seed / Initial Demo Data for Fallback/Offline Mode
export const initialWorkItems = [
  {
    id: "w1",
    role: "Systems Development Intern",
    company: "CloudTech Systems Pvt Ltd",
    period: "Jan 2026 - Present",
    location: "Bengaluru, India",
    type: "Internship",
    description: "Architected distributed telemetry microservices and optimized C++ socket protocols. Implemented automated Docker CI/CD pipelines reducing deployment friction by 40%.",
    skills: ["C++", "Linux Kernel", "Docker", "Python", "REST API"],
    badge: "Current"
  },
  {
    id: "w2",
    role: "IoT Firmware Engineer Intern",
    company: "Embedded Micro Labs",
    period: "Jun 2025 - Dec 2025",
    location: "Bengaluru, India",
    type: "Internship",
    description: "Designed FreeRTOS firmware for ESP32 & STM32 microcontrollers. Integrated MQTT client for real-time sensor node communication to AWS IoT Core with TLS 1.3 encryption.",
    skills: ["Embedded C", "ESP32", "FreeRTOS", "MQTT", "AWS IoT Core"],
    badge: "Completed"
  },
  {
    id: "w3",
    role: "Lead Systems Architect & Contributor",
    company: "VTU Open Source Club",
    period: "Aug 2024 - Present",
    location: "VTU Campus",
    type: "Technical Role",
    description: "Led a team of 12 students in developing custom Linux shell scripts, campus network monitoring tools, and automated lab workstation deployment scripts.",
    skills: ["Shell Scripting", "Networking", "Git", "C++", "Linux Admin"],
    badge: "Lead Role"
  }
];

export const initialSkills = [
  { id: "s1", name: "C++ / Systems Programming", category: "Languages", rating: 9, description: "Low-level memory management, pointers, STL, and socket programming." },
  { id: "s2", name: "Python", category: "Languages", rating: 9, description: "Scripting, data analysis, automation, and REST backend development." },
  { id: "s3", name: "Java", category: "Languages", rating: 8, description: "OOP architecture, JVM internals, and Enterprise Web Services." },
  { id: "s4", name: "JavaScript / ES6+", category: "Languages", rating: 9, description: "Asynchronous patterns, DOM APIs, modern ES Next features." },
  { id: "s5", name: "Rust", category: "Languages", rating: 7, description: "Memory safety without garbage collection, systems concurrency." },
  
  { id: "s6", name: "React.js & Vite", category: "Web", rating: 9, description: "Component-driven architecture, state management, custom hooks." },
  { id: "s7", name: "Three.js & R3F", category: "Web", rating: 8, description: "3D WebGL scenes, particle systems, shader materials, 3D Canvas." },
  { id: "s8", name: "Tailwind CSS", category: "Web", rating: 9, description: "Utility-first design systems, responsive glassmorphism themes." },
  { id: "s9", name: "Firebase & Cloud Services", category: "Web", rating: 8, description: "Firestore DB, Authentication, App Hosting, Security Rules." },
  { id: "s10", name: "Node.js & Express", category: "Web", rating: 8, description: "RESTful web services, middleware, authentication flows." },

  { id: "s11", name: "ESP32 & STM32", category: "Hardware", rating: 9, description: "Dual-core microcontroller programming, FreeRTOS tasks." },
  { id: "s12", name: "Arduino & Sensor Integration", category: "Hardware", rating: 9, description: "I2C, SPI, UART protocols, analog-to-digital sensor data." },
  { id: "s13", name: "Raspberry Pi & Linux Systems", category: "Hardware", rating: 8, description: "Embedded Linux setup, GPIO control, system systemd daemons." },
  { id: "s14", name: "PCB Design & Soldering", category: "Hardware", rating: 7, description: "EasyEDA schematics, component placement, prototype testing." }
];

export const initialGallery = [
  { id: "g1", title: "Cloud Air Quality PCB Node", category: "Hardware", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80", description: "Custom PCB prototype with PMS5003 particulate sensor and ESP32 WiFi module." },
  { id: "g2", title: "IoT 4-in-1 Soil Analyzer", category: "Hardware", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80", description: "Field testing soil probe monitoring NPK ratio, moisture, and pH level in real time." },
  { id: "g3", title: "Automated Baby Cradle Test Bench", category: "Robotics", image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80", description: "Infrared crying sensor mechanism and DC motor pulse-width modulation bench." },
  { id: "g4", title: "AI Sci-Fi Graphic Novel Artwork", category: "AI Art", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80", description: "Digital artwork created for custom cyberpunk graphic novel saga." },
  { id: "g5", title: "Cricket Analytics Dashboard", category: "Analytics", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80", description: "Predictive win probability algorithm tracking IPL RCB match statistics." },
  { id: "g6", title: "Embedded Systems Development Setup", category: "Workspace", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80", description: "Oscilloscope, logic analyzer, and dual-monitor workstation for firmware debugging." }
];

export const initialProjects = [
  { id: "p1", title: "3D Solar System & MIB Portfolio", category: "Web3D", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80", description: "Interactive 3D Solar System with Men In Black camera lerp dive into India map outline.", github: "https://github.com", live: "http://localhost:5173", featured: true },
  { id: "p2", title: "IoT Microcontroller Telemetry Hub", category: "Embedded", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80", description: "Real-time MQTT telemetry dashboard tracking sensor arrays with TLS 1.3 encryption.", github: "https://github.com", live: "#", featured: true },
  { id: "p3", title: "Autonomous Drone Flight Controller", category: "Robotics", image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80", description: "C++ flight controller firmware implementing PID stabilization and optical flow.", github: "https://github.com", live: "#", featured: false }
];

export const initialEducationData = [
  {
    id: "e1",
    degree: "Bachelor of Engineering (B.E.) in Computer Science & Engineering",
    institution: "Visvesvaraya Technological University (VTU)",
    period: "2022 - 2026",
    location: "Karnataka, India",
    grade: "CGPA: 8.75 / 10",
    badge: "Undergraduate Degree",
    highlights: [
      "Core Specialization: Operating Systems, Computer Architecture, Data Structures & Algorithms, Systems Programming",
      "Elective Coursework: IoT Systems, Cloud Computing, Distributed Database Systems, Machine Learning",
      "Published semester capstone project on Cloud Air Quality Telemetry & ESP32 Microcontroller Nodes"
    ],
    doc: ""
  },
  {
    id: "e2",
    degree: "Pre-University Education (PUC / 12th Standard)",
    institution: "Karnataka State Pre-University Board",
    period: "2020 - 2022",
    location: "Karnataka, India",
    grade: "Percentage: 94.5%",
    badge: "PCMC Stream",
    highlights: [
      "Stream: Physics, Chemistry, Mathematics, Computer Science (PCMC)",
      "State level rank holder in Computer Science & Mathematics",
      "Built early Python scripts for automated physics lab calculation worksheets"
    ],
    doc: ""
  },
  {
    id: "e3",
    degree: "Secondary School Leaving Certificate (SSLC / 10th Standard)",
    institution: "Karnataka Secondary Education Examination Board (KSEEB)",
    period: "2019 - 2020",
    location: "Karnataka, India",
    grade: "Percentage: 95.2%",
    badge: "Secondary Education",
    highlights: [
      "Distinction with top honors in Mathematics and Science",
      "Captain of School Robotics & Science Exhibition Team",
      "Developed basic microcontroller line-follower robot project"
    ],
    doc: ""
  }
];

export const initialInterestsData = [
  {
    id: "i1",
    title: "Hardware Prototyping & PCB Design",
    badge: "Engineering Hobby",
    category: "Hardware",
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    description: "Building custom microcontroller breakout boards, dual-layer PCB schematics in EasyEDA/KiCad, surface-mount component soldering, and low-power ESP32 sensor nodes.",
    tags: ["EasyEDA", "FreeRTOS", "Custom Schematics", "SMD Soldering"]
  },
  {
    id: "i2",
    title: "AI Graphic Novel Art & Storytelling",
    badge: "Creative Passion",
    category: "AI Art",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    description: "Exploring generative AI image synthesis, prompt engineering, comic panel layout design, and sci-fi worldbuilding for custom graphic novel concepts.",
    tags: ["Generative AI", "Digital Illustration", "Storyboarding", "Prompt Craft"]
  },
  {
    id: "i3",
    title: "Cricket Analytics (RCB & IPL Data Models)",
    badge: "Sports Data Science",
    category: "Analytics",
    icon: "Trophy",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80",
    description: "Analyzing Royal Challengers Bengaluru (RCB) and IPL historical match ball-by-ball datasets using Python Pandas. Building predictive win probability curves, economy rate visualizations, and death-over bowling impact models.",
    tags: ["Python Pandas", "IPL Ball-by-Ball", "RCB Stat Modeling", "Matplotlib"]
  }
];

export const initialCertificatesData = [
  {
    id: "c1",
    title: "Data Science & Machine Learning Professional",
    issuer: "IBM / Coursera Certified",
    date: "Aug 2025",
    credentialId: "DS-892401-VTU",
    category: "Data Science",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    summary: "Comprehensive certification covering Python data analysis libraries (Pandas, NumPy, Scikit-learn), predictive statistical modeling, exploratory data visualization, and machine learning pipelines.",
    verifyUrl: "https://coursera.org/verify/datascience-demo"
  },
  {
    id: "c2",
    title: "Blockchain Systems & Smart Contract Security",
    issuer: "Ethereum Foundation / IEEE Certified",
    date: "Nov 2025",
    credentialId: "ETH-BC-772109",
    category: "Blockchain",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80",
    summary: "Advanced specialization in Solidity smart contract development, consensus mechanisms (PoW, PoS), EVM bytecode execution, cryptographic hashing, and DeFi security audit patterns.",
    verifyUrl: "https://ethereum.org/en/developers/"
  },
  {
    id: "c3",
    title: "AWS Cloud Solutions Architect Associate",
    issuer: "Amazon Web Services (AWS)",
    date: "May 2025",
    credentialId: "AWS-SAA-904128",
    category: "Cloud",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    summary: "Validated expertise in designing resilient, fault-tolerant, high-availability VPC networks, EC2 auto-scaling groups, S3 storage tiers, and IAM cloud security architectures.",
    verifyUrl: "https://aws.amazon.com/verification"
  },
  {
    id: "c4",
    title: "Full-Stack Web Development & Microservices",
    issuer: "FreeCodeCamp & Meta",
    date: "Jan 2025",
    credentialId: "FCC-FS-441029",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
    summary: "Professional certification in React.js, Node.js REST API architectures, MongoDB/PostgreSQL database modeling, Docker containerization, and OAuth2 security authentication flows.",
    verifyUrl: "https://freecodecamp.org/certification/demo"
  }
];

export const initialHeroInfo = {
  id: "main_hero",
  brandName: "SANTO STARK",
  brandSubtitle: "Systems & Web Developer",
  brandLogo: "",
  greeting: "Hi, I'm Santo",
  title: "Full-Stack Engineer & 3D Web Developer",
  subtitle: "Crafting modern interactive web apps, 3D WebGL experiences, systems backend, and intelligent AI tools.",
  badge: "Available for Hire ✦",
  email: "santoshdabadiaiyyanna@gmail.com",
  phone: "8431069633",
  location: "India 🇮🇳",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://x.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  leetcode: "https://leetcode.com",
  resume: "",
  skillPill1: "<> C++ & Python",
  skillPill2: "⚛ React & Three.js 3D",
  skillPill3: ">_ Firebase & Cloud"
};

export const initialAboutInfo = {
  id: "main_about",
  title: "Systems Developer & CSE Undergraduate",
  institution: "Visvesvaraya Technological University (VTU)",
  bio: "I am a final-year Computer Science Engineering student passionate about building real-time embedded hardware, low-latency microservices, and modern WebGL interactive user interfaces. My academic background combines computer architecture, operating systems, data structures, and networking with hands-on hardware prototyping.",
  photo: "",
  card1Title: "Systems & C++",
  card1Desc: "Memory optimization, socket communication, multi-threaded task management.",
  card2Title: "Web & 3D Graphics",
  card2Desc: "React, Vite, Three.js/R3F WebGL shaders, Tailwind CSS, and Firebase backends.",
  card3Title: "IoT & Embedded",
  card3Desc: "ESP32, FreeRTOS, MQTT, sensor bus protocols (I2C, SPI), and custom PCB design."
};

// Fallback Local Storage Helper
const getLocalCollection = (key, defaultData) => {
  const saved = localStorage.getItem(`portfolio_${key}`);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(`portfolio_${key}`, JSON.stringify(defaultData));
  return defaultData;
};

const saveLocalItem = (key, item) => {
  const current = getLocalCollection(key, []);
  const newItem = { ...item, id: item.id || `item_${Date.now()}`, timestamp: new Date().toISOString() };
  const updated = [newItem, ...current.filter(i => i.id !== newItem.id)];
  localStorage.setItem(`portfolio_${key}`, JSON.stringify(updated));
  return newItem;
};

// Initialize Firebase
let app, db, auth;
let isRealFirebase = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isRealFirebase = true;
  }
} catch (error) {
  console.warn("Firebase initialization skipped, using fallback local storage mode:", error);
}

// Export Firebase API Wrapper
export { db, auth, isRealFirebase, RecaptchaVerifier, signInWithPhoneNumber, sendSignInLinkToEmail };

// Helper method to fetch collection items (one-time fetch)
export const fetchCollectionData = async (collectionName, defaultData = []) => {
  if (isRealFirebase && db) {
    try {
      const q = query(collection(db, collectionName));
      const querySnapshot = await getDocs(q);
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      if (docs.length > 0) {
        localStorage.setItem(`portfolio_${collectionName}`, JSON.stringify(docs));
        localStorage.setItem(`portfolio_${collectionName}_initialized`, 'true');
        return docs;
      } else if (localStorage.getItem(`portfolio_${collectionName}_initialized`) === 'true') {
        // Explicitly empty in Firestore
        return [];
      }
    } catch (err) {
      console.warn(`Firestore read failed for ${collectionName}, using local fallback:`, err.message);
    }
  }
  return getLocalCollection(collectionName, defaultData);
};

// Real-Time Listener for entire collections (Bidirectional Live Sync)
export const subscribeToCollection = (collectionName, callback, defaultData = []) => {
  // 1. Immediately emit cached data so UI renders instantaneously with 0ms delay
  const cached = getLocalCollection(collectionName, defaultData);
  if (callback && cached) {
    callback(cached);
  }

  // 2. Connect Firestore Real-Time WebSocket Listener
  if (isRealFirebase && db) {
    try {
      const colRef = collection(db, collectionName);
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const docs = [];
        snapshot.forEach((d) => {
          docs.push({ id: d.id, ...d.data() });
        });

        if (docs.length > 0) {
          localStorage.setItem(`portfolio_${collectionName}`, JSON.stringify(docs));
          localStorage.setItem(`portfolio_${collectionName}_initialized`, 'true');
          callback(docs);
        } else {
          // Check if collection was previously populated and has now been cleared/deleted
          const wasInit = localStorage.getItem(`portfolio_${collectionName}_initialized`) === 'true';
          if (wasInit) {
            localStorage.setItem(`portfolio_${collectionName}`, JSON.stringify([]));
            callback([]);
          } else {
            callback(defaultData);
          }
        }
      }, (error) => {
        console.warn(`Firestore real-time sync subscription error for ${collectionName}:`, error.message);
        callback(getLocalCollection(collectionName, defaultData));
      });

      return unsubscribe;
    } catch (err) {
      console.warn(`Failed to attach snapshot listener for ${collectionName}:`, err);
    }
  }

  return () => {};
};

// Real-Time Listener for single documents (hero_info, about_info)
export const subscribeToDoc = (collectionName, docId, callback, defaultData = {}) => {
  // 1. Immediately emit local cached document
  const localList = getLocalCollection(collectionName, [defaultData]);
  const found = (Array.isArray(localList) && localList.length > 0) ? localList[0] : defaultData;
  callback({ ...defaultData, ...found });

  // 2. Connect Firestore Real-Time WebSocket Listener for document
  if (isRealFirebase && db && docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const liveData = { id: snapshot.id, ...snapshot.data() };
          const merged = { ...defaultData, ...liveData };
          localStorage.setItem(`portfolio_${collectionName}`, JSON.stringify([merged]));
          localStorage.setItem(`portfolio_${collectionName}_initialized`, 'true');
          callback(merged);
        }
      }, (err) => {
        console.warn(`Firestore subscribeToDoc error for ${collectionName}/${docId}:`, err.message);
      });

      return unsubscribe;
    } catch (e) {
      console.warn(`Firestore doc listener error for ${collectionName}:`, e);
    }
  }

  return () => {};
};

// Helper method to add document to collection
export const addCollectionData = async (collectionName, data) => {
  let newItem = { ...data, id: `item_${Date.now()}` };

  if (isRealFirebase && db) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        timestamp: serverTimestamp()
      });
      newItem = { id: docRef.id, ...data };
      localStorage.setItem(`portfolio_${collectionName}_initialized`, 'true');
    } catch (err) {
      console.warn(`Firestore write failed for ${collectionName}, saving locally:`, err.message);
    }
  }

  // Always sync to LocalStorage so website UI renders instantly
  saveLocalItem(collectionName, newItem);
  return newItem;
};

// Helper method to update/upsert document in collection
export const updateCollectionData = async (collectionName, id, data) => {
  const payload = { ...data, id, updatedAt: new Date().toISOString() };

  if (isRealFirebase && db && id) {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      localStorage.setItem(`portfolio_${collectionName}_initialized`, 'true');
    } catch (err) {
      console.warn(`Firestore setDoc failed for ${collectionName}, updating locally:`, err.message);
    }
  }

  // Guaranteed Local Storage Sync
  const current = getLocalCollection(collectionName, []);
  const exists = current.some((item) => item.id === id);
  let updated;
  if (exists) {
    updated = current.map((item) => (item.id === id ? { ...item, ...data } : item));
  } else {
    updated = [{ id, ...data }, ...current];
  }
  localStorage.setItem(`portfolio_${collectionName}`, JSON.stringify(updated));
  return payload;
};

// Helper method to delete document from collection
export const deleteCollectionData = async (collectionName, id) => {
  if (isRealFirebase && db && id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn(`Firestore delete failed for ${collectionName}, deleting locally:`, err.message);
    }
  }
  const current = getLocalCollection(collectionName, []);
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(`portfolio_${collectionName}`, JSON.stringify(updated));
  return id;
};

// Check live connection & permissions to Firebase Firestore
export const checkFirebaseStatus = async () => {
  if (!isRealFirebase || !db) {
    return { ok: false, status: 'uninitialized', error: 'Firebase config missing or invalid' };
  }
  try {
    const snap = await getDocs(query(collection(db, 'hero_info')));
    return { ok: true, status: 'connected', docCount: snap.size };
  } catch (err) {
    return { ok: false, status: 'permission_denied', error: err.message, code: err.code };
  }
};

// Seed / Push All Initial Portfolio Data into Firebase Collections in 1 click
export const seedAllCollectionsToFirebase = async () => {
  if (!isRealFirebase || !db) {
    throw new Error("Firebase is not initialized or config is missing.");
  }

  const results = { seeded: [] };

  const pushList = async (colName, list) => {
    for (const item of list) {
      const itemId = item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const docRef = doc(db, colName, itemId);
      await setDoc(docRef, { ...item, updatedAt: serverTimestamp() }, { merge: true });
    }
    results.seeded.push(`${colName} (${list.length} records)`);
    localStorage.setItem(`portfolio_${colName}_initialized`, 'true');
  };

  // 1. Hero Info
  await setDoc(doc(db, 'hero_info', 'main_hero'), { ...initialHeroInfo, updatedAt: serverTimestamp() }, { merge: true });
  localStorage.setItem('portfolio_hero_info_initialized', 'true');
  results.seeded.push('hero_info (main_hero)');

  // 2. About Info
  await setDoc(doc(db, 'about_info', 'main_about'), { ...initialAboutInfo, updatedAt: serverTimestamp() }, { merge: true });
  localStorage.setItem('portfolio_about_info_initialized', 'true');
  results.seeded.push('about_info (main_about)');

  // 3. Projects
  await pushList('projects', initialProjects);

  // 4. Skills
  await pushList('skills', initialSkills);

  // 5. Work Experience
  await pushList('work_experience', initialWorkItems);

  // 6. Gallery
  await pushList('gallery', initialGallery);

  // 7. Education
  await pushList('education', initialEducationData);

  // 8. Interests
  await pushList('interests', initialInterestsData);

  // 9. Certificates
  await pushList('certificates', initialCertificatesData);

  return results;
};
