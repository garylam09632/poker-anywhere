import { ChipCSSLocation, PlayerCSSLocation, PlayerCSSLocationMobile, PlayerLocation } from "@/type/enum/Location";
import { ChipCSSLocationMobile } from "@/type/enum/Location";
import { useMediaQuery } from "./useMediaQuery";
import { mobile } from "@/constants/MediaQuery";

export const useLocation = () => {
  const isMobile = useMediaQuery(mobile);

  const chipLocation = isMobile ? ChipCSSLocationMobile : ChipCSSLocation;
  const playerLocation = isMobile ? PlayerCSSLocationMobile : PlayerCSSLocation;
  const containerStyle = (location: PlayerLocation) => isMobile ? getMobileContainerStyle(location) : getContainerStyle(location);

  const getContainerStyle = (position: PlayerLocation) => {
    switch (position) {
      case PlayerLocation.BottomCenter:
        return "w-1 h-64";
      case PlayerLocation.BottomLeft:
        return "w-64 h-64";
      case PlayerLocation.LeftCenter:
        return "w-64 h-36";
      case PlayerLocation.LeftBottom:
        return "w-64 h-36";
      case PlayerLocation.TopLeft:
        return "w-64 h-64";
      case PlayerLocation.TopCenter:
        return "w-1 h-64";
      case PlayerLocation.TopRight:
        return "w-48 h-64";
      case PlayerLocation.RightCenter:
        return "w-64 h-36";
      case PlayerLocation.RightBottom:
        return "w-64 h-36";
      case PlayerLocation.BottomRight:
        return "w-64 h-64";
      default:
        return "w-0";
    }
  }

  const getMobileContainerStyle = (position: PlayerLocation) => {
    switch (position) {
      case PlayerLocation.BottomCenter: // Bottom Left
        return "w-1 h-64";
      case PlayerLocation.BottomLeft: // Left Bottom
        return "w-64 h-64";
      case PlayerLocation.LeftCenter: // Left Center
        return "w-64 h-36";
      case PlayerLocation.LeftBottom: // Left Top
        return "w-64 h-36";
      case PlayerLocation.TopLeft: // Top Left
        return "w-1 h-64";
      case PlayerLocation.TopCenter: // Top Right
        return "w-1 h-64";
      case PlayerLocation.TopRight: // Right Top
        return "w-64 h-36";
      case PlayerLocation.RightCenter: // Right Center
        return "w-64 h-36";
      case PlayerLocation.RightBottom: // Right Bottom
        return "w-64 h-64";
      case PlayerLocation.BottomRight: // Bottom Right
        return "w-1 h-64";
      default:
        return "w-0";
    }
  }

  return {
    isMobile,
    chipLocation,
    playerLocation,
    containerStyle
  }
}