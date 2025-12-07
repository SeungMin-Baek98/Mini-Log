import { fetchPosts } from '@/api/post';
import { QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

const PAGE_SIZE = 5; // 한 번에 불러올 포스트 개수

export function useInfinitePostsData(authorId?: string) {
	const queryClient = useQueryClient();
	const session = useSession();
	return useInfiniteQuery({
		queryKey: !authorId
			? QUERY_KEYS.post.list
			: QUERY_KEYS.post.userList(authorId),
		queryFn: async ({ pageParam }) => {
			const from = pageParam * PAGE_SIZE;
			const to = from + PAGE_SIZE - 1;

			const posts = await fetchPosts({
				from,
				to,
				userId: session!.user.id,
				authorId
			});

			posts.forEach(post => {
				queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
			});

			return posts.map(post => post.id);
		},

		initialPageParam: 0,
		// 새로운 페이지를 불러올 때 다음 페이지의 번호가 필요할때 호출된다.
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < PAGE_SIZE) return undefined; // 더이상 불러올 데이터가 없음
			return allPages.length;
		},

		// 데이터를 무한정 캐싱
		staleTime: Infinity
	});
}
