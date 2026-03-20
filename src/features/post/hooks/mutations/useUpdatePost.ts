import { updatePost } from '@/features/post/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post, UseMutationCallback } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';

export function useUpdatePost(callbacks?: UseMutationCallback) {
	const queryClient = useQueryClient();
	const session = useSession();
	const viewerId = session?.user.id;

	return useMutation({
		mutationFn: updatePost,
		onSuccess: async updatedPost => {
			if (callbacks?.onSuccess) callbacks.onSuccess();

			if (viewerId) {
				queryClient.setQueryData<Post>(
					QUERY_KEYS.post.byId(updatedPost.id, viewerId),
					prevPost => {
						if (!prevPost)
							throw new Error(
								`${updatedPost.id}에 해당하는 포스트를 캐시 데이터에서 찾을 수 없습니다. `
							);
						return { ...prevPost, ...updatedPost };
					}
				);
			}

			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.post.all
			});
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
