const DEFAULT_REDIRECT_PATH = '/';
const AUTH_PAGE_PREFIXES = ['/sign-in', '/sign-up', '/forget-password'];

export function sanitizeNextPath(nextPath?: string | null) {
	if (!nextPath) return null;
	if (!nextPath.startsWith('/')) return null;
	if (nextPath.startsWith('//')) return null;
	if (AUTH_PAGE_PREFIXES.some(prefix => nextPath.startsWith(prefix))) {
		return null;
	}

	return nextPath;
}

export function getAuthRedirectPath(nextPath?: string | null) {
	return sanitizeNextPath(nextPath) ?? DEFAULT_REDIRECT_PATH;
}

export function buildPathWithNext(path: string, nextPath?: string | null) {
	const safeNextPath = sanitizeNextPath(nextPath);
	if (!safeNextPath) return path;

	const url = new URL(path, 'https://onebite-log.local');
	url.searchParams.set('next', safeNextPath);
	return `${url.pathname}${url.search}${url.hash}`;
}
