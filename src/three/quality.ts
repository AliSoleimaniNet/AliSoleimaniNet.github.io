// Frame-time monitor that steps the render tier down when the machine cannot keep up.
export type Tier = 'high' | 'medium' | 'low' | 'off';
export const TIER_ORDER: Exclude<Tier, 'off'>[] = ['high', 'medium', 'low'];

export const TIER_SETTINGS: Record<Exclude<Tier, 'off'>, { composer: boolean; packets: number; dpr: number; dust: boolean }> = {
  high: { composer: true, packets: 360, dpr: 2 },
  medium: { composer: false, packets: 240, dpr: 1.5 },
  low: { composer: false, packets: 110, dpr: 1 },
} as Record<Exclude<Tier, 'off'>, { composer: boolean; packets: number; dpr: number; dust: boolean }>;
TIER_SETTINGS.high.dust = true; TIER_SETTINGS.medium.dust = true; TIER_SETTINGS.low.dust = false;

export class FrameMonitor {
  private samples: number[] = [];
  private elapsed = 0;
  private warm = 0;
  constructor(private readonly onSlow: () => void, private readonly warmup = 2.5, private readonly window = 2.0, private readonly minFps = 42) {}

  push(dt: number) {
    this.warm += dt;
    if (this.warm < this.warmup) return;
    this.samples.push(dt);
    this.elapsed += dt;
    if (this.elapsed < this.window) return;
    const avg = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    this.samples = [];
    this.elapsed = 0;
    if (1 / avg < this.minFps) { this.onSlow(); this.warm = 0; }
  }

  reset() { this.samples = []; this.elapsed = 0; this.warm = 0; }
}
