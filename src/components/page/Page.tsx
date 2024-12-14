'use client';

import OrientationGuard from "../OrientationGuard";
import { DeviceType } from "@/type/General";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { Dictionary } from "@/type/Dictionary";

interface PageProps {
  children: React.ReactNode,
  className?: string,
  dictionary: Dictionary
}

const Page: React.FC<PageProps> = ({ 
  children,
  className = "",
  dictionary
}) => {
  const [isProviderMounted, setIsProviderMounted] = useState(false);

  useEffect(() => {
    // Simulate minimum loading time for better UX
    const timer = setTimeout(() => {
      setIsProviderMounted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Loading State */}
      {!isProviderMounted && <LoadingSpinner />}

      {/* Main Content */}
      <div className={`
        w-full h-full 
        transition-all duration-500 
        ${isProviderMounted 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
        }
      `}>
        <OrientationGuard deviceType={document?.documentElement.dataset.device as DeviceType} dictionary={dictionary}>
          {children}
        </OrientationGuard>
      </div>
    </div>
  );
};

export default Page;