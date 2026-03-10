import { generateWeeklyInsight } from '@/features/insight/api/insight';
import { QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import type { UseMutationCallback } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useGenerateWeeklyInsight(callbacks?: UseMutationCallback) {
	const queryClient = useQueryClient();
	const session = useSession();
	const userId = session?.user.id;

	return useMutation({
		mutationFn: generateWeeklyInsight,
		onSuccess: async response => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			if (!userId) return;

			queryClient.setQueryData(QUERY_KEYS.insight.latestByUser(userId), response);
			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.insight.latestByUser(userId)
			});
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
