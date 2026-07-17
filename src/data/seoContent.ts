export const guideData = {
  title: "AccessContrast Guide: How to Check UI Color Contrast",
  description: "A simple, step-by-step guide to visually testing color contrast for WCAG 2.1 / 2.2 compliance. Optimize your User Interfaces (UI) for maximum digital accessibility.",
  steps: [
    {
      title: "1. Secure Design Upload",
      description: "Drag and drop your mockup, UI screenshot, or website design into the interactive canvas. Privacy first: All images are processed 100% locally in your browser. There are no server uploads, making it perfectly safe for NDA-protected designs."
    },
    {
      title: "2. Pixel-Perfect Color Picker",
      description: "Use the crosshair to extract the exact foreground (text) and background colors directly from your design. The smart magnifier helps you target tiny UI elements. The tool automatically switches to the next color slot after each click."
    },
    {
      title: "3. Keyboard Accessibility (A11y)",
      description: "The canvas is fully keyboard accessible. Focus the image and use the arrow keys to navigate. Hold 'Shift' for larger jumps, and press 'Enter' or 'Space' to select a color."
    },
    {
      title: "4. Contrast Edge Heatmap",
      description: "Toggle the heatmap to instantly spot problematic layout areas. Red edges highlight critical contrast failures (below the 3:1 UI threshold). Green edges confirm safe boundaries between UI components."
    },
    {
      title: "5. Live Tuning & WCAG Scores",
      description: "Check your WCAG compliance (AA / AAA) in real-time in the sidebar. If a color pairing fails the test, use the HSL sliders to finely adjust the lightness until it meets legal accessibility standards."
    },
    {
      title: "6. Color History",
      description: "Every successful contrast check is automatically saved to your history. This allows you to experiment with different color pairs, compare them, and restore previous swatches with a single click."
    }
  ]
};

export const faqData = {
  title: "Web Accessibility & WCAG FAQ",
  description: "Essential answers regarding UI color contrast, the European Accessibility Act (EAA), ADA compliance, and Web Content Accessibility Guidelines (WCAG). Built for designers and developers.",
  items: [
    {
      q: "What is the European Accessibility Act (EAA)?",
      a: "The EAA is an EU directive requiring digital products and services to be accessible to persons with disabilities by June 28, 2025. Non-compliance (such as poor color contrast) can lead to legal action and fines. In Germany, this is implemented as the BFSG (Barrierefreiheitsstärkungsgesetz)."
    },
    {
      q: "Does this tool help with ADA and Section 508 compliance?",
      a: "Yes. Both the Americans with Disabilities Act (ADA) and Section 508 reference the Web Content Accessibility Guidelines (WCAG) as the standard for digital accessibility. AccessContrast uses the official WCAG algorithms to verify compliance."
    },
    {
      q: "What are the required WCAG contrast ratios?",
      a: "For the legal standard (WCAG Level AA), normal text (under 24px) requires a minimum contrast ratio of 4.5:1 against its background. Large text (24px and larger, or 18.5px and bold) requires a contrast ratio of 3:1."
    },
    {
      q: "Do UI components like buttons and icons need to be accessible?",
      a: "Yes. This is known as 'Non-Text Contrast'. UI boundaries (like text inputs, buttons, focus rings) and functional icons must have a contrast ratio of at least 3:1 against adjacent background colors."
    },
    {
      q: "What is the difference between WCAG AA and AAA?",
      a: "Level AA is the mandatory baseline standard for most digital products worldwide. Level AAA is the strictest standard (requiring a 7:1 ratio for normal text) and is typically only mandatory for specialized government, accessibility, or healthcare platforms."
    },
    {
      q: "Are my uploaded designs saved or stored?",
      a: "No, absolutely not. AccessContrast is a client-side Single Page Application (SPA). Every pixel is analyzed locally in your device's memory and never leaves your browser. You can safely test confidential, unreleased layouts."
    },
    {
      q: "What do the red and green edges in the heatmap mean?",
      a: "The heatmap applies an edge-detection algorithm to your design. If it detects two adjacent colors with a contrast difference too low for clear visibility (< 3:1), it marks the edge red. Green edges indicate a compliant contrast separation."
    },
    {
      q: "What is relative luminance in color contrast?",
      a: "Relative luminance measures how the human eye perceives the brightness of a color (e.g., green appears much brighter than blue), rather than just calculating mathematical color distance. The WCAG contrast formula uses this to provide a ratio ranging from 1:1 (no contrast) to 21:1 (black on white)."
    },
    {
      q: "Does this tool support WCAG 2.2 requirements?",
      a: "Yes. The mathematical requirements for color contrast and relative luminance remained identical between WCAG 2.1 and WCAG 2.2. Passing the tests in this tool ensures compliance with both versions."
    }
  ]
};