import { createPostWithImages } from '@/features/post/api/post';
import {
	type QueryClient,
	useMutation,
	useQueryClient
} from '@tanstack/react-query';
import type { UseMutationCallback } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';

export async function invalidatePostCreationQueries(
	queryClient: Pick<QueryClient, 'invalidateQueries'>,
	userId: string
) {
	await Promise.all([
		queryClient.invalidateQueries({
			queryKey: QUERY_KEYS.post.all
		}),
		queryClient.invalidateQueries({
			queryKey: QUERY_KEYS.profile.stats(userId)
		})
	]);
}

export function useCreatePost(callbacks?: UseMutationCallback) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPostWithImages,
		onSuccess: async (_, variables) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();

			await invalidatePostCreationQueries(queryClient, variables.userId);
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
