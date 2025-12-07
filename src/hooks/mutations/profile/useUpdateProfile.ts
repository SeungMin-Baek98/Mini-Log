import { updateProfile } from '@/api/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { ProfileEntity, UseMutationCallback } from '@/types';

export function useUpdateProfile(callbacks?: UseMutationCallback) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProfile,
		onSuccess: updatedProfile => {
			if (callbacks?.onSuccess) callbacks.onSuccess();

			// 캐시된 프로필 데이터 업데이트
			queryClient.setQueryData<ProfileEntity>(
				QUERY_KEYS.profile.byId(updatedProfile.id),
				updatedProfile
			);
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
