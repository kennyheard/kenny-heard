/** Point on the wall, in pixels from its top-left corner. */
export interface WallPoint {
  /** Distance from the left edge. */
  x: number;
  /** Distance from the top edge. */
  y: number;
}

/** Colour with each channel from 0 to 1. */
export type WallColour = [red: number, green: number, blue: number];

/** How a wall sign is drawn: the plaster wall, the metal sign standing off it, the light in the room, and its dust. */
export interface WallSignSettings {
  /** Width of the wall, in pixels. */
  width: number;
  /** Height of the wall, in pixels. */
  height: number;
  /** Plaster the sign is fixed to. */
  wall: {
    /** Colour of the plaster in plain room light. */
    colour: WallColour;
    /** Height of the plaster's fine texture. */
    toothDepth: number;
    /** Share of the texture taken from its coarser grain. */
    toothMid: number;
    /** How much darker the wall falls towards its bottom-right corner. */
    falloff: number;
    /** Strength of the wall's broad, uneven shading. */
    mottle: number;
    /** Seed that fixes the texture, so every image shares the same wall. */
    seed: number;
  };
  /** Matte metal sign in the shape of the icon. */
  sign: {
    /** Colour of the metal in shade. */
    shade: WallColour;
    /** Colour of the metal in full sunlight. */
    highlight: WallColour;
    /** Strength of the metal's fine, blasted grain. */
    grain: number;
    /** How much of the sunlight the metal takes on. */
    sunResponse: number;
    /** How much of the lamp's light the metal takes on. */
    lampResponse: number;
    /** Strength of the soft sheen where sunlight crosses the metal. */
    sheen: number;
    /** How tightly the sheen gathers into the brightest light. */
    sheenFocus: number;
    /** Strength of the sheen where the lamp's light falls on the metal. */
    lampSheen: number;
    /** Strength of the light reflected from the wall around it. */
    reflection: number;
    /** Strength of the highlight along the edges facing the window. */
    rim: number;
    /** Offset of the sign's shadow from the sign, in pixels. */
    shadowOffset: WallPoint;
    /** Blur radius of the sign's shadow, in pixels. */
    shadowSoftness: number;
    /** How much sunlight the sign's shadow blocks. */
    shadowStrength: number;
    /** Blur radius of the darkening where the sign meets the wall, in pixels. */
    contactSoftness: number;
    /** Strength of the darkening where the sign meets the wall. */
    contactStrength: number;
    /** Seed that fixes the metal's grain and edges. */
    seed: number;
  };
  /** Sunlight falling through louvred shutters onto the wall. */
  light: {
    /** Corners of the patch of light: nearest left, nearest right, furthest left, furthest right. */
    corners: [WallPoint, WallPoint, WallPoint, WallPoint];
    /** Number of louvres in the shutters. */
    louvres: number;
    /** Share of each louvre's spacing that lets light through. */
    open: number;
    /** Width of each upright stile's shadow, as a share of the patch, or below zero for none. */
    stile: number;
    /** Softness of the light's edges nearest the window. */
    edgeNear: number;
    /** Softness of the light's edges furthest from the window. */
    edgeFar: number;
    /** Softness of the patch's outline nearest the window. */
    frameNear: number;
    /** Softness of the patch's outline furthest from the window. */
    frameFar: number;
    /** How much the light weakens by the far end of the patch. */
    fade: number;
    /** How unevenly the louvres are spaced and lit. */
    vary: number;
    /** Strength of the brighter and fainter stretches along each band. */
    streak: number;
    /** How much the bands waver. */
    wave: number;
    /** Seed that fixes the light's unevenness. */
    seed: number;
    /** How much darker the wall is outside the light. */
    shade: number;
    /** Share of the wall's texture that still shows outside the light. */
    ambient: number;
    /** Strength of the glow spilling around the light. */
    bloom: number;
    /** Strength of the wall's shadows. */
    darkGain: number;
    /** Strength of the wall's highlights. */
    lightGain: number;
    /** Blur radius of the light as it falls on the sign and its shadow, in pixels. */
    softness: number;
    /** How sharply the light falls away from its brightest parts. */
    falloff: number;
    /** Colour of the sunlight. */
    colour: WallColour;
    /** Colour of the room's light outside the sun. */
    room: WallColour;
    /** Colour of the faint haze in the air between the wall and the viewer. */
    haze: WallColour;
  };
  /** Soft light from the far corner of the room. */
  lamp: {
    /** Position of the light's centre, in pixels, which may lie off the wall. */
    position: WallPoint;
    /** Distance over which the light fades, in pixels. */
    radius: number;
    /** Strength of the light. */
    strength: number;
    /** Colour of the light. */
    colour: WallColour;
  };
  /** Dust in the air, lit only where the sunlight passes. */
  dust: {
    /** Number of motes. */
    count: number;
    /** Brightness of the motes. */
    strength: number;
    /** Seed that fixes where the motes drift. */
    seed: number;
  };
}

/** Direction the wall's texture is lit from: above, and from the top left. */
const lightDirection = normalise({ x: -0.55, y: -0.75, z: 0.6 });

/** Warmth of the haze lit by the sun in the air. */
const airGlowColour: WallColour = [1, 0.96, 0.85];

/**
 * Converts a hex colour to channels from 0 to 1.
 *
 * @param hex - The colour, as `#rrggbb`.
 * @returns The colour's red, green, and blue channels.
 */
export function hexToWallColour(hex: string): WallColour {
  return [
    Number.parseInt(hex.slice(1, 3), 16) / 255,
    Number.parseInt(hex.slice(3, 5), 16) / 255,
    Number.parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

/**
 * Scales a vector to a length of one.
 *
 * @param vector - The vector to scale.
 * @returns The vector at a length of one.
 */
function normalise({ x, y, z }: { x: number; y: number; z: number }) {
  const length = Math.hypot(x, y, z);

  return { x: x / length, y: y / length, z: z / length };
}

/**
 * Limits a value to the range from 0 to 1.
 *
 * @param value - The value to limit.
 * @returns The value, raised to 0 or lowered to 1 when it falls outside.
 */
function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Creates a generator of repeatable random numbers.
 *
 * @param seed - Seed that fixes the sequence.
 * @returns A function that returns the next number, from 0 up to 1.
 */
function createRandom(seed: number) {
  let state = Math.abs(Math.trunc(seed)) % 4_294_967_296;

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;

    return state / 4_294_967_296;
  };
}

/**
 * Creates a field of random values.
 *
 * @param count - Number of values.
 * @param random - Generator of the values.
 * @returns A field of values from -1 up to 1.
 */
function createNoise(count: number, random: () => number) {
  return Float32Array.from({ length: count }, () => random() * 2 - 1);
}

/**
 * Eases a value between two edges, following the curve of a smooth step.
 *
 * @param from - Value at which the result starts to rise from 0.
 * @param to - Value at which the result reaches 1.
 * @param value - The value to ease.
 * @returns A number from 0 to 1.
 */
function smoothstep(from: number, to: number, value: number) {
  const t = clamp((value - from) / (to - from));

  return t * t * (3 - 2 * t);
}

/**
 * Blurs a field with a box.
 *
 * @param input - The field to blur.
 * @param width - Width of the field.
 * @param height - Height of the field.
 * @param radiusAcross - Radius of the box across, in pixels.
 * @param radiusDown - Radius of the box down, in pixels.
 * @returns The blurred field.
 */
function boxBlur(input: Float32Array, width: number, height: number, radiusAcross: number, radiusDown = radiusAcross) {
  const across = new Float32Array(input.length);
  const output = new Float32Array(input.length);

  if (radiusAcross > 0) {
    const size = radiusAcross * 2 + 1;

    for (let y = 0; y < height; y += 1) {
      const row = y * width;
      let sum = 0;

      for (let x = -radiusAcross; x <= radiusAcross; x += 1) {
        sum += input[row + Math.min(Math.max(x, 0), width - 1)] ?? 0;
      }

      for (let x = 0; x < width; x += 1) {
        across[row + x] = sum / size;
        sum +=
          (input[row + Math.min(x + radiusAcross + 1, width - 1)] ?? 0) -
          (input[row + Math.max(x - radiusAcross, 0)] ?? 0);
      }
    }
  } else {
    across.set(input);
  }

  if (radiusDown > 0) {
    const size = radiusDown * 2 + 1;

    for (let x = 0; x < width; x += 1) {
      let sum = 0;

      for (let y = -radiusDown; y <= radiusDown; y += 1) {
        sum += across[Math.min(Math.max(y, 0), height - 1) * width + x] ?? 0;
      }

      for (let y = 0; y < height; y += 1) {
        output[y * width + x] = sum / size;
        sum +=
          (across[Math.min(y + radiusDown + 1, height - 1) * width + x] ?? 0) -
          (across[Math.max(y - radiusDown, 0) * width + x] ?? 0);
      }
    }
  } else {
    output.set(across);
  }

  return output;
}

/**
 * Blurs a field softly.
 *
 * @param input - The field to blur.
 * @param width - Width of the field.
 * @param height - Height of the field.
 * @param radius - Radius of each box, in pixels.
 * @returns The blurred field.
 */
function softBlur(input: Float32Array, width: number, height: number, radius: number) {
  return boxBlur(boxBlur(boxBlur(input, width, height, radius), width, height, radius), width, height, radius);
}

/**
 * Blurs a field to a close match of a Gaussian blur.
 *
 * @param input - The field to blur.
 * @param width - Width of the field.
 * @param height - Height of the field.
 * @param radius - Radius of the blur, in pixels.
 * @returns The blurred field.
 */
function gaussianBlur(input: Float32Array, width: number, height: number, radius: number) {
  return softBlur(input, width, height, Math.max(1, Math.round(radius / 1.7)));
}

/**
 * Creates smooth noise from random values on a grid.
 *
 * @param width - Width of the field.
 * @param height - Height of the field.
 * @param cell - Spacing of the grid, in pixels.
 * @param random - Generator of the grid's values.
 * @returns A field of values from -1 to 1.
 */
function valueNoise(width: number, height: number, cell: number, random: () => number) {
  const columns = Math.floor(width / cell) + 2;
  const rows = Math.floor(height / cell) + 2;
  const grid = createNoise(columns * rows, random);
  const field = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    const gridY = y / cell;
    const top = Math.floor(gridY);
    const easeY = smoothstep(0, 1, gridY - top);

    for (let x = 0; x < width; x += 1) {
      const gridX = x / cell;
      const left = Math.floor(gridX);
      const easeX = smoothstep(0, 1, gridX - left);
      const topLeft = grid[top * columns + left] ?? 0;
      const topRight = grid[top * columns + left + 1] ?? 0;
      const bottomLeft = grid[(top + 1) * columns + left] ?? 0;
      const bottomRight = grid[(top + 1) * columns + left + 1] ?? 0;
      field[y * width + x] =
        (topLeft + (topRight - topLeft) * easeX) * (1 - easeY) +
        (bottomLeft + (bottomRight - bottomLeft) * easeX) * easeY;
    }
  }

  return field;
}

/**
 * Moves a field across the wall, leaving empty space where it moved from.
 *
 * @param input - The field to move.
 * @param width - Width of the field.
 * @param height - Height of the field.
 * @param offset - Distance to move it, in pixels.
 * @returns The moved field.
 */
function offsetField(input: Float32Array, width: number, height: number, offset: WallPoint) {
  const output = new Float32Array(input.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.round(x - offset.x);
      const sourceY = Math.round(y - offset.y);

      if (sourceX >= 0 && sourceY >= 0 && sourceX < width && sourceY < height) {
        output[y * width + x] = input[sourceY * width + sourceX] ?? 0;
      }
    }
  }

  return output;
}

/**
 * Finds the transform that maps a point on the wall back onto the window, from the patch of light's four corners.
 *
 * @param corners - Corners of the patch of light.
 * @returns The transform's nine values, read row by row.
 */
function windowTransform(corners: WallSignSettings["light"]["corners"]) {
  const [first, second, third, fourth] = corners;
  const dx1 = second.x - fourth.x;
  const dx2 = third.x - fourth.x;
  const dx3 = first.x - second.x + fourth.x - third.x;
  const dy1 = second.y - fourth.y;
  const dy2 = third.y - fourth.y;
  const dy3 = first.y - second.y + fourth.y - third.y;
  const denominator = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / denominator;
  const h = (dx1 * dy3 - dx3 * dy1) / denominator;
  const a = second.x - first.x + g * second.x;
  const b = third.x - first.x + h * third.x;
  const c = first.x;
  const d = second.y - first.y + g * second.y;
  const e = third.y - first.y + h * third.y;
  const f = first.y;
  const cofactorA = e - f * h;
  const cofactorB = -(d - f * g);
  const cofactorC = d * h - e * g;
  const determinant = a * cofactorA + b * cofactorB + c * cofactorC;

  return {
    m0: cofactorA / determinant,
    m1: -(b - c * h) / determinant,
    m2: (b * f - c * e) / determinant,
    m3: cofactorB / determinant,
    m4: (a - c * g) / determinant,
    m5: -(a * f - c * d) / determinant,
    m6: cofactorC / determinant,
    m7: -(a * h - b * g) / determinant,
    m8: (a * e - b * d) / determinant,
  };
}

/**
 * Draws the sunlight falling through the shutters onto the wall.
 *
 * @param settings - How the light falls.
 * @param width - Width of the wall.
 * @param height - Height of the wall.
 * @returns The light at each pixel, from 0 to 1.
 */
function drawSunlight(settings: WallSignSettings["light"], width: number, height: number) {
  const random = createRandom(settings.seed);
  const wobble = valueNoise(width, height, 130, random);
  const streak = gaussianBlur(valueNoise(width, height, 110, random), width, height, 20);
  const edgeNoise = valueNoise(width, height, 45, random);
  const { vary } = settings;
  const bands: { start: number; width: number; strength: number }[] = [];
  let position = 0;

  for (let index = 0; index < settings.louvres + 2; index += 1) {
    bands.push({
      start: position,
      width: settings.open * (1 + (random() * 2 - 1) * 0.3 * vary),
      strength: 1 - random() * 0.3 * vary,
    });
    position += 1 + (random() * 2 - 1) * 0.35 * vary;
  }

  const { m0, m1, m2, m3, m4, m5, m6, m7, m8 } = windowTransform(settings.corners);
  const centre = { x: 0, y: 0 };

  for (const corner of settings.corners) {
    centre.x += corner.x / 4;
    centre.y += corner.y / 4;
  }

  const facing = m6 * centre.x + m7 * centre.y + m8 >= 0;
  const sun = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const w = m6 * x + m7 * y + m8;
      const u = (m0 * x + m1 * y + m2) / w;
      const v = (m3 * x + m4 * y + m5) / w;

      if (
        w >= 0 !== facing ||
        w === 0 ||
        !Number.isFinite(u) ||
        !Number.isFinite(v) ||
        Math.abs(u) > 1000 ||
        Math.abs(v) > 1000
      ) {
        continue;
      }

      const travel = clamp(v);
      const frame = settings.frameNear + (settings.frameFar - settings.frameNear) * travel;
      const inside =
        smoothstep(-frame, frame, u) *
        (1 - smoothstep(1 - frame, 1 + frame, u)) *
        smoothstep(-frame, frame, v) *
        (1 - smoothstep(1 - frame, 1 + frame, v));
      const bentV =
        v +
        (wobble[index] ?? 0) * 0.018 * vary * settings.wave +
        Math.sin(u * 4.2 + 1.3) * 0.006 * vary * settings.wave;
      const edge =
        (settings.edgeNear + (settings.edgeFar - settings.edgeNear) * travel) *
        (1 + (edgeNoise[index] ?? 0) * 0.6 * vary);
      const soften = frame * 1.5 + 0.01;
      const stile = settings.stile * (1 + travel * 0.6) * 1.4;
      const phase = bentV * settings.louvres;
      let band = 0;

      for (const { start, width: open, strength } of bands) {
        const offset = phase - start;
        if (offset < -1 || offset > 2) continue;
        band = Math.max(
          band,
          smoothstep(-edge, edge, offset) * (1 - smoothstep(open - edge, open + edge, offset)) * strength,
        );
      }

      const stiles =
        smoothstep(-soften, soften, Math.abs(u - 1 / 3) - stile) *
        smoothstep(-soften, soften, Math.abs(u - 2 / 3) - stile);
      const along = 1 - Math.max(0, streak[index] ?? 0) * settings.streak * vary;
      sun[index] = inside * band * stiles * along * (1 - settings.fade * travel);
    }
  }

  return sun;
}

/**
 * Lightens or darkens one channel of the wall's colour.
 *
 * @param channel - The channel's value in plain room light, from 0 to 1.
 * @param change - How much lighter the wall is, or below zero for how much darker.
 * @param light - How the light falls.
 * @returns The channel's new value, from 0 to 1.
 */
function shadeChannel(channel: number, change: number, light: WallSignSettings["light"]) {
  return change < 0
    ? channel * (1 - Math.min(1, -change * light.darkGain))
    : channel + (1 - channel) * Math.min(1, change * light.lightGain);
}

/**
 * Works out how the sunlight lightens and darkens the plaster wall, both with its texture and as a smooth surface.
 *
 * @param settings - How the wall sign is drawn.
 * @returns How much lighter or darker the textured wall is at each pixel, and the smooth wall.
 */
function drawWall(settings: WallSignSettings) {
  const { width, height, wall, light } = settings;
  const count = width * height;
  const random = createRandom(wall.seed);
  const fine = boxBlur(createNoise(count, random), width, height, 1);
  const grain = valueNoise(width, height, 3.5, random);
  const mottle = valueNoise(width, height, 80, random);
  const surface = Float32Array.from(
    fine,
    (value, index) => (value + (grain[index] ?? 0) * wall.toothMid) * wall.toothDepth,
  );
  const sun = drawSunlight(light, width, height);
  const glow = gaussianBlur(sun, width, height, 40);
  const textured = new Float32Array(count);
  const smooth = new Float32Array(count);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const left = x > 0 ? index - 1 : index;
      const right = x < width - 1 ? index + 1 : index;
      const above = y > 0 ? index - width : index;
      const below = y < height - 1 ? index + width : index;
      const slopeX = ((surface[right] ?? 0) - (surface[left] ?? 0)) * 0.5;
      const slopeY = ((surface[below] ?? 0) - (surface[above] ?? 0)) * 0.5;
      const facing =
        (-slopeX * lightDirection.x - slopeY * lightDirection.y + lightDirection.z) /
        Math.sqrt(slopeX * slopeX + slopeY * slopeY + 1);
      const lit = sun[index] ?? 0;
      const relief =
        (facing - lightDirection.z) * (light.ambient + (1 - light.ambient) * lit) + (mottle[index] ?? 0) * wall.mottle;
      const across = (x / width) * 0.6 + (y / height) * 0.4;
      const base =
        -(across - 0.5) * wall.falloff * 2 - (1 - lit) * light.shade + (glow[index] ?? 0) * light.bloom * (1 - lit);
      textured[index] = base + relief;
      smooth[index] = base;
    }
  }

  return { textured, smooth };
}

/**
 * Scatters motes of dust through the air, mostly tiny and faint, drifting in loose clusters that gather in the light.
 *
 * @param settings - How the dust is drawn.
 * @param light - Sunlight in and around the bands, at each pixel of the wall, from 0 to 1.
 * @param width - Width of the wall.
 * @param height - Height of the wall.
 * @returns The brightness the dust adds at each pixel, before the light that reaches it.
 */
function drawDust(settings: WallSignSettings["dust"], light: Float32Array, width: number, height: number) {
  const count = width * height;
  const random = createRandom(settings.seed);
  const clusters = softBlur(createNoise(count, random), width, height, 40);
  const motes = new Float32Array(count);
  let densest = 0;

  for (let index = 0; index < count; index += 97) densest = Math.max(densest, clusters[index] ?? 0);

  for (let placed = 0, tries = 0; placed < settings.count && tries < settings.count * 40; tries += 1) {
    const x = random() * width;
    const y = random() * height;
    const index = Math.floor(y) * width + Math.floor(x);
    const density = Math.max(0, (clusters[index] ?? 0) / (densest || 1)) * 1.4 + 0.08;
    if (random() > density * (0.1 + 0.9 * (light[index] ?? 0))) continue;
    placed += 1;

    const brightness = random();
    const isBlurred = random() < 0.035;
    const radius = isBlurred ? 4.5 + random() * 6 : 0.275 + random() ** 3 * 0.55;
    const strength = isBlurred ? 0.005 + random() * 0.008 : 0.07 + brightness ** 5 * 1.3;
    const reach = Math.ceil(radius + 1);

    for (let offsetY = -reach; offsetY <= reach; offsetY += 1) {
      for (let offsetX = -reach; offsetX <= reach; offsetX += 1) {
        const pixelX = Math.floor(x) + offsetX;
        const pixelY = Math.floor(y) + offsetY;
        if (pixelX < 0 || pixelY < 0 || pixelX >= width || pixelY >= height) continue;

        const distance = Math.hypot(pixelX + 0.5 - x, pixelY + 0.5 - y) / radius;
        if (isBlurred && distance > 1.05) continue;

        const value = isBlurred
          ? strength * (0.8 + 0.35 * Math.min(1, distance) ** 4) * Math.min(1, (1.05 - distance) * 8)
          : strength * Math.exp(-distance * distance * 1.6);
        motes[pixelY * width + pixelX] = (motes[pixelY * width + pixelX] ?? 0) + value;
      }
    }
  }

  return motes;
}

/**
 * Draws a matte metal sign in the shape of an icon, fixed a little off a plaster wall in sunlight through shutters.
 *
 * @param mask - Coverage of the icon at each pixel of the wall, from 0 to 1.
 * @param settings - How the wall sign is drawn.
 * @returns The wall's pixels, three bytes each for red, green, and blue.
 */
export function drawWallSign(mask: Float32Array, settings: WallSignSettings) {
  const { width, height, wall, sign, light, lamp, dust } = settings;
  const count = width * height;
  const random = createRandom(sign.seed);

  const { textured, smooth } = drawWall(settings);
  const smoothBrightness = Float32Array.from(
    smooth,
    (change) => wall.colour.reduce((sum, channel) => sum + shadeChannel(channel, change, light), 0) / 3,
  );
  let darkest = 1;
  let brightest = 0;

  for (const value of smoothBrightness) {
    darkest = Math.min(darkest, value);
    brightest = Math.max(brightest, value);
  }

  const sunlight = softBlur(
    Float32Array.from(smoothBrightness, (value) => (value - darkest) / (brightest - darkest || 1)),
    width,
    height,
    light.softness,
  ).map((value) => clamp(value));

  const edgeNoise = boxBlur(createNoise(count, random), width, height, 1);
  const shape = Float32Array.from(mask, (value, index) =>
    clamp((value - 0.5 + (edgeNoise[index] ?? 0) * 0.03) * 3 + 0.5),
  );
  const bleed = softBlur(shape, width, height, 1);
  const cover = Float32Array.from(bleed, (value, index) =>
    clamp((value - 0.42 + (edgeNoise[index] ?? 0) * 0.025) / 0.25),
  );
  const rounded = softBlur(shape, width, height, 2);
  const shadow = softBlur(offsetField(shape, width, height, sign.shadowOffset), width, height, sign.shadowSoftness);
  const contact = softBlur(shape, width, height, sign.contactSoftness);
  const grain = createNoise(count, random);

  const reflected = new Float32Array(count);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.min(width - 1, Math.max(0, x + 70));
      const sourceY = Math.min(height - 1, Math.max(0, y - 45));
      reflected[y * width + x] = sunlight[sourceY * width + sourceX] ?? 0;
    }
  }

  const reflection = softBlur(reflected, width, height, 5);

  const shaft = new Float32Array(count);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;

      for (let step = 0; step < 14; step += 1) {
        const sourceX = x - step * 11;
        const sourceY = y - step * 15;
        if (sourceX < 0 || sourceY < 0) break;
        sum += (sunlight[sourceY * width + sourceX] ?? 0) ** 2 * (1 - step / 14);
      }

      shaft[y * width + x] = sum / 7;
    }
  }

  const airGlow = softBlur(shaft, width, height, 12);
  let strongestGlow = 0;

  for (const value of airGlow) strongestGlow = Math.max(strongestGlow, value);

  const roomGlow = softBlur(softBlur(sunlight, width, height, 30), width, height, 30);
  const nearLight = softBlur(sunlight, width, height, 7);
  const motes = drawDust(dust, nearLight, width, height);
  const pixels = new Uint8Array(count * 3);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const coverage = cover[index] ?? 0;
      const sun = sunlight[index] ?? 0;
      const sunReach = sun ** light.falloff * (1 - (shadow[index] ?? 0) * sign.shadowStrength * (1 - coverage));
      const occlusion = 1 - (contact[index] ?? 0) * sign.contactStrength * (1 - coverage);
      const lampDistance = Math.hypot(x - lamp.position.x, y - lamp.position.y);
      const lampReach = Math.exp(-((lampDistance / lamp.radius) ** 2));
      const lampGlint = Math.exp(-((lampDistance / (lamp.radius * 1.6)) ** 2));
      const inner = index > width && index < count - width;
      const slopeX = inner ? ((rounded[index + 1] ?? 0) - (rounded[index - 1] ?? 0)) * 0.25 : 0;
      const slopeY = inner ? ((rounded[index + width] ?? 0) - (rounded[index - width] ?? 0)) * 0.25 : 0;
      const towardsLamp = Math.max(
        0,
        -(slopeX * (lamp.position.x - x) + slopeY * (lamp.position.y - y)) / (lampDistance || 1),
      );
      const towardsWindow = Math.max(0, (slopeX + slopeY) * Math.SQRT1_2);
      const beam =
        Math.min(1, 0.75 * (nearLight[index] ?? 0) + (0.25 * (airGlow[index] ?? 0)) / (strongestGlow || 1)) ** 2;
      const distanceToWindow = Math.min(1, Math.hypot(x / width, y / height) / 1.25);
      const veil = 0.012 + (1 - distanceToWindow) * 0.03 + (roomGlow[index] ?? 0) * 0.025;

      for (let channel = 0; channel < 3; channel += 1) {
        const plaster = shadeChannel(wall.colour[channel] ?? 0, textured[index] ?? 0, light);
        const lift =
          Math.min(1.06, plaster / (shadeChannel(wall.colour[channel] ?? 0, smooth[index] ?? 0, light) || 1)) ** 0.45;
        const sunColour = light.colour[channel] ?? 0;
        const roomColour = light.room[channel] ?? 0;
        const lampLight = lampReach * lamp.strength * (lamp.colour[channel] ?? 0);
        const tint =
          (sign.shade[channel] ?? 0) +
          ((sign.highlight[channel] ?? 0) - (sign.shade[channel] ?? 0)) * Math.min(1, sun * 1.2);
        const metal =
          tint *
            (0.95 +
              sun * 0.22 +
              (grain[index] ?? 0) * sign.grain * (0.5 + sun) +
              ((reflection[index] ?? 0) - 0.4) * sign.reflection) *
            lift +
          sun ** 2.5 * 0.1;
        const wallLight = roomColour * occlusion + (sunColour - roomColour) * sunReach + lampLight;
        const metalLight =
          roomColour * 0.85 +
          (sunColour - roomColour * 0.85) * sunReach ** 0.8 * sign.sunResponse +
          lampLight * sign.lampResponse;
        const sheen =
          sunReach ** sign.sheenFocus * sign.sheen * sunColour +
          lampReach ** 3 * sign.lampSheen * (lamp.colour[channel] ?? 0);
        const glint = towardsLamp * 9 * lamp.strength * (lamp.colour[channel] ?? 0) * lampGlint;
        const rim = towardsWindow * sign.rim * sunReach * sunColour;
        let value = plaster * wallLight * (1 - coverage) + (metal * metalLight + sheen + glint + rim) * coverage;
        value += (airGlow[index] ?? 0) * 0.06 * (airGlowColour[channel] ?? 0);
        value += (motes[index] ?? 0) * dust.strength * beam * sunColour;
        value = value * (1 - veil) + (light.haze[channel] ?? 0) * veil;
        pixels[index * 3 + channel] = Math.round(clamp(value) * 255);
      }
    }
  }

  return pixels;
}
