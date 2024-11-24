export enum PlayerLocation {
    BottomCenter,
    BottomLeft,
    LeftBottom,
    LeftCenter,
    TopLeft,
    TopCenter,
    TopRight,
    RightCenter,
    RightBottom,
    BottomRight
}

export const PlayerCSSLocation = {
  [PlayerLocation.BottomCenter]: 'z-[200] left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
  // [PlayerLocation.BottomLeft]: 'left-[22.5%] bottom-5 -translate-x-1/2 translate-y-1/2 md:left-[25%] md:bottom-0 md:-translate-x-1/2 md:translate-y-1/2',
  [PlayerLocation.BottomLeft]: 'left-[25%] bottom-0 -translate-x-1/2 translate-y-1/2',
  [PlayerLocation.LeftBottom]: 'left-[2.5%] bottom-[25%] -translate-x-1/2 translate-y-1/2',
  [PlayerLocation.LeftCenter]: 'z-[200] left-[2.5%] top-[25%] -translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.TopLeft]: 'left-[25%] top-0 -translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.TopCenter]: 'z-[200] left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.TopRight]: 'right-[25%] top-0 translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.RightCenter]: 'right-[2.5%] top-[25%] translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.RightBottom]: 'z-[200] right-[2.5%] bottom-[25%] translate-x-1/2 translate-y-1/2',
  [PlayerLocation.BottomRight]: 'right-[25%] bottom-0 translate-x-1/2 translate-y-1/2'
}

export const PlayerCSSLocationMobile = {
  [PlayerLocation.BottomCenter]: 'left-[30%] bottom-0 -translate-x-1/2 translate-y-1/2', // Bottom Left
  // [PlayerLocation.BottomLeft]: 'left-[22.5%] bottom-5 -translate-x-1/2 translate-y-1/2 md:left-[25%] md:bottom-0 md:-translate-x-1/2 md:translate-y-1/2',
  [PlayerLocation.BottomLeft]: 'left-1 bottom-[20%] -translate-x-1/2 translate-y-1/2', // Left Bottom
  [PlayerLocation.LeftBottom]: 'left-1 bottom-[50%] -translate-x-1/2 translate-y-1/2', // Left Center
  [PlayerLocation.LeftCenter]: 'left-1 top-[20%] -translate-x-1/2 -translate-y-1/2', // Left Top
  [PlayerLocation.TopLeft]: 'left-[30%] top-0 -translate-x-1/2 -translate-y-1/2', // Top Left
  [PlayerLocation.TopCenter]: 'right-[30%] top-0 translate-x-1/2 -translate-y-1/2', // Top Right
  [PlayerLocation.TopRight]: 'right-1 top-[20%] translate-x-1/2 -translate-y-1/2', // Right Top
  [PlayerLocation.RightCenter]: 'right-1 top-[50%] translate-x-1/2 -translate-y-1/2', // Right Center
  [PlayerLocation.RightBottom]: 'right-1 bottom-[20%] translate-x-1/2 translate-y-1/2', // Right Bottom
  [PlayerLocation.BottomRight]: 'right-[30%] bottom-0 translate-x-1/2 translate-y-1/2' // Bottom Right
}

export const ChipCSSLocation = {
  [PlayerLocation.BottomCenter]: 'top-0',
  [PlayerLocation.BottomLeft]: 'top-0 right-1/3',
  [PlayerLocation.LeftBottom]: 'right-4 top-0 md:right-0',
  [PlayerLocation.LeftCenter]: 'right-4 bottom-0 md:right-0',
  [PlayerLocation.TopLeft]: 'bottom-0 right-1/3',
  [PlayerLocation.TopCenter]: 'bottom-0',
  [PlayerLocation.TopRight]: 'bottom-0 left-1/3',
  [PlayerLocation.RightCenter]: 'left-4 bottom-0 md:left-0',
  [PlayerLocation.RightBottom]: 'left-4 top-0 md:left-0',
  [PlayerLocation.BottomRight]: 'top-0 left-1/3'
}

export const ChipCSSLocationMobile = {
  [PlayerLocation.BottomCenter]: 'top-0 left-1/2', // Bottom Left
  [PlayerLocation.BottomLeft]: 'top-6 right-5', // Left Bottom
  [PlayerLocation.LeftBottom]: 'right-4 top-1/3 md:right-0', // Left Center
  [PlayerLocation.LeftCenter]: 'right-4 bottom-0', // Left Top
  [PlayerLocation.TopLeft]: 'bottom-0 left-1/2', // Top Left
  [PlayerLocation.TopCenter]: 'bottom-0 right-1/2', // Top Right
  [PlayerLocation.TopRight]: 'left-4 bottom-0', // Right Top
  [PlayerLocation.RightCenter]: 'left-4 top-1/3 md:right-0', // Right Center
  [PlayerLocation.RightBottom]: 'top-6 left-5', // Right Bottom
  [PlayerLocation.BottomRight]: 'top-0 right-1/2' // Bottom Right
}