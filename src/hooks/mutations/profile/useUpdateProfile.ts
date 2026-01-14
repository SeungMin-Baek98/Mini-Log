import { updateProfile } from '@/api/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import type { Post, ProfileEntity, UseMutationCallback } from '@/types';

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

			// 해당 사용자가 작성한 모든 포스트의 author 정보 업데이트
			// 포스트 쿼리 캐시를 순회하며 author 정보 업데이트
			const queryCache = queryClient.getQueryCache();
			// 개별 포스트 쿼리만 찾기 (['post', 'id', postId] 형태)
			const postQueries = queryCache.findAll({
				predicate: query =>
					query.queryKey[0] === 'post' && query.queryKey[1] === 'id'
			});

			postQueries.forEach(query => {
				const data = query.state.data;
				if (!data) return;

				const postData = data as Post;
				// 해당 사용자가 작성한 포스트인 경우 author 정보 업데이트
				if (postData?.author?.id === updatedProfile.id) {
					queryClient.setQueryData<Post>(query.queryKey, {
						...postData,
						author: updatedProfile
					});
				}
			});
		},
		onError: error => {
			if (callbacks?.onError) callbacks.onError(error);
		}
	});
}
