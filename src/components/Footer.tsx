import React from "react";

const Footer: React.FC = () => (
  <footer className="mt-auto py-6 text-center text-text bg-background border-t border-accent" style={{backgroundColor: '#F9F8F4', color: '#333333', borderColor: '#D9D4CC'}}>
    <div className="mb-2">
      <a href="/mockup-landing-page.png" target="_blank" rel="noopener" className="underline text-primary hover:text-success" style={{color: '#7BAE7F'}}>
        View Landing Page Mockup
      </a>
    </div>
    <span>&copy; {new Date().getFullYear()} <span className='font-semibold' style={{color: '#7BAE7F'}}>Neighborly</span>. All rights reserved.</span>
  </footer>
);

export default Footer;
