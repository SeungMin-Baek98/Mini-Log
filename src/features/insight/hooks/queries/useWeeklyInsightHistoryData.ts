import { fetchWeeklyInsightHistory } from '@/features/insight/api/insight';
import { QUERY_KEYS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';

export function useWeeklyInsightHistoryData(
	userId: string | undefined,
	enabled = true
) {
	return useQuery({
		queryKey: userId
			? QUERY_KEYS.insight.historyByUser(userId)
			: QUERY_KEYS.insight.all,
		queryFn: () => {
			if (!userId) throw new Error('로그인 유저가 없습니다.');
			return fetchWeeklyInsightHistory(userId);
		},
		enabled: Boolean(userId) && enabled
	});
}
