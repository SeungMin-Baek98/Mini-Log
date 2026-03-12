import { createPost, createPostWithImages } from '@/features/post/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationCallback } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';

export function useCreatePost(callbacks?: UseMutationCallback) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPostWithImages,
		onSuccess: async (_, variables) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();

			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.post.list
			});

			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.profile.stats(variables.userId)
			});
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
