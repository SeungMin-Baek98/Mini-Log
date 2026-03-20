import { signInWithOAuth } from '@/features/auth/api/auth';
import type { UseMutationCallback } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useSignInWithOAuth(callbacks?: UseMutationCallback) {
	return useMutation({
		mutationFn: signInWithOAuth,
		onSuccess: () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
