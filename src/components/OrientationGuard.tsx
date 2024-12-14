import { Dictionary } from "@/type/Dictionary";
import { DeviceType } from "@/type/General";
import { useEffect, useState } from "react";

interface OrientationGuardProps {
  deviceType: DeviceType;
  children: React.ReactNode;
  dictionary: Dictionary;
}

const OrientationGuard: React.FC<OrientationGuardProps> = ({ children, deviceType, dictionary }) => {
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
          <p>{deviceType === 'mobile' ? dictionary.pleaseRotateToPortraitForBestExperience : dictionary.pleaseRotateToLandscapeForBestExperience}</p>
          {/* You can add an icon or animation here */}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default OrientationGuard;