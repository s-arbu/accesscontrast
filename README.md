# AccessContrast 🎨🔍

> **A secure, 100% local, browser-based UI Color Contrast Checker.**

AccessContrast helps designers and developers ensure their User Interfaces meet the strict accessibility standards of **WCAG 2.1/2.2 (Level AA and AAA)**, as well as the upcoming **European Accessibility Act (EAA / BFSG)**.

Test UI mockups, extract exact pixel colors, analyze layout edges via a custom heatmap, and fine-tune your palette—all without ever uploading your confidential designs to a server.

## ✨ Features

* **🔒 100% Local Processing:** Your designs never leave your browser. Perfect for NDA-protected or unreleased mockups.
* **🎯 Pixel-Perfect Sampling:** Interactive canvas with a smart magnifying glass for selecting exact foreground and background colors.
* **📊 WCAG 2.1 & 2.2 Compliant:** Calculates precise contrast ratios using official W3C relative luminance formulas. Evaluates both text and non-text (UI boundaries) components.
* **🔥 Edge-Detection Heatmap:** Highlights problematic layout edges (red for failing contrast, green for passing) directly on your design.
* **🎛️ Live Color Tuning:** Smooth HSL-based sliders to fine-tune failing colors until they pass the legal thresholds.
* **⌨️ Keyboard Accessible (A11y):** Full keyboard support for the interactive canvas and UI controls.
* **🚀 SEO Optimized (SSG):** Built with Vite SSG and structured Schema.org JSON-LD for maximum search engine visibility.

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript
* **Styling:** Tailwind CSS (fully responsive, custom dark mode)
* **Routing:** React Router v6
* **Build Tool:** Vite + Vite-Plugin-SSG (Static Site Generation)
* **Deployment:** Optimized for Vercel

## 🚀 Quick Start

Follow these steps to get the project running locally:

### 1. Clone the repository

```bash
git clone [https://github.com/s-arbu/accesscontrast.git](https://github.com/s-arbu/accesscontrast.git)
cd accesscontrast
```

### 2. Install dependencies (npm or bun)

```bash
npm install
```

### 3. Start the development server

```Bash
npm run dev
```

The app will be available at <http://localhost:5173>.

### 4. Build for production (with SSG)

```Bash
npm run build
```

This generates SEO-friendly static HTML files in the /dist folder.

## 🤝 Contributing

Contributions are always welcome! Whether it's a bug fix, a new feature, or an improvement to the documentation, feel free to open an issue or submit a pull request.

* Fork the Project
* Create your Feature Branch (git checkout -b feature/AmazingFeature)
* Commit your Changes (git commit -m 'Add some AmazingFeature')
* Push to the Branch (git push origin feature/AmazingFeature)
* Open a Pull Request

Please read the AGENTS.md file if you are using AI tools (like Cursor or Copilot) to ensure your generated code aligns with the project's architecture.

⚖️ License
Distributed under the MIT License. See LICENSE for more information.
