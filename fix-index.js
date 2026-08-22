const fs = require('fs');

// 1. Update index.html
let htmlContent = fs.readFileSync('index.html', 'utf8');
htmlContent = htmlContent.replace(
  /<link href="https:\/\/fonts.googleapis.com\/css2\?family=DM\+Serif\+Display[^"]+" rel="stylesheet">/,
  '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
);
fs.writeFileSync('index.html', htmlContent);

// 2. Update index.css
let cssContent = fs.readFileSync('src/index.css', 'utf8');
const newCss = `@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Poppins", sans-serif;
  --font-heading: "Poppins", sans-serif;
}

@layer base {
  :root {
    /* Light Theme - Light Green & White */
    --primary: #169C72;
    --primary-light: #55C99A;
    --primary-dark: #087A59;
    --secondary: #087A59;
    --accent: #169C72;
    --atmospheric: #DFF7EC;
    --background: #F8FCFA;
    --surface: #FFFFFF;
    --text: #10251E;
    --muted: #667871;
    
    /* Light Glass System */
    --glass-bg: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(241,251,246,0.94));
    --glass-border: rgba(22,156,114,0.12);
    --glass-shadow: 0 25px 70px rgba(16,70,52,0.06);
    --glass-highlight: inset 0 1px 0 rgba(255,255,255,1);

    --color-bg-primary: var(--background);
    --color-surface: var(--surface);
    --color-text-main: var(--text);
  }

  .dark {
    /* Dark Theme - Adjusted for Green consistency */
    --primary: #169C72;
    --primary-light: #55C99A;
    --primary-dark: #087A59;
    --secondary: #087A59;
    --accent: #55C99A;
    --atmospheric: #083325;
    --background: #04120E;
    --surface: #07221A;
    --text: #F1FBF6;
    --muted: #83A196;
    
    /* Dark Glass System */
    --glass-bg: linear-gradient(135deg, rgba(7,34,26,0.85), rgba(7,34,26,0.65));
    --glass-border: rgba(22,156,114,0.25);
    --glass-shadow: 0 25px 80px rgba(0,0,0,0.6);
    --glass-highlight: inset 0 1px 0 rgba(255,255,255,0.05);

    --color-bg-primary: var(--background);
    --color-surface: var(--surface);
    --color-text-main: var(--text);
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: var(--color-bg-primary);
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(222,247,236,0.4), transparent 30%),
      radial-gradient(circle at 90% 10%, rgba(22,156,114,0.05), transparent 28%);
    background-attachment: fixed;
    color: var(--color-text-main);
    transition: background-color 0.4s ease, color 0.4s ease, background-image 0.4s ease;
  }
  
  .dark body {
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(22,156,114,0.1), transparent 30%),
      radial-gradient(circle at 90% 10%, rgba(8,122,89,0.12), transparent 28%);
  }

  h1, h2, h3, h4, .font-serif, .font-heading {
    font-family: 'Poppins', sans-serif;
    letter-spacing: -0.02em;
  }
}

::selection {
  background-color: var(--primary);
  color: #FFFFFF;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@layer utilities {
  /* Premium Glassmorphic Design System */
  
  .glass-primary {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow), var(--glass-highlight);
    border-radius: 32px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-card {
    background: var(--surface);
    border: 1px solid var(--glass-border);
    box-shadow: 0 12px 40px rgba(16,70,52,0.04);
    border-radius: 20px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .dark .glass-card {
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }

  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 50px rgba(16,70,52,0.08);
  }
  
  .dark .glass-card:hover {
     box-shadow: 0 16px 50px rgba(0,0,0,0.5);
  }

  .glass-nav {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--glass-border);
    box-shadow: 0 4px 30px rgba(16,70,52,0.03);
    transition: all 0.4s ease;
  }
  
  .dark .glass-nav {
    background: rgba(7,34,26,0.95);
    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
  }

  .glass-floating {
    background: var(--surface);
    border: 1px solid var(--glass-border);
    box-shadow: 0 16px 48px rgba(16,70,52,0.08);
    border-radius: 100px;
  }
  
  .dark .glass-floating {
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }

  .glass-input {
    background: linear-gradient(135deg, #FFFFFF, #F1FBF6);
    border: 1px solid rgba(22,156,114,0.15);
    border-radius: 16px;
    box-shadow: inset 0 2px 4px rgba(22,156,114,0.02);
    transition: all 0.3s ease;
  }
  
  .dark .glass-input {
    background: linear-gradient(135deg, #07221A, #0A2E23);
    border-color: rgba(22,156,114,0.25);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .glass-input:focus-within, .glass-input:hover {
    border-color: var(--primary-light);
    box-shadow: 0 4px 20px rgba(22,156,114,0.08), inset 0 2px 4px rgba(22,156,114,0.01);
    background: #FFFFFF;
  }
  
  .dark .glass-input:focus-within, .dark .glass-input:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.2);
    background: #04120E;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: #FFFFFF;
    border-radius: 100px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 24px rgba(22, 156, 114, 0.25);
    position: relative;
    overflow: hidden;
  }
  
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(255,255,255,0.15), transparent);
    pointer-events: none;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(22, 156, 114, 0.35);
  }

  .btn-glass {
    background: #FFFFFF;
    border: 1px solid var(--glass-border);
    color: var(--text);
    border-radius: 100px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(16,70,52,0.04);
  }
  
  .dark .btn-glass {
    background: var(--surface);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

  .btn-glass:hover {
    background: var(--atmospheric);
    transform: translateY(-2px);
    border-color: var(--primary-light);
    color: var(--primary-dark);
    box-shadow: 0 8px 24px rgba(22,156,114,0.12);
  }
  
  .dark .btn-glass:hover {
    background: rgba(22,156,114,0.2);
    border-color: var(--primary);
    color: #FFFFFF;
  }

  .btn-accent {
    background: var(--accent);
    color: #FFFFFF;
    border-radius: 100px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(22, 156, 114, 0.3);
  }

  .btn-accent:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(22, 156, 114, 0.4);
    filter: brightness(1.05);
  }

  /* Liquid Animation Backgrounds */
  .liquid-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .liquid-orb {
    position: absolute;
    border-radius: 100%;
    filter: blur(100px);
    opacity: 0.7;
    animation: float 14s infinite ease-in-out alternate;
  }
  
  .dark .liquid-orb {
    opacity: 0.3;
  }

  @keyframes float {
    0% {
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
    33% {
      transform: translate(40px, -60px) scale(1.1) rotate(5deg);
    }
    66% {
      transform: translate(-30px, 40px) scale(0.9) rotate(-5deg);
    }
    100% {
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
  }

  @keyframes subtle-zoom {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  .animate-subtle-zoom {
    animation: subtle-zoom 20s infinite ease-in-out;
  }

  /* Text Gradients */
  .text-gradient-emerald {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .dark .text-gradient-emerald {
    background: linear-gradient(135deg, var(--primary-light), #FFFFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .text-gradient-gold {
    background: linear-gradient(135deg, var(--primary-light), var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
`;
fs.writeFileSync('src/index.css', newCss);

