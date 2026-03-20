import { fetchPostById } from '@/features/post/api/post';
import { ANONYMOUS_VIEWER_ID, QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import { useQuery } from '@tanstack/react-query';

export function getPostByIdQueryOptions({
	postId,
	userId
}: {
	postId: number;
	userId?: string;
}) {
	const viewerId = userId ?? ANONYMOUS_VIEWER_ID;

	return {
		queryKey: QUERY_KEYS.post.byId(postId, viewerId),
		queryFn: () => fetchPostById({ postId, userId }),
		staleTime: 30 * 1000
	};
}

export function usePostByIdData({
	postId,
	type,
	enabled = true
}: {
	postId: number;
	type: 'FEED' | 'DETAIL';
	enabled?: boolean;
}) {
	const session = useSession();

	return useQuery({
		...getPostByIdQueryOptions({
			postId,
			userId: session?.user.id
		}),
		enabled: enabled && type !== 'FEED'
	});
}
