import { fetchLatestWeeklyInsight } from '@/features/insight/api/insight';
import { QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import { useQuery } from '@tanstack/react-query';

export function useWeeklyInsightData() {
	const session = useSession();
	const userId = session?.user.id;

	return useQuery({
		queryKey: userId
			? QUERY_KEYS.insight.latestByUser(userId)
			: QUERY_KEYS.insight.latestAnonymous,
		queryFn: () => {
			if (!userId) throw new Error('로그인 유저가 없습니다.');
			return fetchLatestWeeklyInsight(userId);
		},
		enabled: !!userId
	});
}
