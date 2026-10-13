import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Automatically rewrite root-relative /images/ paths when hosted under /dada/ (e.g. GitHub Pages)
if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dada')) {
  const fixImagePaths = () => {
    document.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('/images/')) {
        img.setAttribute('src', `/dada${src}`);
      }
    });
  };
  const observer = new MutationObserver(fixImagePaths);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src'],
  });
  window.addEventListener('DOMContentLoaded', fixImagePaths);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
