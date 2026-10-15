import { themeColors } from "@/config/theme";
import { hexToSceneColour } from "@/lib/social-image-scene";
import type { SocialImageScene } from "@/lib/social-image-scene";

/** Size of social images, in pixels: twice what social platforms expect, so they stay sharp on any screen. */
export const socialImageSize = { width: 2400, height: 1260 };

/** Version of how social images are drawn, to raise with any change to the drawing code so stored images are redrawn. */
export const socialImageVersion = 1;

/** Size of the sign, centred on the wall, in the wall's pixels. */
export const socialImageIconSize = 600;

/**
 * How social images are drawn: the page's icon as a matte metal sign on a plaster wall, lit by morning sun through
 * louvred blinds.
 */
export const socialImageScene: SocialImageScene = {
  ...socialImageSize,
  wall: {
    colour: hexToSceneColour(themeColors.light.background),
    textureDepth: 0.1,
    textureCoarseness: 0.3,
    cornerShading: 0.012,
    mottle: 0.004,
    shadowContrast: 0.7,
    highlightContrast: 0.6,
    seed: 11,
  },
  sign: {
    shadedColour: [0.25, 0.25, 0.265],
    litColour: [0.3, 0.3, 0.315],
    grain: 0.04,
    sunResponse: 0.82,
    skyResponse: 1.1,
    sunSheen: 0.32,
    sunSheenFocus: 1.6,
    skySheen: 0.5,
    reflection: 0.015,
    sunEdge: 3,
    skyEdge: 22.5,
    skyEdgeTint: [1.1, 1.015, 0.76],
    shadowOffset: { x: 22, y: 22 },
    shadowSoftness: 6,
    shadowStrength: 0.84,
    contactSoftness: 6,
    contactStrength: 0.1,
    seed: 5,
  },
  sun: {
    corners: [
      { x: -157, y: 76 },
      { x: 2404, y: -376 },
      { x: 2106, y: 2339 },
      { x: 4667, y: 1887 },
    ],
    slats: 8,
    openness: 0.5,
    dividerWidth: -1,
    bandSoftnessNear: 0.07,
    bandSoftnessFar: 0.26,
    outlineSoftnessNear: 0.006,
    outlineSoftnessFar: 0.07,
    fade: 0.2,
    irregularity: 0.6,
    streakiness: 0.18,
    waviness: 0.3,
    seed: 366,
    outsideDarkness: 0.08,
    outsideTexture: 0.55,
    bloom: 0.025,
    softness: 22,
    sharpness: 1.15,
    colour: [1.04, 0.972, 0.84],
  },
  sky: {
    position: { x: 2600, y: -200 },
    radius: 1350,
    strength: 0.24,
    colour: [0.88, 0.93, 1.04],
  },
  room: {
    colour: [0.78, 0.795, 0.835],
    haze: [0.84, 0.85, 0.88],
  },
  dust: {
    count: 800,
    brightness: 2.2,
    seed: 4_153_226_783,
  },
};
