import { createPost, createPostWithImages } from '@/api/post';
import { useMutation } from '@tanstack/react-query';
import type { UseMutationCallback } from '@/types';

export function useCreatePost(callbacks?: UseMutationCallback) {
	return useMutation({
		mutationFn: createPostWithImages,
		onSuccess: () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
