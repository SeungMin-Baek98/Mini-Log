import { createPost, createPostWithImages } from '@/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationCallback } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';

export function useCreatePost(callbacks?: UseMutationCallback) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPostWithImages,
		onSuccess: () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.post.list
			});
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
