import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24시간
export const SESSION_STARTED_AT_STORAGE_KEY = 'onebite-log:session-started-at';

type SessionStartRecord = {
	userId: string;
	startedAt: number;
};

function getStorage() {
	if (typeof window === 'undefined') return null;

	return window.localStorage;
}

function toValidTimestamp(value: unknown) {
	const parsedValue =
		typeof value === 'number' ? value : Number.parseInt(String(value), 10);

	if (!Number.isFinite(parsedValue) || parsedValue <= 0) return null;

	return parsedValue;
}

function parseSessionStartRecord(rawValue: string | null) {
	if (!rawValue) return null;

	try {
		const parsedValue = JSON.parse(rawValue) as Partial<SessionStartRecord>;
		const startedAt = toValidTimestamp(parsedValue.startedAt);

		if (!startedAt || typeof parsedValue.userId !== 'string') return null;

		return {
			userId: parsedValue.userId,
			startedAt
		} satisfies SessionStartRecord;
	} catch {
		return null;
	}
}

function getLastSignInTimestamp(session: Session) {
	const lastSignInAt = session.user.last_sign_in_at;

	if (!lastSignInAt) return null;

	const startedAt = new Date(lastSignInAt).getTime();

	if (Number.isNaN(startedAt)) return null;

	return startedAt;
}

function readSessionStartRecord() {
	const storage = getStorage();

	if (!storage) return null;

	return parseSessionStartRecord(
		storage.getItem(SESSION_STARTED_AT_STORAGE_KEY)
	);
}

export function clearSessionStartedAt() {
	const storage = getStorage();

	if (!storage) return;

	storage.removeItem(SESSION_STARTED_AT_STORAGE_KEY);
}

export function getStoredSessionStartedAt(session: Session) {
	const sessionStartRecord = readSessionStartRecord();

	if (!sessionStartRecord || sessionStartRecord.userId !== session.user.id) {
		return null;
	}

	return sessionStartRecord.startedAt;
}

export function persistSessionStartedAt(session: Session, startedAt: number) {
	const storage = getStorage();

	if (!storage) return;

	storage.setItem(
		SESSION_STARTED_AT_STORAGE_KEY,
		JSON.stringify({
			userId: session.user.id,
			startedAt
		} satisfies SessionStartRecord)
	);
}

export function ensureSessionStartedAt(session: Session) {
	const startedAt =
		getStoredSessionStartedAt(session) ??
		getLastSignInTimestamp(session) ??
		Date.now();

	persistSessionStartedAt(session, startedAt);

	return startedAt;
}

export function syncSessionStartedAt(
	event: AuthChangeEvent,
	session: Session | null
) {
	if (!session || event === 'SIGNED_OUT') {
		clearSessionStartedAt();
		return null;
	}

	if (event === 'SIGNED_IN') {
		const startedAt = getLastSignInTimestamp(session) ?? Date.now();

		persistSessionStartedAt(session, startedAt);

		return startedAt;
	}

	return ensureSessionStartedAt(session);
}

export function isSessionExpired(startedAt: number, now = Date.now()) {
	return now - startedAt >= SESSION_MAX_AGE_MS;
}

export function getSessionRemainingMs(startedAt: number, now = Date.now()) {
	return Math.max(SESSION_MAX_AGE_MS - (now - startedAt), 0);
}
