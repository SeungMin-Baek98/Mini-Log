import { fetchPostsByDate } from '@/features/post/api/post';
import { QUERY_KEYS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export function usePostCountByDate({
	userId,
	start,
	end
}: {
	userId: string;
	start: Date;
	end: Date;
}) {
	const startKey = format(start, 'yyyy-MM-dd');
	const endKey = format(end, 'yyyy-MM-dd');

	return useQuery({
		queryKey: QUERY_KEYS.post.calendar(userId, `${startKey}_${endKey}`),
		queryFn: () => fetchPostsByDate({ userId, start, end }),
		enabled: !!userId && !!start && !!end
	});
}
