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
		onSuccess: async () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			if (!userId) return;

			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.insight.latestByUser(userId)
			});
			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.notification.listByUser(userId)
			});
			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.notification.unreadCountByUser(userId)
			});
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
