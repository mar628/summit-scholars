import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import SummitLogo from '@/assets/svgs/SummitLogo';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-[#1a3a6b] text-white py-8">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex gap-2 items-center">
            <SummitLogo size={36} />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-white">Summit Scholars Hub</span>
              <span className="text-[10px] text-[#c9a227] italic font-medium">Where Excellence Meets Elevation</span>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-white/60 md:text-left">
          &copy; {new Date().getFullYear()} Summit Scholars Hub. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link to="#" className="text-sm text-white/60 hover:text-[#c9a227] transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="text-sm text-white/60 hover:text-[#c9a227] transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
