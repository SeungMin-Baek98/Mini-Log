import { deletePost } from '@/api/post';
import { useMutation } from '@tanstack/react-query';
import { deleteImagesInPath } from '@/api/image';
import type { UseMutationCallback } from '@/types';

export default function useDeletePost(callbacks?: UseMutationCallback) {
	return useMutation({
		mutationFn: deletePost,
		onSuccess: async deletedPost => {
			if (callbacks?.onSuccess) callbacks.onSuccess();

			if (deletedPost.image_urls && deletedPost.image_urls.length > 0) {
				// 포스트 삭제시  스토리지에 저장된 이미지 삭제 로직 구현
				await deleteImagesInPath(`${deletedPost.author_id}/${deletedPost.id}`);
			}
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
