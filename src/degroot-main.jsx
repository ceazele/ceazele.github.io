import React from 'react';
import { createRoot } from 'react-dom/client';
import RationalDeGrootSimulation from '../degroot-simulation.jsx';
import './degroot.css';

// Dark mode color overrides — applied as inline styles so they beat all CSS rules.
// al-folio sets data-theme="dark" on <html> when dark mode is active.
const DARK_COLORS = {
  '--color-white':     '#252526',
  '--color-slate-50':  '#1c1c1d',
  '--color-slate-100': '#252526',
  '--color-slate-200': '#333334',
  '--color-slate-300': '#484849',
  '--color-slate-400': '#6b6b6c',
  '--color-slate-500': '#909091',
  '--color-slate-600': '#b4b4b5',
  '--color-slate-700': '#d0d0d1',
  '--color-slate-800': '#e8e8e9',
  '--color-slate-900': '#f4f4f5',
};

const el = document.getElementById('degroot-root');

function applyTheme() {
  if (!el) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    Object.entries(DARK_COLORS).forEach(([k, v]) => el.style.setProperty(k, v));
  } else {
    Object.keys(DARK_COLORS).forEach(k => el.style.removeProperty(k));
  }
}

if (el) {
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  createRoot(el).render(<RationalDeGrootSimulation />);
}
