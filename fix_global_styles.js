const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');

const ambientGlowCSS = `
/* GLOBAL AMBIENT GLOW */
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  background: 
    radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.08), transparent 35%),
    radial-gradient(circle at 80% 70%, rgba(52, 211, 153, 0.05), transparent 35%);
  background-size: 200% 200%;
  animation: global-ambient-drift 15s ease-in-out infinite alternate;
  opacity: 1;
  transition: opacity 0.5s ease;
}
.dark body::before {
  background: 
    radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.12), transparent 35%),
    radial-gradient(circle at 90% 80%, rgba(52, 211, 153, 0.10), transparent 35%);
}

@keyframes global-ambient-drift {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  body::before {
    animation: none !important;
  }
}
`;

if(!css.includes('GLOBAL AMBIENT GLOW')) {
  css = css + '\n' + ambientGlowCSS;
  fs.writeFileSync('src/index.css', css, 'utf-8');
}
