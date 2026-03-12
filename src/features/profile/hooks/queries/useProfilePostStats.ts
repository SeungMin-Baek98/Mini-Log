import { useQuery } from '@tanstack/react-query';

import { fetchProfilePostStats } from '@/features/profile/api/profile';
import { QUERY_KEYS } from '@/lib/constants';

export function useProfilePostStats(userId?: string) {
	return useQuery({
		queryKey: QUERY_KEYS.profile.stats(userId!),
		queryFn: () => fetchProfilePostStats(userId!),
		enabled: !!userId
	});
}
