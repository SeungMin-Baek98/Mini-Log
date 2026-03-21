import type { PostgrestError } from '@supabase/supabase-js';

const UUID_PATTERN =
	/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

const NOT_FOUND_ERROR_CODES = new Set(['PGRST116']);

export class AppRouteError extends Error {
	status: number;
	title: string;
	description: string;

	constructor({
		status,
		title,
		description
	}: {
		status: number;
		title: string;
		description: string;
	}) {
		super(description);
		this.name = 'AppRouteError';
		this.status = status;
		this.title = title;
		this.description = description;
	}
}

export function isUuid(value: string) {
	return UUID_PATTERN.test(value);
}

export function parsePositiveInteger(value?: string) {
	if (!value) return null;

	if (!/^[0-9]+$/.test(value)) {
		return null;
	}

	const parsedValue = Number.parseInt(value, 10);

	if (!Number.isSafeInteger(parsedValue) || parsedValue <= 0) {
		return null;
	}

	return parsedValue;
}

export function isNotFoundRouteError(error: unknown) {
	const errorCode = (error as Partial<PostgrestError> | null)?.code;

	return typeof errorCode === 'string' && NOT_FOUND_ERROR_CODES.has(errorCode);
}
