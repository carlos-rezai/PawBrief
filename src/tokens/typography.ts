export const typography = {
  family: "'Plus Jakarta Sans', sans-serif",
  scale: {
    display: { size: 40, weight: 800, tracking: -0.8 },
    title: { size: 27, weight: 700, tracking: -0.5 },
    uiHeading: { size: 19, weight: 700, tracking: 0 },
    sectionHd: { size: 17, weight: 700, tracking: -0.3 },
    body: { size: 15, weight: 400, tracking: 0 },
    small: { size: 13.5, weight: 400, tracking: 0 },
    caption: { size: 11, weight: 700, tracking: 0.5, uppercase: true },
  },
  buttonSize: {
    sm: { height: 34, fontSize: 13, padX: 14 },
    md: { height: 40, fontSize: 14.5, padX: 20 },
    lg: { height: 48, fontSize: 16, padX: 26 },
  },
} as const;
