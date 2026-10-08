import { describe, expect, it } from 'vitest';
import { getDemoMultiplier } from '@/hooks/use-fishing-game';

describe('Fishing demo outcomes', () => {
  it('cycles through both catches and escaped fish', () => {
    expect(getDemoMultiplier(0, 'mixed')).toBe(3.42);
    expect(getDemoMultiplier(1, 'mixed')).toBe(0);
    expect(getDemoMultiplier(6, 'mixed')).toBe(3.42);
  });
  it('supports explicit win and loss previews', () => {
    expect(getDemoMultiplier(1, 'win')).toBe(3.42);
    expect(getDemoMultiplier(0, 'loss')).toBe(0);
  });
});