export type TargetType = "character" | "word" | "line" | "paragraph";

export type EffectName =
  | "fadeIn"
  | "typewriter"
  | "slideIn"
  | "bounce"
  | "scale"
  | "rotate";

export interface AnimationItemConfig {
  id: string;
  targetType: TargetType;
  startIndex: number;
  endIndex: number;
  effect: EffectName;
  duration?: number;
  delay?: number;
  easing?: string;
  // 任意のパラメータを許容
  [key: string]: unknown;
}

export interface AnimationGlobalConfig {
  autoPlay: boolean;
  playSpeed: number;
  previewMode: boolean;
}

export interface AnimationConfig {
  globalConfig: AnimationGlobalConfig;
  animations: AnimationItemConfig[];
}
