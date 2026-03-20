import { fetchPostById } from '@/features/post/api/post';
import { ANONYMOUS_VIEWER_ID, QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import { useQuery } from '@tanstack/react-query';

export function usePostByIdData({
	postId,
	type
}: {
	postId: number;
	type: 'FEED' | 'DETAIL';
}) {
	const session = useSession();
	const viewerId = session?.user.id ?? ANONYMOUS_VIEWER_ID;

	return useQuery({
		queryKey: QUERY_KEYS.post.byId(postId, viewerId),
		queryFn: () => fetchPostById({ postId, userId: session?.user.id }),
		enabled: type !== 'FEED'
	});
}
