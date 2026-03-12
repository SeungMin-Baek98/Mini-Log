import { fetchPostsPage } from '@/features/post/api/post';
import { QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import type { PostSortOrder } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfDay, format, startOfDay } from 'date-fns';

const PAGE_SIZE = 5;

type Options = {
	authorId?: string;
	date?: Date | null;
	sortOrder?: PostSortOrder;
	page?: number;
	enabled?: boolean;
};

export function usePagedPostsData(options?: Options) {
	const authorId = options?.authorId;
	const date = options?.date ? new Date(options.date) : null;
	const sortOrder = options?.sortOrder ?? 'latest';
	const page = options?.page ?? 1;
	const enabled = options?.enabled ?? true;
	const dateKey = date ? format(date, 'yyyy-MM-dd') : undefined;
	const dateRange = date
		? { start: startOfDay(date), end: endOfDay(date) }
		: undefined;

	const queryClient = useQueryClient();
	const session = useSession();
	const baseKey = !authorId
		? QUERY_KEYS.post.list
		: QUERY_KEYS.post.userList(authorId);
	const queryKey = dateKey
		? [...baseKey, 'sort', sortOrder, 'date', dateKey, 'page', page]
		: [...baseKey, 'sort', sortOrder, 'page', page];

	return useQuery({
		queryKey,
		enabled,
		queryFn: async () => {
			const from = (page - 1) * PAGE_SIZE;
			const to = from + PAGE_SIZE - 1;
			const { posts, totalCount } = await fetchPostsPage({
				from,
				to,
				userId: session!.user.id,
				authorId,
				dateRange,
				sortOrder
			});

			posts.forEach(post => {
				queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
			});

			return {
				postIds: posts.map(post => post.id),
				totalCount,
				pageSize: PAGE_SIZE
			};
		},
		staleTime: Infinity
	});
}
