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

			// 1. 캐시 아예 초기화
			queryClient.resetQueries({
				queryKey: QUERY_KEYS.post.list
			});

			// 2. 캐시 데이터에 완성된 포스트만 추가

			// 3. 낙관전 업데이트 방식(onMutate)
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
