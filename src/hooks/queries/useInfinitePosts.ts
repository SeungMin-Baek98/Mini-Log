import { fetchPosts } from '@/api/post';
import { QUERY_KEYS } from '@/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_SIZE = 5; // 한 번에 불러올 포스트 개수

export function useInfinitePostsData() {
	return useInfiniteQuery({
		queryKey: QUERY_KEYS.post.list,
		queryFn: async ({ pageParam }) => {
			const from = pageParam * PAGE_SIZE;
			const to = from + PAGE_SIZE - 1;

			const posts = await fetchPosts({ from, to });
			return posts;
		},

		initialPageParam: 0,
		// 새로운 페이지를 불러올 때 다음 페이지의 번호가 필요할때 호출된다.
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < PAGE_SIZE) return undefined; // 더이상 불러올 데이터가 없음
			return allPages.length;
		}
	});
}
