<div align="center">
  <img src="public/logo.svg" alt="AccessContrast Logo" width="120" />

  <h1>AccessContrast 🎨🔍</h1>

  <p>
    <strong>A secure, 100% local, browser-based UI Color Contrast Checker.</strong>
  </p>

  <p>
    <a href="https://github.com/s-arbu/accesscontrast/blob/main/LICENSE"><img src="https://img.shields.io/github/license/s-arbu/accesscontrast?style=flat-squicle&color=blue" alt="License"></a>
    <img src="https://img.shields.io/badge/React-18-blue?style=flat-squicle&logo=react" alt="React 18">
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-squicle&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-squicle&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  </p>
</div>

---

AccessContrast helps designers and developers ensure their User Interfaces meet the strict accessibility standards of **WCAG 2.1/2.2 (Level AA and AAA)** and the upcoming **European Accessibility Act (EAA / BFSG)**. 

Test UI mockups, extract exact pixel colors, analyze layout edges, and fine-tune your palette—all completely offline in your browser.

## ✨ Features

- **🔒 100% Local Processing:** Your designs never leave your browser. Perfect for NDA-protected mockups.
- **🎯 Pixel-Perfect Sampling:** Interactive canvas with a smart magnifying glass for precise color extraction.
- **📊 WCAG Compliant:** Calculates accurate contrast ratios using official W3C relative luminance formulas.
- **🔥 Edge-Detection Heatmap:** Highlights problematic layout boundaries (red for failing, green for passing).
- **🎛️ Live Color Tuning:** Smooth HSL-based sliders to easily adjust failing colors.
- **⌨️ Keyboard Accessible:** Full A11y support for the canvas and UI controls.

## 🛠 Tech Stack

- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (fully responsive, custom dark mode)
- **Routing:** React Router v6
- **Deployment:** Vercel (Optimized SPA)

## 🚀 Quick Start

**1. Clone & Install**
```bash
git clone [https://github.com/s-arbu/accesscontrast.git](https://github.com/s-arbu/accesscontrast.git)
cd accesscontrast
bun install  # or npm install
```

**2. Start the development server**

```Bash
bun run dev
```

The app will be available at <http://localhost:5173>.

**3. Build for production**

```Bash
bun run build
```

## 🤝 Contributing

Contributions are always welcome! Whether it's a bug fix, a new feature, or documentation improvements.

* Fork the Project
* Create your Feature Branch (git checkout -b feature/AmazingFeature)
* Commit your Changes (git commit -m 'Add some AmazingFeature')
* Push to the Branch (git push origin feature/AmazingFeature)
* Open a Pull Request

⚖️ License
Distributed under the MIT License. See LICENSE for more information.
