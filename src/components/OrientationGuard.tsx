import { DeviceType } from "@/type/General";
import { useEffect, useState } from "react";

interface OrientationGuardProps {
  deviceType: DeviceType;
  children: React.ReactNode;
}

const OrientationGuard: React.FC<OrientationGuardProps> = ({ children, deviceType }) => {
  const [isWrongOrientation, setIsWrongOrientation] = useState(false);

  useEffect(() => {
    // Initial check
    checkOrientation();

    // Add event listener
    window.addEventListener('orientationchange', checkOrientation);
    // Alternative method for browsers that don't support orientationchange
    window.addEventListener('resize', checkOrientation);

    return () => {
      // Cleanup
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, [deviceType]);

  const checkOrientation = () => {
    console.log("deviceType", deviceType);
    if (deviceType === 'mobile') {
      // window.innerWidth > window.innerHeight means landscape
      setIsWrongOrientation(window.innerWidth > window.innerHeight);
    } else if (deviceType === 'tablet' || deviceType === 'desktop') {
      setIsWrongOrientation(window.innerWidth < window.innerHeight);
    }
  };

  if (isWrongOrientation) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <div className="text-white text-center">
          
          <p>Please rotate your device to { deviceType === 'mobile' ? 'portrait' : 'landscape' } mode</p>
          {/* You can add an icon or animation here */}
        </div>
      </div>
    );
  }

  return <div className="w-full h-full">{children}</div>;
}

export default OrientationGuard;