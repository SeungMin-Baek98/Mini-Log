import { deleteComment } from '@/api/comment';
import { QUERY_KEYS } from '@/lib/constants';
import { type Comment, type Post, type UseMutationCallback } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteComment(callbacks?: UseMutationCallback) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteComment,
		onSuccess: deletedComment => {
			if (callbacks?.onSuccess) callbacks.onSuccess();

			const cachedComments = queryClient.getQueryData<Comment[]>(
				QUERY_KEYS.comment.post(deletedComment.post_id)
			);
			const idsToRemove = cachedComments
				? collectDescendantIds(deletedComment.id, cachedComments)
				: new Set([deletedComment.id]);

			queryClient.setQueryData<Comment[]>(
				QUERY_KEYS.comment.post(deletedComment.post_id),
				comments => {
					if (!comments)
						throw new Error('댓글이 캐시 데이터에 보관되어있지 않습니다.');

					return comments.filter(comment => !idsToRemove.has(comment.id));
				}
			);

			queryClient.setQueryData<Post>(
				QUERY_KEYS.post.byId(deletedComment.post_id),
				post => {
					if (!post) return post;

					return {
						...post,
						comment_count: Math.max(0, post.comment_count - idsToRemove.size)
					};
				}
			);
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}

function collectDescendantIds(
	targetId: number,
	comments: Comment[]
): Set<number> {
	const ids = new Set<number>([targetId]);
	const queue = [targetId];

	while (queue.length > 0) {
		const currentId = queue.shift();
		if (currentId === undefined) break;

		comments.forEach(comment => {
			if (comment.parent_comment_id === currentId && !ids.has(comment.id)) {
				ids.add(comment.id);
				queue.push(comment.id);
			}
		});
	}

	return ids;
}
