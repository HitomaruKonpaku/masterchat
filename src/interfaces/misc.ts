export const SUPERCHAT_SIGNIFICANCE_MAP = {
  blue: 1,
  lightblue: 2,
  green: 3,
  yellow: 4,
  orange: 5,
  magenta: 6,
  red: 7,
} as const;
/**
 * Map from headerBackgroundColor to color name
 */

export const SUPERCHAT_COLOR_MAP = {
  "4279592384": "blue",
  "4280191205": "blue",
  "4278237396": "lightblue",
  "4278248959": "lightblue",
  "4278239141": "green",
  "4280150454": "green",
  "4294947584": "yellow",
  "4294953512": "yellow",
  "4293284096": "orange",
  "4294278144": "orange",
  "4290910299": "magenta",
  "4293467747": "magenta",
  "4291821568": "red",
  "4293271831": "red",
} as const;
/**
 * Components
 */

export type SuperChatSignificance =
  typeof SUPERCHAT_SIGNIFICANCE_MAP[keyof typeof SUPERCHAT_SIGNIFICANCE_MAP];

export type SuperChatColor =
  typeof SUPERCHAT_COLOR_MAP[keyof typeof SUPERCHAT_COLOR_MAP];

export type SuperChatColorFields<T extends object> = {
  [K in keyof T as K extends `${string}Color` ? K : never]: Color;
};

export type SuperChat<T extends object> = {
  amount: number;
  currency: string;
  color: SuperChatColor;
  significance: SuperChatSignificance;
} & SuperChatColorFields<T>;

export interface Membership {
  status: string;
  since?: string;
  thumbnail: string;
}

export interface Badges {
  isOwner: boolean;
  isModerator: boolean;
  isVerified: boolean;
  membership?: Membership;
}

/**
 * 0 - 255
 */

export interface Color {
  r: number;
  g: number;
  b: number;
  opacity: number;
}

/**
 * Continuation
 */

export interface ReloadContinuation {
  token: string;
}

export interface TimedContinuation extends ReloadContinuation {
  timeoutMs: number;
}
