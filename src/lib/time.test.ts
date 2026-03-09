import { describe, expect, it, vi } from 'vitest';

import { formatTimeAgo } from './time';

describe('formatTimeAgo', () => {
	it('returns minutes for recent dates', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-09T00:10:00.000Z'));

		expect(formatTimeAgo('2026-03-09T00:07:00.000Z')).toBe('3분 전');

		vi.useRealTimers();
	});
});
