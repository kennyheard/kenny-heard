import { themeColors } from "@/config/theme";
import { hexToWallColour } from "@/lib/wall-sign";
import type { WallSignSettings } from "@/lib/wall-sign";

/** Size social platforms expect, in pixels. */
export const socialImageSize = { width: 1200, height: 630 };

/**
 * How social images are drawn: the page's icon as a matte metal sign on a plaster wall, lit by morning sun through
 * louvred shutters in the ceiling.
 */
export const socialImageScene: WallSignSettings = {
  ...socialImageSize,
  wall: {
    colour: hexToWallColour(themeColors.light.background),
    toothDepth: 0.1,
    toothMid: 0.3,
    falloff: 0.012,
    mottle: 0.004,
    seed: 11,
  },
  sign: {
    shade: [0.25, 0.25, 0.265],
    highlight: [0.3, 0.3, 0.315],
    grain: 0.04,
    sunResponse: 0.82,
    lampResponse: 1.1,
    sheen: 0.2,
    sheenFocus: 1.6,
    lampSheen: 0.5,
    reflection: 0.015,
    rim: 3,
    shadowOffset: { x: 11, y: 11 },
    shadowSoftness: 3,
    shadowStrength: 0.84,
    contactSoftness: 3,
    contactStrength: 0.1,
    seed: 5,
  },
  light: {
    corners: [
      { x: -78.5, y: 38 },
      { x: 1202, y: -188 },
      { x: 1053, y: 1169.5 },
      { x: 2333.5, y: 943.5 },
    ],
    louvres: 8,
    open: 0.5,
    stile: -1,
    edgeNear: 0.07,
    edgeFar: 0.26,
    frameNear: 0.006,
    frameFar: 0.07,
    fade: 0.2,
    vary: 0.6,
    streak: 0.18,
    wave: 0.3,
    seed: 366,
    shade: 0.08,
    ambient: 0.55,
    bloom: 0.025,
    darkGain: 0.7,
    lightGain: 0.6,
    softness: 11,
    falloff: 1.15,
    colour: [1.03, 0.975, 0.87],
    room: [0.78, 0.795, 0.835],
    haze: [0.84, 0.85, 0.88],
  },
  lamp: {
    position: { x: 1300, y: -100 },
    radius: 675,
    strength: 0.24,
    colour: [0.88, 0.93, 1.04],
  },
  dust: {
    count: 1600,
    strength: 2.2,
    seed: 4_153_226_783,
  },
};

/** Size of the sign, centred on the wall, in the wall's pixels. */
export const socialImageIconSize = 300;
