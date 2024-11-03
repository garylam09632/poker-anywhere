import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [show, setShow] = useState(false);

  if (!content) return <>{children}</>;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="
          absolute -bottom-8 left-1/2 -translate-x-1/2
          px-2 py-1 
          bg-black text-white 
          text-xs rounded 
          whitespace-nowrap
        ">
          {content}
        </div>
      )}
    </div>
  );
};