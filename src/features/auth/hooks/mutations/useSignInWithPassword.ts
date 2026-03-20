import { signInWithPassword } from '@/features/auth/api/auth';
import { useMutation } from '@tanstack/react-query';
import type { UseMutationCallback } from '@/types';

export function useSignInWithPassword(callbacks?: UseMutationCallback) {
	return useMutation({
		mutationFn: signInWithPassword,
		onSuccess: () => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
		},
		onError: error => {
			console.error(error);

			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
