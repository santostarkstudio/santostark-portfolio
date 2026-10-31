with open('source-code/src/components/Navbar.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

NAVBAR_OLD = '''          <div 
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('/');
              if (window.starkScrollTo) {
                window.starkScrollTo('home');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-[2px] shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform cursor-pointer"
            title="Santo Stark Studio - Back to Top"
          >
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center overflow-hidden">
              {heroInfo.brandLogo ? (
                <img 
                  src={heroInfo.brandLogo} 
                  alt="Brand Logo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                </div>
              )}
            </div>
          </div>

          <Link 
            to="/" 
            className="flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink min-w-0"
            aria-label="Santo Stark Studio Home"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('/');
              if (window.starkScrollTo) {
                window.starkScrollTo('home');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img 
              src="/assets/santo-stark-studio-metallic-title.png" 
              alt="Santo Stark Studio" 
              className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto max-w-[180px] sm:max-w-[230px] md:max-w-none object-contain select-none pointer-events-auto filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
              loading="eager"
            />
          </Link>'''

NAVBAR_NEW = '''          <div 
            onClick={(e) => {
              if (heroInfo.brandLogo) {
                e.preventDefault();
                e.stopPropagation();
                if (heroInfo.brandLogo.startsWith('data:')) {
                  const win = window.open('', '_blank');
                  if (win) {
                    win.document.write(`<html style="background:#090a0f;"><head><title>Brand Logo Preview</title></head><body style="margin:0;background:#090a0f;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${heroInfo.brandLogo}" style="max-width:95vw;max-height:95vh;object-fit:contain;box-shadow:0 0 40px rgba(34,211,238,0.3);border-radius:16px;" /></body></html>`);
                  }
                } else {
                  window.open(heroInfo.brandLogo, '_blank');
                }
              }
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-[2px] shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform cursor-pointer"
            title={heroInfo.brandLogo ? "Click to view full high quality logo in new tab ↗" : "Santo Stark Studio Logo"}
          >
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center overflow-hidden">
              {heroInfo.brandLogo ? (
                <img 
                  src={heroInfo.brandLogo} 
                  alt="Brand Logo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                </div>
              )}
            </div>
          </div>

          <Link 
            to="/" 
            className="flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink min-w-0 no-lightbox"
            aria-label="Santo Stark Studio Home"
            onClick={(e) => {
              e.stopPropagation();
              if (location.pathname === '/' || location.pathname === '') {
                e.preventDefault();
                setActiveSection('/');
                if (window.starkScrollTo) {
                  window.starkScrollTo('home');
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              } else {
                setActiveSection('/');
                setTimeout(() => {
                  if (window.starkScrollTo) {
                    window.starkScrollTo('home');
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }, 100);
              }
            }}
          >
            <img 
              src="/assets/santo-stark-studio-metallic-title.png" 
              alt="Santo Stark Studio" 
              className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto max-w-[180px] sm:max-w-[230px] md:max-w-none object-contain select-none pointer-events-none filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] no-lightbox"
              loading="eager"
            />
          </Link>'''

# Normalize newlines
c_norm = c.replace('\r\n', '\n')
if NAVBAR_OLD not in c_norm:
    print("Error: NAVBAR_OLD not found in Navbar.jsx")
else:
    c_norm = c_norm.replace(NAVBAR_OLD, NAVBAR_NEW, 1)
    # restore CRLF
    with open('source-code/src/components/Navbar.jsx', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(c_norm.replace('\n', '\r\n'))
    print("Successfully updated source-code/src/components/Navbar.jsx")

