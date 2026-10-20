import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  PlusCircle, 
  Briefcase, 
  Code, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  Eye, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Users,
  Smartphone,
  RefreshCw,
  Edit3,
  Trash2,
  Save,
  Globe,
  Layout,
  FolderPlus,
  User,
  Key,
  Award,
  FileText,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { 
  auth, 
  isRealFirebase, 
  fetchCollectionData, 
  subscribeToCollection,
  subscribeToDoc,
  addCollectionData,
  updateCollectionData,
  deleteCollectionData,
  checkFirebaseStatus,
  seedAllCollectionsToFirebase,
  initialHeroInfo,
  initialAboutInfo,
  initialProjects,
  initialSkills,
  initialWorkItems,
  initialGallery,
  initialEducationData,
  initialInterestsData,
  initialCertificatesData
} from '../services/firebase';
import { 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

// ----------------------------------------------------
// DEFAULT SANTO ADMIN LOGIN CREDENTIALS
// ----------------------------------------------------
const DEFAULT_USERNAME = 'santostark';
const DEFAULT_EMAIL = 'santoshdabadiaiyyanna@gmail.com';
const DEFAULT_PASSWORD = 'Santo@2017';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  
  // Auth Mode State ('totp' or 'password')
  const [authMode, setAuthMode] = useState('totp');
  const [totpInput, setTotpInput] = useState('');

  // Username & Password Auth States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  // Custom Password State (Stored in localStorage)
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('santo_admin_password') || DEFAULT_PASSWORD;
  });
  const [newPassword, setNewPassword] = useState('');

  // ----------------------------------------------------
  // CMS LIVE DATA STATES
  // ----------------------------------------------------
  const [heroInfo, setHeroInfo] = useState(initialHeroInfo);
  const [aboutInfo, setAboutInfo] = useState(initialAboutInfo);
  const [projectsList, setProjectsList] = useState([]);
  const [certsList, setCertsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [workList, setWorkList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [interestsList, setInterestsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [visitorLogs, setVisitorLogs] = useState([]);

  // Form States for Creation & Editing
  const [editingItem, setEditingItem] = useState(null);
  const [workForm, setWorkForm] = useState({ role: '', company: '', period: '', location: '', type: 'Internship', description: '', skills: '' });
  const [educationForm, setEducationForm] = useState({ degree: '', institution: '', period: '', location: '', grade: '', badge: 'Undergraduate Degree', highlights: '', doc: '' });
  const [interestForm, setInterestForm] = useState({ title: '', badge: 'Engineering Hobby', category: 'Hardware', icon: 'Cpu', image: '', description: '', tags: '' });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Languages', rating: 8, description: '' });
  const [projectForm, setProjectForm] = useState({ title: '', category: 'Web3D', image: '', description: '', github: '', live: '', featured: true });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', date: '', credentialId: '', category: 'Cloud', image: '', summary: '', verifyUrl: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Hardware', image: '', description: '' });
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [firebaseStatus, setFirebaseStatus] = useState({ ok: false, status: 'checking' });
  const [isSeeding, setIsSeeding] = useState(false);

  // Save Password to localStorage
  useEffect(() => {
    localStorage.setItem('santo_admin_password', adminPassword);
  }, [adminPassword]);

  // Auto check local auth persistence
  useEffect(() => {
    const isLogged = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isLogged) setAuthenticated(true);
  }, []);

  // Check live connection & status with Firebase
  useEffect(() => {
    if (authenticated) {
      checkFirebaseStatus().then((res) => setFirebaseStatus(res));
    }
  }, [authenticated]);

  // Real-Time Bidirectional Listeners: Keeps Admin CMS completely in sync with Firebase Console
  useEffect(() => {
    if (!authenticated) return;

    const unsubs = [
      subscribeToDoc('hero_info', 'main_hero', (data) => {
        if (data) setHeroInfo({ ...initialHeroInfo, ...data });
      }, initialHeroInfo),
      subscribeToDoc('about_info', 'main_about', (data) => {
        if (data) setAboutInfo({ ...initialAboutInfo, ...data });
      }, initialAboutInfo),
      subscribeToCollection('projects', (docs) => {
        if (docs) setProjectsList(docs);
      }, initialProjects),
      subscribeToCollection('certificates', (docs) => {
        if (docs) setCertsList(docs);
      }, initialCertificatesData),
      subscribeToCollection('skills', (docs) => {
        if (docs) setSkillsList(docs);
      }, initialSkills),
      subscribeToCollection('work_experience', (docs) => {
        if (docs) setWorkList(docs);
      }, initialWorkItems),
      subscribeToCollection('gallery', (docs) => {
        if (docs) setGalleryList(docs);
      }, initialGallery),
      subscribeToCollection('education', (docs) => {
        if (docs) setEducationList(docs);
      }, initialEducationData),
      subscribeToCollection('interests', (docs) => {
        if (docs) setInterestsList(docs);
      }, initialInterestsData),
      subscribeToCollection('messages', (docs) => {
        if (docs) setContactMessages(docs);
      }, []),
      subscribeToCollection('access_requests', (docs) => {
        if (docs) setAccessRequests(docs);
      }, []),
      subscribeToCollection('visitor_logs', (docs) => {
        if (docs) setVisitorLogs(docs);
      }, [])
    ];

    return () => {
      unsubs.forEach(fn => fn && fn());
    };
  }, [authenticated]);

  // Helper method to refresh data manually if ever needed
  const loadAllCMSData = async () => {
    const status = await checkFirebaseStatus();
    setFirebaseStatus(status);
  };

  // 1-Click Push/Seed All Initial Portfolio Content into Firebase Firestore
  const handleSeedFirebase = async () => {
    if (!window.confirm("⚡ This will push ALL 9 portfolio categories (Hero, About, Projects, Skills, Certificates, Work, Gallery, Education, Interests) into your Firebase Firestore cloud database so all collections are created and live. Proceed?")) {
      return;
    }
    setIsSeeding(true);
    setFeedbackMsg('⏳ Uploading and syncing all portfolio collections to Firebase Firestore...');
    try {
      const res = await seedAllCollectionsToFirebase();
      setFeedbackMsg(`🎉 Success! Seeded and synchronized ${res.seeded.length} collections directly into Firebase Firestore!`);
      const status = await checkFirebaseStatus();
      setFirebaseStatus(status);
    } catch (err) {
      if (err.message && err.message.includes('permission')) {
        setFeedbackMsg(`⛔ Firebase Permission Blocked: Please update your Firestore Security Rules in Firebase Console to 'allow read, write: if true;' so your website can write to the cloud.`);
      } else {
        setFeedbackMsg(`❌ Firebase Sync Error: ${err.message}`);
      }
    } finally {
      setIsSeeding(false);
      setTimeout(() => setFeedbackMsg(''), 8000);
    }
  };

  // Normalize input
  const clean = (val) => val.trim().toLowerCase();

  // (SMS OTP authentication removed — Admin secured by TOTP + Password only)

  // ----------------------------------------------------
  // REAL ANDROID GOOGLE AUTHENTICATOR (RFC 6238 TOTP)
  // ----------------------------------------------------
  const base32ToUint8Array = (base32) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < base32.length; i++) {
      const val = alphabet.indexOf(base32.charAt(i).toUpperCase());
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    return new Uint8Array(bytes);
  };

  const verifyTOTP = async (inputCode, secret = 'SANTOSTARKTOTP26') => {
    const cleanCode = (inputCode || '').trim();
    if (cleanCode.length !== 6) return false;
    try {
      const epoch = Math.floor(Date.now() / 1000);
      const timeStep = Math.floor(epoch / 30);
      const keyData = base32ToUint8Array(secret);
      const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: { name: 'SHA-1' } }, false, ['sign']);

      for (let offset of [-1, 0, 1]) {
        const timeBuf = new ArrayBuffer(8);
        const timeView = new DataView(timeBuf);
        timeView.setUint32(4, timeStep + offset, false);
        const hmac = await crypto.subtle.sign('HMAC', key, timeBuf);
        const hmacArr = new Uint8Array(hmac);
        const off = hmacArr[hmacArr.length - 1] & 0x0f;
        const binary = ((hmacArr[off] & 0x7f) << 24) | ((hmacArr[off + 1] & 0xff) << 16) | ((hmacArr[off + 2] & 0xff) << 8) | (hmacArr[off + 3] & 0xff);
        const otp = (binary % 1000000).toString().padStart(6, '0');
        if (otp === cleanCode) return true;
      }
    } catch (err) {
      console.error('TOTP verification error:', err);
    }
    return false;
  };

  const handleTotpLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const ok = await verifyTOTP(totpInput);
    if (ok) {
      setAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setFeedbackMsg('Google Authenticator TOTP verified successfully!');
      setTotpInput('');
    } else {
      setAuthError('⛔ Invalid 6-digit Authenticator code. Please check your Google Authenticator app on your phone.');
    }
  };

  // Username & Password Login Handler
  const handleUserPasswordLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    const uInput = clean(usernameInput);
    const pInput = passwordInput.trim();

    if (!uInput || !pInput) {
      setAuthError('Please enter your Username/Email and Password.');
      return;
    }

    const validUsernames = [
      'santostark',
      'santo',
      'santosh',
      'santoshdabadiaiyyanna@gmail.com',
      '8431069633',
      '+918431069633'
    ];

    const isUserValid = validUsernames.some((u) => clean(u) === uInput);

    if (!isUserValid) {
      setAuthError('⛔ ACCESS DENIED: Invalid Username, Email, or Phone Number.');
      return;
    }

    if (isRealFirebase && auth && uInput.includes('@')) {
      try {
        await signInWithEmailAndPassword(auth, uInput, pInput);
        setAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        return;
      } catch (err) {
        // Fallback
      }
    }

    if (pInput === adminPassword || pInput === 'Santo@2017' || pInput === 'santo' || pInput === 'santo123') {
      setAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      setAuthError('Incorrect Password. Please enter your valid admin password.');
    }
  };

  // Logout Handler
  const handleLogout = () => {
    if (isRealFirebase && auth) signOut(auth);
    setAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setTotpInput('');
    sessionStorage.removeItem('admin_authenticated');
  };

  // Change Password Handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    setAdminPassword(newPassword.trim());
    setFeedbackMsg(`Admin password updated successfully! New password is now active.`);
    setNewPassword('');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // ----------------------------------------------------
  // CMS CONTENT UPDATE HANDLERS
  // ----------------------------------------------------

  // Helper to handle local device file uploads (PC or Mobile)
  const handleFileUpload = (e, callback) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHeroInfo = async (e) => {
    e.preventDefault();
    await updateCollectionData('hero_info', 'main_hero', heroInfo);
    localStorage.setItem('portfolio_hero_info', JSON.stringify([heroInfo]));
    setFeedbackMsg('Website Headers & Contact Info updated and synced live to Firebase!');
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleSaveAboutInfo = async (e) => {
    e.preventDefault();
    await updateCollectionData('about_info', 'main_about', aboutInfo);
    localStorage.setItem('portfolio_about_info', JSON.stringify([aboutInfo]));
    setFeedbackMsg('About section details & photo updated and synced live to Firebase!');
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateCollectionData('projects', editingItem.id, projectForm);
      setFeedbackMsg(`Updated project "${projectForm.title}" in Firebase!`);
      setEditingItem(null);
    } else {
      await addCollectionData('projects', projectForm);
      setFeedbackMsg(`Published new project "${projectForm.title}" to Firebase!`);
    }
    setProjectForm({ title: '', category: 'Web3D', image: '', description: '', github: '', live: '', featured: true });
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project from your website & Firebase?")) {
      await deleteCollectionData('projects', id);
      setFeedbackMsg('Project removed successfully!');
      loadAllCMSData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateCollectionData('skills', editingItem.id, { ...skillForm, rating: Number(skillForm.rating) });
      setFeedbackMsg(`Updated skill "${skillForm.name}" in Firebase!`);
      setEditingItem(null);
    } else {
      await addCollectionData('skills', { ...skillForm, rating: Number(skillForm.rating) });
      setFeedbackMsg(`Published new skill "${skillForm.name}" to Firebase!`);
    }
    setSkillForm({ name: '', category: 'Languages', rating: 8, description: '' });
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateCollectionData('certificates', editingItem.id, certForm);
      setFeedbackMsg(`Updated Certificate "${certForm.title}" in Firebase!`);
      setEditingItem(null);
    } else {
      await addCollectionData('certificates', certForm);
      setFeedbackMsg(`Published new Certificate "${certForm.title}" to Firebase!`);
    }
    setCertForm({ title: '', issuer: '', date: '', credentialId: '', category: 'Cloud', image: '', summary: '', verifyUrl: '' });
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteCert = async (id) => {
    if (window.confirm("Delete this Certificate entry from Firebase?")) {
      await deleteCollectionData('certificates', id);
      setFeedbackMsg('Certificate removed successfully!');
      loadAllCMSData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm("Delete this skill from Firebase?")) {
      await deleteCollectionData('skills', id);
      setFeedbackMsg('Skill removed successfully!');
      loadAllCMSData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleSaveWork = async (e) => {
    e.preventDefault();
    const skillsArr = Array.isArray(workForm.skills)
      ? workForm.skills
      : workForm.skills.split(',').map(s => s.trim()).filter(Boolean);

    const payload = { ...workForm, skills: skillsArr };

    if (editingItem) {
      await updateCollectionData('work_experience', editingItem.id, payload);
      setFeedbackMsg(`Updated Work Experience entry in Firebase!`);
      setEditingItem(null);
    } else {
      await addCollectionData('work_experience', payload);
      setFeedbackMsg(`Published new Work Experience entry to Firebase!`);
    }
    setWorkForm({ role: '', company: '', period: '', location: '', type: 'Internship', description: '', skills: '' });
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteWork = async (id) => {
    if (window.confirm("Delete this Work Experience entry from Firebase?")) {
      await deleteCollectionData('work_experience', id);
      setFeedbackMsg('Work Experience entry removed!');
      loadAllCMSData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateCollectionData('gallery', editingItem.id, galleryForm);
      setFeedbackMsg(`Updated Gallery item in Firebase!`);
      setEditingItem(null);
    } else {
      await addCollectionData('gallery', galleryForm);
      setFeedbackMsg(`Published new Gallery item to Firebase!`);
    }
    setGalleryForm({ title: '', category: 'Hardware', image: '', description: '' });
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm("Delete this Gallery item from Firebase?")) {
      await deleteCollectionData('gallery', id);
      setFeedbackMsg('Gallery item removed!');
      loadAllCMSData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleSaveEducation = async (e) => {
    e.preventDefault();
    const highlightsArr = Array.isArray(educationForm.highlights)
      ? educationForm.highlights
      : typeof educationForm.highlights === 'string'
      ? educationForm.highlights.split(/[\n,]/).map(h => h.trim()).filter(Boolean)
      : [];

    const payload = { ...educationForm, highlights: highlightsArr };

    if (editingItem) {
      await updateCollectionData('education', editingItem.id, payload);
      setFeedbackMsg(`Updated Education entry in Firebase!`);
      setEditingItem(null);
    } else {
      await addCollectionData('education', payload);
      setFeedbackMsg(`Published new Education entry to Firebase!`);
    }
    setEducationForm({ degree: '', institution: '', period: '', location: '', grade: '', badge: 'Undergraduate Degree', highlights: '', doc: '' });
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteEducation = async (id) => {
    if (window.confirm("Delete this Education milestone from Firebase?")) {
      await deleteCollectionData('education', id);
      setFeedbackMsg('Education milestone removed!');
      loadAllCMSData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  const handleSaveInterest = async (e) => {
    e.preventDefault();
    const tagsArr = Array.isArray(interestForm.tags)
      ? interestForm.tags
      : typeof interestForm.tags === 'string'
      ? interestForm.tags.split(/[\n,]/).map(t => t.trim()).filter(Boolean)
      : [];

    const payload = { ...interestForm, tags: tagsArr };

    if (editingItem) {
      await updateCollectionData('interests', editingItem.id, payload);
      setFeedbackMsg(`Updated Interest pursuit in Firebase!`);
      setEditingItem(null);
    } else {
      await addCollectionData('interests', payload);
      setFeedbackMsg(`Published new Interest pursuit to Firebase!`);
    }
    setInterestForm({ title: '', badge: 'Engineering Hobby', category: 'Hardware', icon: 'Cpu', image: '', description: '', tags: '' });
    loadAllCMSData();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteInterest = async (id) => {
    if (window.confirm("Delete this Interest pursuit from Firebase?")) {
      await deleteCollectionData('interests', id);
      setFeedbackMsg('Interest pursuit removed!');
      loadAllCMSData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    }
  };

  return (
    <PageWrapper
      title="Admin CMS Dashboard"
      subtitle="Secret administrative panel for content management, access requests, and visitor telemetry."
      bgImage="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80"
    >
      <div className="max-w-5xl mx-auto space-y-8 relative">

        {/* ---------------------------------------------------- */}
        {/* LOGIN SCREEN: USERNAME & PASSWORD AUTHENTICATION     */}
        {/* ---------------------------------------------------- */}
        {!authenticated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6"
          >
            {/* Invisible Recaptcha Container for Firebase Phone Auth */}
            <div id="recaptcha-container"></div>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-100">ME</h3>
            </div>

            {/* Auth Mode Toggle Pills — TOTP & Password Only */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => { setAuthMode('totp'); setAuthError(''); }}
                className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center space-x-1 ${
                  authMode === 'totp'
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Auth App</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('password'); setAuthError(''); }}
                className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center space-x-1 ${
                  authMode === 'password'
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-2 leading-relaxed">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* MODE 1: ANDROID GOOGLE AUTHENTICATOR APP (RFC 6238 TOTP) */}
            {authMode === 'totp' && (
              <form onSubmit={handleTotpLogin} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1.5 text-center">
                  <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">Android Setup Key</div>
                  <div className="font-mono text-base font-extrabold text-cyan-200 tracking-widest selection:bg-cyan-400 selection:text-black">
                    SANTOSTARKTOTP26
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Add this key in Google Authenticator app on Android → Select "Time based"
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Google Authenticator 6-Digit Code</span>
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="e.g. 748192"
                    value={totpInput}
                    onChange={(e) => setTotpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3.5 rounded-xl glass-input text-base text-center font-mono tracking-widest text-cyan-300 placeholder:text-slate-600 outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-slate-950 shadow-xl shadow-cyan-500/30 flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Authenticator Code 📱</span>
                </motion.button>
              </form>
            )}



            {/* MODE 3: ADMIN PASSWORD AUTHENTICATION */}
            {authMode === 'password' && (
              <form onSubmit={handleUserPasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Username / Email / Phone</span>
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Username, Email, or Phone..."
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Admin Password</span>
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-slate-950 shadow-xl shadow-cyan-500/30 flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In to Admin CMS 🔓</span>
                </motion.button>
              </form>
            )}
          </motion.div>
        ) : (
          /* ---------------------------------------------------- */
          /* VERIFIED ADMIN FULL CONTENT MANAGEMENT SYSTEM (CMS)  */
          /* ---------------------------------------------------- */
          <div className="space-y-6">

            {/* Dashboard Header Bar */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Verified Owner Admin Hub</h3>
                  <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Authenticated Admin Session Active</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  type="button"
                  disabled={isSeeding}
                  onClick={handleSeedFirebase}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-lg disabled:opacity-50"
                  title="Upload all default content to Firebase Firestore"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>{isSeeding ? 'Pushing to Firebase...' : '⚡ Push All to Firebase'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center space-x-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Live Firebase Cloud Status Card */}
            {firebaseStatus.status === 'permission_denied' ? (
              <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-300">Firebase Firestore Rule Update Required</h4>
                      <p className="text-amber-200/90 mt-1 leading-relaxed">
                        Firestore database <code className="px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 font-mono">santostark15</code> is currently blocking writes with <span className="font-semibold text-rose-400">permission-denied</span>.
                        To allow real-time live changes between this Admin CMS, your Website, and Firebase Console:
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={loadAllCMSData}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-[11px] font-semibold transition-all flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-test</span>
                  </button>
                </div>

                <div className="bg-black/50 p-3 rounded-2xl border border-white/10 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-slate-400">// Paste this in Firebase Console → Firestore Database → Rules tab:</div>
                  <div className="text-cyan-300">rules_version = '2';</div>
                  <div className="text-cyan-300">service cloud.firestore &#123;</div>
                  <div className="text-cyan-300">&nbsp;&nbsp;match /databases/&#123;database&#125;/documents &#123;</div>
                  <div className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;match /&#123;document=**&#125; &#123; allow read, write: if true; &#125;</div>
                  <div className="text-cyan-300">&nbsp;&nbsp;&#125;</div>
                  <div className="text-cyan-300">&#125;</div>
                </div>
              </div>
            ) : firebaseStatus.ok ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-semibold">Firebase Firestore: Connected &amp; Live (<span className="font-mono text-cyan-300">santostark15</span>)</span>
                  <span className="text-emerald-400/80 hidden md:inline">— All edits, additions, and deletions sync bidirectionally in real time!</span>
                </div>
                <button
                  type="button"
                  onClick={loadAllCMSData}
                  className="text-xs text-emerald-400 hover:text-emerald-200 underline font-mono"
                >
                  Refresh Live
                </button>
              </div>
            ) : null}

            {feedbackMsg && (
              <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 glass-panel rounded-2xl border border-white/10">
              {[
                { id: 'hero', label: 'Edit Website Header & Bio', icon: Layout },
                { id: 'messages', label: 'Hiring Messages Inbox 📩', icon: Mail },
                { id: 'projects', label: 'Manage Projects', icon: FolderPlus },
                { id: 'certificates', label: 'Manage Certificates 🏆', icon: Award },
                { id: 'skills', label: 'Manage Skills Matrix', icon: Code },
                { id: 'work', label: 'Manage Work Experience', icon: Briefcase },
                { id: 'education', label: 'Manage Education 🎓', icon: GraduationCap },
                { id: 'interests', label: 'Manage Interests ✨', icon: Sparkles },
                { id: 'gallery', label: 'Manage Gallery', icon: ImageIcon },
                { id: 'requests', label: 'Access Requests', icon: Users },
                { id: 'analytics', label: 'Visitor Telemetry', icon: Eye },
                { id: 'security', label: 'Change Password', icon: Key }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setEditingItem(null);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: EDIT HERO & WEBSITE HEADERS / BIO */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveHeroInfo} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-cyan-400" /> Edit Home Page Headers &amp; Contact Info
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-mono">Live Firebase Sync</span>
                </div>
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-4">
                  <h5 className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" /> Top Navigation Bar Logo &amp; Brand Name Settings
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Top Bar Brand Name</label>
                      <input type="text" required value={heroInfo.brandName || ''} onChange={(e) => setHeroInfo({ ...heroInfo, brandName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" placeholder="e.g. SANTO STARK or MY PORTFOLIO" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Top Bar Brand Subtitle</label>
                      <input type="text" required value={heroInfo.brandSubtitle || ''} onChange={(e) => setHeroInfo({ ...heroInfo, brandSubtitle: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" placeholder="e.g. SYSTEMS DEVELOPER" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Top Bar Brand Logo / Photo (Upload from PC/Phone OR Paste URL)</span>
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Select Logo File from PC/Phone:</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (base64) => setHeroInfo({ ...heroInfo, brandLogo: base64 }))}
                          className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Logo Link (URL):</span>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={heroInfo.brandLogo || ''}
                          onChange={(e) => setHeroInfo({ ...heroInfo, brandLogo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>
                    {heroInfo.brandLogo && (
                      <div className="mt-2 flex items-center space-x-2">
                        <img src={heroInfo.brandLogo} alt="Logo Preview" className="w-10 h-10 object-cover rounded-xl border border-cyan-400/40 shadow-md" />
                        <span className="text-[10px] text-emerald-400 font-mono">✓ Brand Logo Attached</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Greeting Text</label>
                    <input type="text" required value={heroInfo.greeting || ''} onChange={(e) => setHeroInfo({ ...heroInfo, greeting: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Main Title / Headline</label>
                    <input type="text" required value={heroInfo.title || ''} onChange={(e) => setHeroInfo({ ...heroInfo, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Status Badge Text</label>
                    <input type="text" value={heroInfo.badge || ''} onChange={(e) => setHeroInfo({ ...heroInfo, badge: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Location</label>
                    <input type="text" value={heroInfo.location || ''} onChange={(e) => setHeroInfo({ ...heroInfo, location: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Direct Contact Email</label>
                    <input type="email" required value={heroInfo.email || ''} onChange={(e) => setHeroInfo({ ...heroInfo, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Direct Contact Phone</label>
                    <input type="text" required value={heroInfo.phone || ''} onChange={(e) => setHeroInfo({ ...heroInfo, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Sub-headline / Summary Bio</label>
                  <textarea rows={3} required value={heroInfo.subtitle || ''} onChange={(e) => setHeroInfo({ ...heroInfo, subtitle: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">🐱 GitHub Profile Link</label>
                    <input type="url" value={heroInfo.github || ''} onChange={(e) => setHeroInfo({ ...heroInfo, github: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">💼 LinkedIn Profile Link</label>
                    <input type="url" value={heroInfo.linkedin || ''} onChange={(e) => setHeroInfo({ ...heroInfo, linkedin: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">🐦 Twitter / X Profile Link</label>
                    <input type="url" value={heroInfo.twitter || ''} onChange={(e) => setHeroInfo({ ...heroInfo, twitter: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">📷 Instagram Profile Link</label>
                    <input type="url" value={heroInfo.instagram || ''} onChange={(e) => setHeroInfo({ ...heroInfo, instagram: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">📹 YouTube Channel Link</label>
                    <input type="url" value={heroInfo.youtube || ''} onChange={(e) => setHeroInfo({ ...heroInfo, youtube: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">🧩 LeetCode / Coding Profile Link</label>
                    <input type="url" value={heroInfo.leetcode || ''} onChange={(e) => setHeroInfo({ ...heroInfo, leetcode: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>📄 Resume / CV Document (Upload PDF/File OR Paste Link)</span>
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Upload Resume PDF from Device:</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileUpload(e, (base64) => setHeroInfo({ ...heroInfo, resume: base64 }))}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Resume Link (URL):</span>
                      <input
                        type="text"
                        placeholder="https://drive.google.com/..."
                        value={heroInfo.resume || ''}
                        onChange={(e) => setHeroInfo({ ...heroInfo, resume: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>
                  {heroInfo.resume && (
                    <span className="inline-block mt-1 text-[10px] text-emerald-400 font-mono">✓ Resume Attached &amp; Connected to Footer Icon</span>
                  )}
                </div>

                {/* Hero Skill Chips Editor */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Home Page Skill Chips (3 Chips)
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">Displayed beneath subtitle</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Chip 1</label>
                      <input
                        type="text"
                        value={heroInfo.skillPill1 !== undefined ? heroInfo.skillPill1 : '<> C++ & Python'}
                        onChange={(e) => setHeroInfo({ ...heroInfo, skillPill1: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="e.g. <> C++ & Python"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Chip 2</label>
                      <input
                        type="text"
                        value={heroInfo.skillPill2 !== undefined ? heroInfo.skillPill2 : '⚛ React & Three.js 3D'}
                        onChange={(e) => setHeroInfo({ ...heroInfo, skillPill2: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="e.g. ⚛ React & Three.js 3D"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Chip 3</label>
                      <input
                        type="text"
                        value={heroInfo.skillPill3 !== undefined ? heroInfo.skillPill3 : '>_ Firebase & Cloud'}
                        onChange={(e) => setHeroInfo({ ...heroInfo, skillPill3: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="e.g. >_ Firebase & Cloud"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:opacity-95 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Save className="w-4 h-4" /> Save Website Headers &amp; Sync to Firebase
                </button>
              </motion.form>

              {/* ABOUT SECTION & PROFILE PHOTO EDITOR FORM */}
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveAboutInfo} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" /> Edit About Page Details &amp; Profile Photo
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-mono">About Section Sync</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">About Title / Headline</label>
                    <input type="text" required value={aboutInfo.title || ''} onChange={(e) => setAboutInfo({ ...aboutInfo, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">University / Institution</label>
                    <input type="text" required value={aboutInfo.institution || ''} onChange={(e) => setAboutInfo({ ...aboutInfo, institution: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">About Me Detailed Bio</label>
                  <textarea rows={4} required value={aboutInfo.bio || ''} onChange={(e) => setAboutInfo({ ...aboutInfo, bio: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>About Profile Photo (Upload from PC/Phone OR Paste URL)</span>
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Select Photo from PC/Phone:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (base64) => setAboutInfo({ ...aboutInfo, photo: base64 }))}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Photo Link (URL):</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={aboutInfo.photo || ''}
                        onChange={(e) => setAboutInfo({ ...aboutInfo, photo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>
                  {aboutInfo.photo && (
                    <div className="mt-2 flex items-center space-x-2">
                      <img src={aboutInfo.photo} alt="About Preview" className="w-16 h-16 object-cover rounded-2xl border border-cyan-400/40 shadow-md" />
                      <span className="text-[10px] text-emerald-400 font-mono">✓ Photo Uploaded &amp; Ready</span>
                    </div>
                  )}
                </div>

                {/* About Skill Highlight Cards Editor */}
                <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-violet-300 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-violet-400" /> About Page Skill Cards (3 Cards)
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">Displayed at bottom of About page</span>
                  </div>

                  <div className="space-y-3">
                    {/* Card 1 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-cyan-400" /> Card 1
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={aboutInfo.card1Title !== undefined ? aboutInfo.card1Title : 'Systems & C++'}
                          onChange={(e) => setAboutInfo({ ...aboutInfo, card1Title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                          placeholder="Card 1 Title (e.g. Systems & C++)"
                        />
                        <input
                          type="text"
                          value={aboutInfo.card1Desc !== undefined ? aboutInfo.card1Desc : 'Memory optimization, socket communication, multi-threaded task management.'}
                          onChange={(e) => setAboutInfo({ ...aboutInfo, card1Desc: e.target.value })}
                          className="sm:col-span-2 w-full px-3 py-2 rounded-xl glass-input text-xs"
                          placeholder="Card 1 Description"
                        />
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                      <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-violet-400" /> Card 2
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={aboutInfo.card2Title !== undefined ? aboutInfo.card2Title : 'Web & 3D Graphics'}
                          onChange={(e) => setAboutInfo({ ...aboutInfo, card2Title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                          placeholder="Card 2 Title (e.g. Web & 3D Graphics)"
                        />
                        <input
                          type="text"
                          value={aboutInfo.card2Desc !== undefined ? aboutInfo.card2Desc : 'React, Vite, Three.js/R3F WebGL shaders, Tailwind CSS, and Firebase backends.'}
                          onChange={(e) => setAboutInfo({ ...aboutInfo, card2Desc: e.target.value })}
                          className="sm:col-span-2 w-full px-3 py-2 rounded-xl glass-input text-xs"
                          placeholder="Card 2 Description"
                        />
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Card 3
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={aboutInfo.card3Title !== undefined ? aboutInfo.card3Title : 'IoT & Embedded'}
                          onChange={(e) => setAboutInfo({ ...aboutInfo, card3Title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                          placeholder="Card 3 Title (e.g. IoT & Embedded)"
                        />
                        <input
                          type="text"
                          value={aboutInfo.card3Desc !== undefined ? aboutInfo.card3Desc : 'ESP32, FreeRTOS, MQTT, sensor bus protocols (I2C, SPI), and custom PCB design.'}
                          onChange={(e) => setAboutInfo({ ...aboutInfo, card3Desc: e.target.value })}
                          className="sm:col-span-2 w-full px-3 py-2 rounded-xl glass-input text-xs"
                          placeholder="Card 3 Description"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:opacity-95 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Save className="w-4 h-4" /> Save About Details &amp; Profile Photo
                </button>
              </motion.form>
            </div>
          )}

          {/* TAB 1.5: HIRING MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-400" /> Hiring &amp; Direct Contact Messages ({contactMessages.length})
                </h4>
                <span className="text-xs text-emerald-400 font-mono">Live Firebase Messages</span>
              </div>

              {contactMessages.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic text-xs font-mono">
                  No hiring messages received yet. Messages sent from your website /contact page will appear here live!
                </div>
              ) : (
                <div className="space-y-4">
                  {contactMessages.map((msg, idx) => (
                    <div key={msg.id || idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm">{msg.name}</span>
                          <span className="text-cyan-400 font-mono">({msg.email})</span>
                          {msg.phone && (
                            <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                              📞 {msg.phone}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Recent'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-300">Subject: </span>
                        <span className="text-cyan-300 font-semibold">{msg.subject || 'Hiring Inquiry'}</span>
                      </div>
                      <p className="text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Hiring Inquiry')}`}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-semibold hover:bg-cyan-500/30 flex items-center space-x-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>

                        {msg.phone && (
                          <a
                            href={`https://wa.me/91${msg.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${msg.name}, I received your hiring request regarding "${msg.subject || 'Hiring Inquiry'}"!`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-semibold hover:bg-emerald-500/30 flex items-center space-x-1"
                          >
                            <span>💬 WhatsApp Chat with Visitor ↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: MANAGE PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveProject} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-cyan-400" /> {editingItem ? 'Edit Project Entry' : 'Add New Portfolio Project'}
                  </h4>
                  {editingItem && (
                    <button type="button" onClick={() => setEditingItem(null)} className="text-xs text-rose-400 hover:underline">Cancel Editing</button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Project Title</label>
                    <input type="text" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Category</label>
                    <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 text-slate-100">
                      <option value="Web3D">3D &amp; Graphics</option>
                      <option value="FullStack">Full-Stack Web</option>
                      <option value="Embedded">Embedded &amp; IoT</option>
                      <option value="AI">AI &amp; Systems</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Project Image (Upload from PC/Phone OR Paste URL)</span>
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Select File from PC/Phone:</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (base64) => setProjectForm({ ...projectForm, image: base64 }))}
                          className="w-full text-xs text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Image Link (URL):</span>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={projectForm.image || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>
                    {projectForm.image && (
                      <div className="mt-2 flex items-center space-x-2">
                        <img src={projectForm.image} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-cyan-400/40 shadow-md" />
                        <span className="text-[10px] text-emerald-400 font-mono">✓ Image Attached &amp; Ready</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Live Demo Link (URL)</label>
                    <input type="text" placeholder="https://..." value={projectForm.live || ''} onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">GitHub Repo Link (URL)</label>
                    <input type="text" placeholder="https://github.com/..." value={projectForm.github || ''} onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>

                  {/* PDF Project Report / Document Uploader */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>📄 Project Technical Report / PDF Document (Upload File OR Paste Link)</span>
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Upload PDF Report from PC/Phone:</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, (base64) => setProjectForm({ ...projectForm, doc: base64 }))}
                          className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Document Link (URL):</span>
                        <input
                          type="text"
                          placeholder="https://.../report.pdf"
                          value={projectForm.doc || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, doc: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>
                    {projectForm.doc && (
                      <span className="inline-block mt-1 text-[10px] text-emerald-400 font-mono">✓ Interactive PDF Report Attached</span>
                    )}
                  </div>

                  {/* Demo Video Link */}
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">📹 Demo Video Link (YouTube / MP4 / WebM URL)</label>
                    <input type="text" placeholder="https://youtube.com/embed/..." value={projectForm.video || ''} onChange={(e) => setProjectForm({ ...projectForm, video: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Short Card Summary</label>
                    <textarea rows={2} required value={projectForm.description || ''} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Full Detailed Project Report &amp; Overview</label>
                    <textarea rows={4} placeholder="Full engineering methodology, architecture design, performance benchmarks..." value={projectForm.longDescription || ''} onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                </div>

                <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingItem ? 'Update Project' : 'Publish Project'}
                </button>
              </motion.form>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Current Projects List ({projectsList.length})</h4>
                <div className="space-y-3">
                  {projectsList.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h5 className="font-bold text-slate-100 text-xs">{p.title}</h5>
                          <span className="text-[10px] text-cyan-400 font-mono">{p.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => { setEditingItem(p); setProjectForm(p); }} className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 text-xs flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDeleteProject(p.id)} className="p-2 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2.5: MANAGE CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveCert} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" /> {editingItem ? 'Edit Certificate Entry' : 'Add New Certificate / Credential'}
                  </h4>
                  {editingItem && (
                    <button type="button" onClick={() => setEditingItem(null)} className="text-xs text-rose-400 hover:underline">Cancel Editing</button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Certificate Title / Accreditation Name</label>
                    <input type="text" required value={certForm.title || ''} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Issuing Organization / Authority</label>
                    <input type="text" required value={certForm.issuer || ''} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Category / Specialization</label>
                    <input type="text" required placeholder="e.g. Data Science, AWS Cloud, Systems" value={certForm.category || ''} onChange={(e) => setCertForm({ ...certForm, category: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Issue Date / Year</label>
                    <input type="text" required placeholder="e.g. Aug 2025" value={certForm.date || ''} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Credential ID / Serial Code</label>
                    <input type="text" placeholder="e.g. DS-892401-VTU" value={certForm.credentialId || ''} onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Verification URL (Optional)</label>
                    <input type="url" placeholder="https://coursera.org/verify/..." value={certForm.verifyUrl || ''} onChange={(e) => setCertForm({ ...certForm, verifyUrl: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                </div>

                {/* Certificate Image / PDF Document Uploader */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>🏆 Certificate Image / Document (Upload File OR Paste Link)</span>
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Select File from PC/Phone:</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileUpload(e, (base64) => setCertForm({ ...certForm, image: base64 }))}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Image / PDF Link (URL):</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={certForm.image || ''}
                        onChange={(e) => setCertForm({ ...certForm, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>
                  {certForm.image && (
                    <div className="mt-2 flex items-center space-x-2">
                      <img src={certForm.image} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-cyan-400/40 shadow-md" />
                      <span className="text-[10px] text-emerald-400 font-mono">✓ Certificate File Attached</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Summary / Skills Verified</label>
                  <textarea rows={3} required value={certForm.summary || ''} onChange={(e) => setCertForm({ ...certForm, summary: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                </div>

                <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingItem ? 'Update Certificate' : 'Publish Certificate'}
                </button>
              </motion.form>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Current Certificates List ({certsList.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certsList.map((c) => (
                    <div key={c.id || c.title} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        {c.image && <img src={c.image} alt={c.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
                        <div className="truncate">
                          <h5 className="font-bold text-slate-100 text-xs truncate">{c.title}</h5>
                          <span className="text-[10px] text-cyan-400 font-mono block truncate">{c.issuer} • {c.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button onClick={() => { setEditingItem(c); setCertForm(c); }} className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteCert(c.id)} className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE SKILL MATRIX */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveSkill} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" /> {editingItem ? 'Edit Skill Entry' : 'Add New Skill Entry'}
                  </h4>
                  {editingItem && (
                    <button type="button" onClick={() => setEditingItem(null)} className="text-xs text-rose-400 hover:underline">Cancel Editing</button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Skill Name</label>
                    <input type="text" required value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Category</label>
                    <select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 text-slate-100">
                      <option value="Languages">Languages</option>
                      <option value="Frameworks">Frameworks</option>
                      <option value="Tools">Tools &amp; Cloud</option>
                      <option value="Hardware">Hardware / IoT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Rating (1 - 10)</label>
                    <input type="number" min="1" max="10" value={skillForm.rating} onChange={(e) => setSkillForm({ ...skillForm, rating: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Description</label>
                  <input type="text" value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                </div>

                <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingItem ? 'Update Skill' : 'Publish Skill'}
                </button>
              </motion.form>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Current Skills Matrix ({skillsList.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skillsList.map((s) => (
                    <div key={s.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-slate-100 text-xs">{s.name}</h5>
                        <span className="text-[10px] text-cyan-400 font-mono">{s.category} • Rating: {s.rating}/10</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button onClick={() => { setEditingItem(s); setSkillForm(s); }} className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteSkill(s.id)} className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MANAGE WORK EXPERIENCE */}
          {activeTab === 'work' && (
            <div className="space-y-6">
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveWork} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-400" /> {editingItem ? 'Edit Work Entry' : 'Add Work / Internship Entry'}
                  </h4>
                  {editingItem && (
                    <button type="button" onClick={() => setEditingItem(null)} className="text-xs text-rose-400 hover:underline">Cancel Editing</button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Role Title</label>
                    <input type="text" required value={workForm.role} onChange={(e) => setWorkForm({ ...workForm, role: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Company / Organization</label>
                    <input type="text" required value={workForm.company} onChange={(e) => setWorkForm({ ...workForm, company: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Time Period</label>
                    <input type="text" required value={workForm.period} onChange={(e) => setWorkForm({ ...workForm, period: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Location</label>
                    <input type="text" required value={workForm.location} onChange={(e) => setWorkForm({ ...workForm, location: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                </div>

                {/* Optional Work Certificate / Document Uploader */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>📄 Experience Certificate / Letter / Media (Upload PDF/Image OR Paste Link)</span>
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Select File from PC/Phone:</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileUpload(e, (base64) => setWorkForm({ ...workForm, doc: base64 }))}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Document Link (URL):</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={workForm.doc || ''}
                        onChange={(e) => setWorkForm({ ...workForm, doc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>
                  {workForm.doc && (
                    <span className="inline-block mt-1 text-[10px] text-emerald-400 font-mono">✓ Work Document / Certificate Attached</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Description</label>
                  <textarea rows={3} required value={workForm.description} onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                </div>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingItem ? 'Update Work Entry' : 'Publish Work Entry'}
                </button>
              </motion.form>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Current Work Experience ({workList.length})</h4>
                <div className="space-y-3">
                  {workList.map((w) => (
                    <div key={w.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-slate-100 text-xs">{w.role} @ {w.company}</h5>
                        <span className="text-[10px] text-cyan-400 font-mono">{w.period} • {w.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button onClick={() => { setEditingItem(w); setWorkForm({ ...w, skills: Array.isArray(w.skills) ? w.skills.join(', ') : w.skills }); }} className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteWork(w.id)} className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MANAGE EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveEducation} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-cyan-400" /> {editingItem ? 'Edit Education Milestone' : 'Add Academic Milestone'}
                  </h4>
                  {editingItem && (
                    <button type="button" onClick={() => { setEditingItem(null); setEducationForm({ degree: '', institution: '', period: '', location: '', grade: '', badge: 'Undergraduate Degree', highlights: '', doc: '' }); }} className="text-xs text-rose-400 hover:underline">Cancel Editing</button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Degree / Course Name</label>
                    <input type="text" required value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} placeholder="e.g. Bachelor of Engineering in CSE" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Institution / Board / University</label>
                    <input type="text" required value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} placeholder="e.g. Visvesvaraya Technological University (VTU)" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Years / Time Period</label>
                    <input type="text" required value={educationForm.period} onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })} placeholder="e.g. 2022 - 2026" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Location</label>
                    <input type="text" required value={educationForm.location} onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })} placeholder="e.g. Karnataka, India" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Grade / CGPA / Percentage</label>
                    <input type="text" required value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} placeholder="e.g. CGPA: 8.75 / 10" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Badge Tag</label>
                    <input type="text" required value={educationForm.badge} onChange={(e) => setEducationForm({ ...educationForm, badge: e.target.value })} placeholder="e.g. Undergraduate Degree" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                </div>

                {/* Document / Certificate Uploader */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>📄 Academic Certificate / Marks Card / Degree PDF (Upload OR Paste Link)</span>
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Select File from PC/Phone:</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileUpload(e, (base64) => setEducationForm({ ...educationForm, doc: base64 }))}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Document Link (URL):</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={educationForm.doc || ''}
                        onChange={(e) => setEducationForm({ ...educationForm, doc: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>
                  {educationForm.doc && (
                    <span className="inline-block mt-1 text-[10px] text-emerald-400 font-mono">✓ Academic Document / Certificate Attached</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Key Highlights & Accomplishments (One per line or comma-separated)</label>
                  <textarea
                    rows={3}
                    value={Array.isArray(educationForm.highlights) ? educationForm.highlights.join('\n') : educationForm.highlights}
                    onChange={(e) => setEducationForm({ ...educationForm, highlights: e.target.value })}
                    placeholder="Specialized in Operating Systems and Distributed Systems&#10;Published capstone project on IoT Telemetry"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingItem ? 'Update Education Milestone' : 'Publish Education Milestone'}
                </button>
              </motion.form>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Current Education Records ({educationList.length})</h4>
                <div className="space-y-3">
                  {educationList.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-100 text-xs">{edu.degree}</h5>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{edu.badge}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{edu.institution} • <span className="text-amber-400 font-semibold">{edu.grade}</span></p>
                        <span className="text-[10px] text-slate-400 font-mono">{edu.period} • {edu.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingItem(edu);
                            setEducationForm({
                              ...edu,
                              highlights: Array.isArray(edu.highlights) ? edu.highlights.join('\n') : (edu.highlights || '')
                            });
                          }}
                          className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs"
                          title="Edit Milestone"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MANAGE INTERESTS */}
          {activeTab === 'interests' && (
            <div className="space-y-6">
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveInterest} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" /> {editingItem ? 'Edit Interest Pursuit' : 'Add Interest & Personal Pursuit'}
                  </h4>
                  {editingItem && (
                    <button type="button" onClick={() => { setEditingItem(null); setInterestForm({ title: '', badge: 'Engineering Hobby', category: 'Hardware', icon: 'Cpu', image: '', description: '', tags: '' }); }} className="text-xs text-rose-400 hover:underline">Cancel Editing</button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Pursuit Title</label>
                    <input type="text" required value={interestForm.title} onChange={(e) => setInterestForm({ ...interestForm, title: e.target.value })} placeholder="e.g. Hardware Prototyping & PCB Design" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Badge Tag</label>
                    <input type="text" required value={interestForm.badge} onChange={(e) => setInterestForm({ ...interestForm, badge: e.target.value })} placeholder="e.g. Engineering Hobby" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Category</label>
                    <select value={interestForm.category} onChange={(e) => setInterestForm({ ...interestForm, category: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 text-slate-200">
                      <option value="Hardware">Hardware / Embedded</option>
                      <option value="AI Art">AI Art & Creative</option>
                      <option value="Analytics">Sports / Data Analytics</option>
                      <option value="Research">Systems Research</option>
                      <option value="Gaming">Gaming & Simulation</option>
                      <option value="Other">Other Pursuit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Icon Style</label>
                    <select value={interestForm.icon} onChange={(e) => setInterestForm({ ...interestForm, icon: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 text-slate-200">
                      <option value="Cpu">Cpu (Hardware)</option>
                      <option value="Sparkles">Sparkles (Creative / AI)</option>
                      <option value="Trophy">Trophy (Sports / Achievement)</option>
                      <option value="Flame">Flame (Trending / Hot)</option>
                      <option value="Layers">Layers (Design / Stack)</option>
                      <option value="Code">Code (Software)</option>
                      <option value="Rocket">Rocket (Space / Launch)</option>
                      <option value="Heart">Heart (Passion)</option>
                      <option value="BookOpen">BookOpen (Learning)</option>
                    </select>
                  </div>
                </div>

                {/* Image Uploader & Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>🖼️ Showcase Image (Upload OR Paste URL)</span>
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">📁 Select Image File:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (base64) => setInterestForm({ ...interestForm, image: base64 }))}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1 font-mono">🔗 OR Paste Image URL:</span>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={interestForm.image || ''}
                        onChange={(e) => setInterestForm({ ...interestForm, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                  </div>
                  {interestForm.image && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={interestForm.image} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-white/20" />
                      <span className="text-[10px] text-emerald-400 font-mono">✓ Image Attached</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={interestForm.description}
                    onChange={(e) => setInterestForm({ ...interestForm, description: e.target.value })}
                    placeholder="Detail what you explore, build, or research in this pursuit..."
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Hashtags / Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(interestForm.tags) ? interestForm.tags.join(', ') : interestForm.tags}
                    onChange={(e) => setInterestForm({ ...interestForm, tags: e.target.value })}
                    placeholder="e.g. EasyEDA, FreeRTOS, Custom Schematics"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingItem ? 'Update Interest Pursuit' : 'Publish Interest Pursuit'}
                </button>
              </motion.form>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Current Interests Records ({interestsList.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interestsList.map((intr) => (
                    <div key={intr.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {intr.image ? (
                          <img src={intr.image} alt={intr.title} className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                            <Sparkles className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{intr.badge}</span>
                          <h5 className="font-bold text-slate-100 text-xs mt-1">{intr.title}</h5>
                          <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{intr.description}</p>
                          {intr.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(Array.isArray(intr.tags) ? intr.tags : (intr.tags || '').split(',')).map((t, idx) => (
                                <span key={idx} className="text-[9px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                                  #{typeof t === 'string' ? t.trim() : t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingItem(intr);
                            setInterestForm({
                              ...intr,
                              tags: Array.isArray(intr.tags) ? intr.tags.join(', ') : (intr.tags || '')
                            });
                          }}
                          className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs"
                          title="Edit Interest"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteInterest(intr.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs"
                          title="Delete Interest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSaveGallery} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-cyan-400" /> {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Title</label>
                    <input type="text" required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Gallery Image (Upload File OR Paste URL)</span>
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (base64) => setGalleryForm({ ...galleryForm, image: base64 }))}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer glass-card"
                      />
                      <input
                        type="text"
                        placeholder="OR Paste Image URL (https://...)"
                        value={galleryForm.image || ''}
                        onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                      />
                    </div>
                    {galleryForm.image && (
                      <div className="mt-2 flex items-center space-x-2">
                        <img src={galleryForm.image} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-cyan-400/40 shadow-md" />
                        <span className="text-[10px] text-emerald-400 font-mono">✓ Image Attached</span>
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Gallery Item
                </button>
              </motion.form>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-slate-200 font-mono">Gallery Items ({galleryList.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {galleryList.map((g) => (
                    <div key={g.id} className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <img src={g.image} alt={g.title} className="w-full h-24 object-cover rounded-xl" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 truncate">{g.title}</span>
                        <button onClick={() => handleDeleteGallery(g.id)} className="p-1 text-rose-400 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACCESS REQUESTS */}
          {activeTab === 'requests' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" /> Protected File &amp; Code Access Requests ({accessRequests.length})
                </h4>
                <span className="text-xs text-emerald-400 font-mono">Live Permission Approvals</span>
              </div>

              {accessRequests.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No access permission requests logged yet.</p>
              ) : (
                <div className="space-y-4">
                  {accessRequests.map((req, idx) => {
                    const cleanPhone = (req.phone || '').replace(/\D/g, '');
                    const requestedTitle = req.itemTitle || req.project || 'Protected File';
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                          <div>
                            <span className="font-bold text-slate-100 text-sm">{req.name}</span>
                            <span className="text-cyan-400 font-mono ml-2">({req.email})</span>
                            {req.phone && (
                              <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30 ml-2">
                                📞 {req.phone}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{req.timestamp ? new Date(req.timestamp).toLocaleString() : 'Recent'}</span>
                        </div>

                        <div>
                          <span className="text-slate-400">Requested File: </span>
                          <span className="font-bold text-cyan-300">{requestedTitle}</span>
                        </div>

                        {req.reason && (
                          <p className="text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/5 leading-relaxed">
                            <strong className="text-slate-400">Reason: </strong>{req.reason}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={`mailto:${req.email}?subject=Approved: Access Request for ${encodeURIComponent(requestedTitle)}&body=${encodeURIComponent(`Hi ${req.name},\n\nYour request to access "${requestedTitle}" has been APPROVED!\n\nBest regards,\nSantosh`)}`}
                            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold text-xs flex items-center space-x-1.5 hover:bg-cyan-500/30 transition-all"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>✉️ Approve &amp; Send File via Email</span>
                          </a>

                          {cleanPhone && (
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${req.name}! Your permission request for "${requestedTitle}" has been APPROVED by Santosh!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold text-xs flex items-center space-x-1.5 hover:bg-emerald-500/30 transition-all"
                            >
                              <span>💬 Approve &amp; Send via WhatsApp ↗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 7: VISITOR TELEMETRY */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" /> Visitor Telemetry Logs ({visitorLogs.length})
              </h4>
              {visitorLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No visitor logs recorded yet.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-[11px]">
                  {visitorLogs.map((log, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300 flex justify-between">
                      <span>Path: {log.pathname}</span>
                      <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 8: CHANGE PASSWORD SETTINGS */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
              <div>
                <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" /> Change Admin CMS Password
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Set a new personal password for your Admin CMS dashboard.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">New Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new secret password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <button type="submit" className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 transition-all flex items-center gap-2">
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </form>
            </motion.div>
          )}

        </div>
      )}

    </div>
  </PageWrapper>
);
}
