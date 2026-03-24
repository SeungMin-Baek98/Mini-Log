import type { Session } from '@supabase/supabase-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	SESSION_MAX_AGE_MS,
	SESSION_STARTED_AT_STORAGE_KEY,
	clearSessionStartedAt,
	ensureSessionStartedAt,
	getSessionRemainingMs,
	getStoredSessionStartedAt,
	isSessionExpired,
	syncSessionStartedAt
} from './session-expiration';

function createSession({
	userId = 'user-1',
	lastSignInAt = '2026-03-24T00:00:00.000Z'
}: {
	userId?: string;
	lastSignInAt?: string;
} = {}) {
	return {
		access_token: 'access-token',
		refresh_token: 'refresh-token',
		expires_in: 3600,
		expires_at: 1_800_000_000,
		token_type: 'bearer',
		user: {
			id: userId,
			app_metadata: {},
			aud: 'authenticated',
			created_at: '2026-03-24T00:00:00.000Z',
			last_sign_in_at: lastSignInAt,
			role: 'authenticated',
			updated_at: '2026-03-24T00:00:00.000Z',
			user_metadata: {}
		}
	} as Session;
}

describe('session-expiration', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		vi.useRealTimers();
		clearSessionStartedAt();
	});

	it('stores the sign-in timestamp when the user signs in', () => {
		const session = createSession();

		const startedAt = syncSessionStartedAt('SIGNED_IN', session);

		expect(startedAt).toBe(new Date(session.user.last_sign_in_at!).getTime());
		expect(getStoredSessionStartedAt(session)).toBe(startedAt);
	});

	it('seeds the session start timestamp from the session when none is stored', () => {
		const session = createSession({
			lastSignInAt: '2026-03-23T15:30:00.000Z'
		});

		const startedAt = ensureSessionStartedAt(session);

		expect(startedAt).toBe(new Date('2026-03-23T15:30:00.000Z').getTime());
		expect(
			JSON.parse(localStorage.getItem(SESSION_STARTED_AT_STORAGE_KEY)!)
		).toEqual({
			userId: 'user-1',
			startedAt
		});
	});

	it('does not reuse another user session timestamp', () => {
		const previousSession = createSession({ userId: 'user-1' });
		const nextSession = createSession({ userId: 'user-2' });

		syncSessionStartedAt('SIGNED_IN', previousSession);

		expect(getStoredSessionStartedAt(nextSession)).toBeNull();
	});

	it('reports remaining time and expiration against the 24 hour window', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-25T00:00:00.000Z'));

		const startedAt = new Date('2026-03-24T06:00:00.000Z').getTime();

		expect(getSessionRemainingMs(startedAt)).toBe(6 * 60 * 60 * 1000);
		expect(isSessionExpired(startedAt)).toBe(false);
		expect(
			isSessionExpired(Date.now() - SESSION_MAX_AGE_MS - 1)
		).toBe(true);
	});
});
