import { describe, expect, it, vi } from 'vitest';

import { QUERY_KEYS } from '@/lib/constants';

import { invalidatePostCreationQueries } from './useCreatePost';

describe('invalidatePostCreationQueries', () => {
	it('invalidates post queries for feed and profile caches', async () => {
		const invalidateQueries = vi.fn().mockResolvedValue(undefined);

		await invalidatePostCreationQueries(
			{ invalidateQueries },
			'user-123'
		);

		expect(invalidateQueries).toHaveBeenCalledTimes(2);
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: QUERY_KEYS.post.all
		});
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: QUERY_KEYS.profile.stats('user-123')
		});
	});
});
