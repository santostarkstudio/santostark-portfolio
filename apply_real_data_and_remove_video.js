const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const snapshot = JSON.parse(fs.readFileSync(path.join(rootDir, 'firestore_snapshot.json'), 'utf8'));

console.log('🚀 Starting Full Site Data Synchronization & Video Removal...');

// =========================================================================
// 1. UPDATE index.html & public/index.html (Remove 56.6MB video)
// =========================================================================
const htmlFiles = [
  path.join(rootDir, 'index.html'),
  path.join(rootDir, 'public/index.html')
];

const videoContainerRegex = /<!-- 4K Space Video Backdrop -->[\s\S]*?<\/div>[\s\S]*?<!-- Obsidian Shield -->[\s\S]*?<\/div>[\s\S]*?<!-- Seamless Edge Feathering -->[\s\S]*?<\/div>[\s\S]*?<\/div>/i;

const videoScriptRegex = /<!-- Smart Video Loader[\s\S]*?<\/script>/i;

const replacementHtml = `<!-- Pure CSS Deep Obsidian Space Canvas (0 MB, 0 delay, 120 FPS) -->
    <div id="orbital-video-container" style="position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; overflow: hidden; background: radial-gradient(circle at 50% 30%, rgba(13, 20, 36, 0.45) 0%, #090a0f 65%, #030508 100%);">
      <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, #090a0f 0%, transparent 15%, transparent 85%, #090a0f 100%);"></div>
    </div>`;

const cacheUpgradeScript = `<!-- Instant cache upgrade to v2 (Real Cyber & MVJ Data) -->
    <script>
      (function() {
        try {
          if (localStorage.getItem('stark_data_version') !== 'v2_cyber_mvj') {
            var keys = ['hero_info', 'about_info', 'skills', 'projects', 'certificates'];
            for (var i = 0; i < keys.length; i++) {
              localStorage.removeItem('portfolio_' + keys[i]);
              localStorage.removeItem('portfolio_' + keys[i] + '_initialized');
            }
            localStorage.removeItem('stark_visual_edits_v1');
            localStorage.setItem('stark_data_version', 'v2_cyber_mvj');
          }
        } catch(e) {}
      })();
    </script>`;

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Replace video container
  if (videoContainerRegex.test(html)) {
    html = html.replace(videoContainerRegex, replacementHtml);
    console.log(`✅ Removed 56.6MB video container from ${path.basename(file)}`);
  } else if (html.includes('id="orbital-bg-video"')) {
    // Fallback replacement if structure slightly varied
    const startIdx = html.indexOf('<div id="orbital-video-container"');
    const rootIdx = html.indexOf('<div id="root"');
    if (startIdx !== -1 && rootIdx !== -1 && startIdx < rootIdx) {
      html = html.substring(0, startIdx) + replacementHtml + '\n\n    ' + html.substring(rootIdx);
      console.log(`✅ Replaced video container (index slice) in ${path.basename(file)}`);
    }
  }

  // Remove video script
  if (videoScriptRegex.test(html)) {
    html = html.replace(videoScriptRegex, cacheUpgradeScript);
    console.log(`✅ Replaced video script with instant cache upgrade in ${path.basename(file)}`);
  } else if (!html.includes('v2_cyber_mvj')) {
    html = html.replace('<div id="root"', cacheUpgradeScript + '\n    <div id="root"');
    console.log(`✅ Injected instant cache upgrade before #root in ${path.basename(file)}`);
  }

  fs.writeFileSync(file, html, 'utf8');
});

// =========================================================================
// 2. UPDATE build.js & vercel.json
// =========================================================================
const buildJsPath = path.join(rootDir, 'build.js');
if (fs.existsSync(buildJsPath)) {
  let bJs = fs.readFileSync(buildJsPath, 'utf8');
  bJs = bJs.replace(/if\s*\(fs\.existsSync\(path\.join\(__dirname,\s*['"]bg-video\.mp4['"]\)\)\)\s*\{[\s\S]*?\}/g, '// bg-video.mp4 removed for 56.6MB performance boost');
  fs.writeFileSync(buildJsPath, bJs, 'utf8');
  console.log('✅ Updated build.js (no longer copies bg-video.mp4)');
}

const vercelJsonPath = path.join(rootDir, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  try {
    const vJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    if (vJson.headers) {
      vJson.headers = vJson.headers.filter(h => h.source !== '/bg-video.mp4');
    }
    fs.writeFileSync(vercelJsonPath, JSON.stringify(vJson, null, 2), 'utf8');
    console.log('✅ Updated vercel.json (removed /bg-video.mp4 header)');
  } catch(e) {
    console.error('Error updating vercel.json:', e.message);
  }
}

// =========================================================================
// 3. PREPARE REAL DATA OBJECTS
// =========================================================================
const realHero = {
  id: "main_hero",
  brandName: snapshot.hero_info[0].brandName || "SANTO STARK STUDIO",
  brandSubtitle: snapshot.hero_info[0].brandSubtitle || "CSE Grad | Cyber Pro",
  brandLogo: "/assets/brand-logo.webp",
  greeting: snapshot.hero_info[0].greeting || "Hi, I'm SANTOSHA D",
  title: snapshot.hero_info[0].title || "Aspiring Cyber Pro & CSE Grad",
  subtitle: snapshot.hero_info[0].subtitle || "Computer Science Engineering graduate and aspiring Cloud Security and GRC professional focused on IAM. I am passionate about bridging technical security with IT audit, software testing, and project management.",
  badge: snapshot.hero_info[0].badge || "Seeking Cybersecurity Internships ✦",
  email: snapshot.hero_info[0].email || "santoshdabadiaiyyanna@gmail.com",
  phone: snapshot.hero_info[0].phone || "8431069633",
  location: snapshot.hero_info[0].location || "India 🇮🇳",
  github: snapshot.hero_info[0].github || "https://github.com/santostarkstudio",
  linkedin: snapshot.hero_info[0].linkedin || "http://www.linkedin.com/in/santosha-dabadi-aiyyanna-ba0069333",
  twitter: snapshot.hero_info[0].twitter || "https://x.com/SantoStark15",
  instagram: snapshot.hero_info[0].instagram || "https://www.instagram.com/santoshdabadiaiyyanna?dlrf=bHF2bjNsa2JjdzRx",
  youtube: snapshot.hero_info[0].youtube || "https://youtube.com/@sdacreations2017?si=xAbeLb-PBXmB0I1R",
  leetcode: snapshot.hero_info[0].leetcode || "https://leetcode.com/u/SantoStark/",
  resume: "",
  skillPill1: snapshot.hero_info[0].skillPill1 || "Python",
  skillPill2: snapshot.hero_info[0].skillPill2 || " IAM, GRC, IT Audit",
  skillPill3: snapshot.hero_info[0].skillPill3 || "Blender"
};

const realAbout = {
  id: "main_about",
  title: snapshot.about_info[0].title || "Aspiring Cybersecurity Specialist & Computer Science Engineer",
  institution: snapshot.about_info[0].institution || "MVJ College of Engineering ,  Bengaluru, Karnataka, India, affiliated with Visvesvaraya Technological University (VTU)",
  bio: snapshot.about_info[0].bio || "I am a passionate Computer Science Engineering graduate with a strong focus on Cloud Security, Identity and Access Management (IAM), Governance, Risk, and Compliance (GRC), and IT Audit. My technical foundation spans software testing, quality assurance, and technical support. Equipped with an analytical mindset and hands-on project experience, I bridge technical security implementations with risk mitigation and business objectives.",
  photo: "",
  card1Title: snapshot.about_info[0].card1Title || "Cybersecurity & IAM, GRC, IT Audit",
  card1Desc: snapshot.about_info[0].card1Desc || "Auditing access policies, securing cloud environments, and mapping infrastructure to global compliance standards.",
  card2Title: snapshot.about_info[0].card2Title || "IT Operations & QA",
  card2Desc: snapshot.about_info[0].card2Desc || "Managing IT service desks, supporting enterprise workstations, and ensuring reliable operational workflows.",
  card3Title: snapshot.about_info[0].card3Title || "Software Testing",
  card3Desc: snapshot.about_info[0].card3Desc || "Executing software testing methodologies to identify bugs, validate functionality, and ensure software quality."
};

const realSkills = snapshot.skills.map((s, idx) => ({
  id: s.id || `s_${idx + 1}`,
  name: s.name,
  category: s.category || "Security",
  rating: s.rating || 8,
  description: s.description || ""
}));

const realProjects = snapshot.projects.map((p, idx) => ({
  id: p.id || `p_${idx + 1}`,
  title: p.title,
  category: p.category || "Embedded",
  image: p.image && p.image.length < 500 ? p.image : "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
  description: p.description || "",
  github: p.github || "https://github.com/santostarkstudio",
  live: p.live || "#",
  featured: p.featured !== undefined ? p.featured : true
}));

const realCerts = snapshot.certificates.map((c, idx) => ({
  id: c.id || `c_${idx + 1}`,
  title: c.title,
  issuer: c.issuer || "SkillFront / Stark",
  date: c.date || "2026",
  credentialId: c.credentialId || "",
  category: c.category || "Cybersecurity",
  image: c.image && c.image.length < 500 ? c.image : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
  summary: c.summary || "",
  verifyUrl: c.verifyUrl || ""
}));

console.log('✅ Real Data Structures prepared:');
console.log(`  - Hero: ${realHero.title}`);
console.log(`  - About: ${realAbout.title} (${realAbout.institution.substring(0, 30)}...)`);
console.log(`  - Skills: ${realSkills.length} items`);
console.log(`  - Projects: ${realProjects.length} items`);
console.log(`  - Certificates: ${realCerts.length} items`);

// =========================================================================
// 4. UPDATE source-code/src/services/firebase.js
// =========================================================================
const firebaseJsPath = path.join(rootDir, 'source-code/src/services/firebase.js');
if (fs.existsSync(firebaseJsPath)) {
  let fb = fs.readFileSync(firebaseJsPath, 'utf8');

  // Replace initialHeroInfo
  const heroRegex = /export const initialHeroInfo = \{[\s\S]*?\};/;
  fb = fb.replace(heroRegex, `export const initialHeroInfo = ${JSON.stringify(realHero, null, 2)};`);

  // Replace initialAboutInfo
  const aboutRegex = /export const initialAboutInfo = \{[\s\S]*?\};/;
  fb = fb.replace(aboutRegex, `export const initialAboutInfo = ${JSON.stringify(realAbout, null, 2)};`);

  // Replace initialSkills
  const skillsRegex = /export const initialSkills = \[[\s\S]*?\];/;
  fb = fb.replace(skillsRegex, `export const initialSkills = ${JSON.stringify(realSkills, null, 2)};`);

  // Replace initialProjects
  const projRegex = /export const initialProjects = \[[\s\S]*?\];/;
  fb = fb.replace(projRegex, `export const initialProjects = ${JSON.stringify(realProjects, null, 2)};`);

  // Replace initialCertificatesData
  const certRegex = /export const initialCertificatesData = \[[\s\S]*?\];/;
  fb = fb.replace(certRegex, `export const initialCertificatesData = ${JSON.stringify(realCerts, null, 2)};`);

  fs.writeFileSync(firebaseJsPath, fb, 'utf8');
  console.log('✅ Updated source-code/src/services/firebase.js with real Firestore data');
}

// =========================================================================
// 5. UPDATE source-code/src/pages/Home.jsx
// =========================================================================
const homeJsxPath = path.join(rootDir, 'source-code/src/pages/Home.jsx');
if (fs.existsSync(homeJsxPath)) {
  let home = fs.readFileSync(homeJsxPath, 'utf8');
  home = home.replace(/'SYSTEMS ARCHITECT & DATA SCIENCE LEAD'/g, "'Seeking Cybersecurity Internships ✦'");
  home = home.replace(/'SANTOSH D A'/g, "'Hi, I\\'m SANTOSHA D'");
  home = home.replace(/'Engineering & AI Leader'/g, "'Aspiring Cyber Pro & CSE Grad'");
  home = home.replace(/'Building high-throughput full-stack architectures[\s\S]*?'/g, `'${realHero.subtitle}'`);
  fs.writeFileSync(homeJsxPath, home, 'utf8');
  console.log('✅ Updated source-code/src/pages/Home.jsx default fallback strings');
}

// =========================================================================
// 6. UPDATE ALL 3 LIVE BUNDLES (public/assets, assets, source-code/public/assets)
// =========================================================================
const bundleTargets = [
  path.join(rootDir, 'public/assets/index-BMqPMOZ-.js'),
  path.join(rootDir, 'assets/index-BMqPMOZ-.js'),
  path.join(rootDir, 'source-code/public/assets/index-BMqPMOZ-.js')
];

bundleTargets.forEach(target => {
  if (!fs.existsSync(target)) return;
  console.log(`\n--- Patching Bundle: ${path.relative(rootDir, target)} ---`);
  let content = fs.readFileSync(target, 'utf8');

  // 1. Replace Bn={...} (Hero)
  const heroMarker = 'Bn={id:"main_hero"';
  const heroIdx = content.indexOf(heroMarker);
  const aboutMarker = ',$c={id:"main_about"';
  const aboutIdx = content.indexOf(aboutMarker, heroIdx);

  if (heroIdx !== -1 && aboutIdx !== -1) {
    const oldHeroStr = content.substring(heroIdx, aboutIdx);
    const newHeroStr = 'Bn=' + JSON.stringify(realHero);
    content = content.substring(0, heroIdx) + newHeroStr + content.substring(aboutIdx);
    console.log(`  ✅ Replaced Hero definition Bn (${oldHeroStr.length} -> ${newHeroStr.length} chars)`);
  } else {
    console.warn('  ⚠️ Hero Bn definition not found by markers');
  }

  // 2. Replace $c={...} (About)
  const newAboutIdx = content.indexOf('$c={id:"main_about"');
  const aboutEndMarker = 'photo:""}';
  const aboutEndIdx = content.indexOf(aboutEndMarker, newAboutIdx);

  if (newAboutIdx !== -1 && aboutEndIdx !== -1) {
    const oldAboutStr = content.substring(newAboutIdx, aboutEndIdx + aboutEndMarker.length);
    const newAboutStr = '$c=' + JSON.stringify(realAbout);
    content = content.substring(0, newAboutIdx) + newAboutStr + content.substring(aboutEndIdx + aboutEndMarker.length);
    console.log(`  ✅ Replaced About definition $c (${oldAboutStr.length} -> ${newAboutStr.length} chars)`);
  } else {
    console.warn('  ⚠️ About $c definition not found by markers');
  }

  // 3. Replace Ub=[...] (Skills)
  const skillsStartMarker = 'Ub=[{id:"s1",name:"C++ / Systems Programming"';
  const skillsStartIdx = content.indexOf(skillsStartMarker);
  const skillsEndMarker = 'prototype testing."}]';
  const skillsEndIdx = content.indexOf(skillsEndMarker, skillsStartIdx);

  if (skillsStartIdx !== -1 && skillsEndIdx !== -1) {
    const oldSkillsStr = content.substring(skillsStartIdx, skillsEndIdx + skillsEndMarker.length);
    const newSkillsStr = 'Ub=' + JSON.stringify(realSkills);
    content = content.substring(0, skillsStartIdx) + newSkillsStr + content.substring(skillsEndIdx + skillsEndMarker.length);
    console.log(`  ✅ Replaced Skills definition Ub (${oldSkillsStr.length} -> ${newSkillsStr.length} chars)`);
  } else {
    console.warn('  ⚠️ Skills Ub definition not found by markers');
  }

  // 4. Replace Vb=[...] (Projects)
  const projStartMarker = 'Vb=[{id:"p1",title:"3D Solar System & MIB Portfolio"';
  const projStartIdx = content.indexOf(projStartMarker);
  const projEndMarker = 'featured:!1}]';
  const projEndIdx = content.indexOf(projEndMarker, projStartIdx);

  if (projStartIdx !== -1 && projEndIdx !== -1) {
    const oldProjStr = content.substring(projStartIdx, projEndIdx + projEndMarker.length);
    const newProjStr = 'Vb=' + JSON.stringify(realProjects);
    content = content.substring(0, projStartIdx) + newProjStr + content.substring(projEndIdx + projEndMarker.length);
    console.log(`  ✅ Replaced Projects definition Vb (${oldProjStr.length} -> ${newProjStr.length} chars)`);
  } else {
    console.warn('  ⚠️ Projects Vb definition not found by markers');
  }

  // 5. Replace About Cards fallback strings
  content = content.replace(/"Systems & C\+\+"/g, '"Cybersecurity & IAM, GRC, IT Audit"');
  content = content.replace(/"Memory optimization, socket communication, multi-threaded task management\."/g, '"Auditing access policies, securing cloud environments, and mapping infrastructure to global compliance standards."');
  content = content.replace(/"Web & 3D Graphics"/g, '"IT Operations & QA"');
  content = content.replace(/"React, Vite, Three\.js\/R3F WebGL shaders, Tailwind CSS, and Firebase backends\."/g, '"Managing IT service desks, supporting enterprise workstations, and ensuring reliable operational workflows."');
  content = content.replace(/"IoT & Embedded"/g, '"Software Testing"');
  content = content.replace(/"ESP32, FreeRTOS, MQTT, sensor bus protocols \(I2C, SPI\), and custom PCB design\."/g, '"Executing software testing methodologies to identify bugs, validate functionality, and ensure software quality."');

  // 6. Replace AI Assistant FAQ response
  content = content.replace(/Santo is a Full-Stack Engineer & 3D Web Developer passionate about crafting visually stunning, ultra-fast web apps and AI systems\./g, 'Santo is an Aspiring Cyber Pro & CSE Grad passionate about Cloud Security, IAM, IT Audit, and software testing.');

  fs.writeFileSync(target, content, 'utf8');
  console.log(`  💾 Successfully saved ${path.basename(target)}`);
});

console.log('\n🎉 ALL REAL FIRESTORE DATA SUCCESSFULLY BAKED INTO WEBSITE & 56.6MB VIDEO REMOVED!');
