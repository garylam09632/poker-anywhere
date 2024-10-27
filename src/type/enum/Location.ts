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