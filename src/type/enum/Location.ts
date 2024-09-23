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
  [PlayerLocation.BottomCenter]: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
  [PlayerLocation.BottomLeft]: 'left-[25%] bottom-0 -translate-x-1/2 translate-y-1/2',
  [PlayerLocation.LeftBottom]: 'left-[2.5%] bottom-[25%] -translate-x-1/2 translate-y-1/2',
  [PlayerLocation.LeftCenter]: 'left-[2.5%] top-[25%] -translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.TopLeft]: 'left-[25%] top-0 -translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.TopCenter]: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.TopRight]: 'right-[25%] top-0 translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.RightCenter]: 'right-[2.5%] top-[25%] translate-x-1/2 -translate-y-1/2',
  [PlayerLocation.RightBottom]: 'right-[2.5%] bottom-[25%] translate-x-1/2 translate-y-1/2',
  [PlayerLocation.BottomRight]: 'right-[25%] bottom-0 translate-x-1/2 translate-y-1/2'
}

export const ChipCSSLocation = {
  [PlayerLocation.BottomCenter]: 'bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-96',
  [PlayerLocation.BottomLeft]: 'bottom-0 right-0 transform translate-x-full -translate-y-3/1',
  [PlayerLocation.LeftBottom]: 'left-0 bottom-0 transform translate-x-3/1  -translate-y-3/2',
  [PlayerLocation.LeftCenter]: 'left-0 top-1/2 transform translate-x-3/1 translate-y-2/3',
  [PlayerLocation.TopLeft]: 'top-0 right-0 transform translate-x-full translate-y-3/1',
  [PlayerLocation.TopCenter]: 'top-0 left-1/2 transform -translate-x-1/2 translate-y-3/1',
  [PlayerLocation.TopRight]: 'top-0 left-0 transform -translate-x-full translate-y-3/1',
  [PlayerLocation.RightCenter]: 'right-0 top-1/2 transform -translate-x-3/1 translate-y-2/3',
  [PlayerLocation.RightBottom]: 'right-0 bottom-0 transform -translate-x-3/1 -translate-y-3/2',
  [PlayerLocation.BottomRight]: 'bottom-0 left-0 transform -translate-x-full -translate-y-3/1'
}