import { togglePostLike } from '@/features/post/api/post';
import { QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import type { Post, UseMutationCallback } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useTogglePostLike(callbacks?: UseMutationCallback) {
	const queryClient = useQueryClient();
	const session = useSession();
	const viewerId = session?.user.id;

	return useMutation({
		mutationFn: togglePostLike,
		onMutate: async ({ postId }) => {
			if (!viewerId) return {};

			await queryClient.cancelQueries({
				queryKey: QUERY_KEYS.post.byId(postId, viewerId)
			});

			const prevPost = queryClient.getQueryData<Post>(
				QUERY_KEYS.post.byId(postId, viewerId)
			);

			queryClient.setQueryData<Post>(
				QUERY_KEYS.post.byId(postId, viewerId),
				post => {
					if (!post) throw new Error('포스터가 존재하지 않습니다.');

					return {
						...post,
						isLiked: !post.isLiked,
						like_count: post.isLiked ? post.like_count - 1 : post.like_count + 1
					};
				}
			);

			return {
				prevPost
			};
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.post.all
			});

			if (callbacks?.onSuccess) callbacks.onSuccess();
		},
		onError: (error, _, context) => {
			if (viewerId && context && context.prevPost) {
				queryClient.setQueryData(
					QUERY_KEYS.post.byId(context.prevPost.id, viewerId),
					context.prevPost
				);
			}

			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
