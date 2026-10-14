import { themeColors } from "@/config/theme";
import { hexToWallColour } from "@/lib/wall-sign";
import type { WallSignSettings } from "@/lib/wall-sign";

/** Size of social images, in pixels: twice what social platforms expect, so they stay sharp on any screen. */
export const socialImageSize = { width: 2400, height: 1260 };

/** Version of how social images are drawn, to raise with any change to the drawing code so stored images are redrawn. */
export const socialImageVersion = 1;

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
    sheen: 0.32,
    sheenFocus: 1.6,
    lampSheen: 0.5,
    reflection: 0.015,
    rim: 3,
    glint: 22.5,
    glintColour: [1.1, 1.015, 0.76],
    shadowOffset: { x: 22, y: 22 },
    shadowSoftness: 6,
    shadowStrength: 0.84,
    contactSoftness: 6,
    contactStrength: 0.1,
    seed: 5,
  },
  light: {
    corners: [
      { x: -157, y: 76 },
      { x: 2404, y: -376 },
      { x: 2106, y: 2339 },
      { x: 4667, y: 1887 },
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
    softness: 22,
    falloff: 1.15,
    colour: [1.04, 0.972, 0.84],
    room: [0.78, 0.795, 0.835],
    haze: [0.84, 0.85, 0.88],
  },
  lamp: {
    position: { x: 2600, y: -200 },
    radius: 1350,
    strength: 0.24,
    colour: [0.88, 0.93, 1.04],
  },
  dust: {
    count: 800,
    strength: 2.2,
    seed: 4_153_226_783,
  },
};

/** Size of the sign, centred on the wall, in the wall's pixels. */
export const socialImageIconSize = 600;
