import { fetchPostsByDate } from '@/api/post';
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
	const monthKey = format(start, 'yyyy-MM');

	return useQuery({
		queryKey: QUERY_KEYS.post.calendar(userId, monthKey),
		queryFn: () => fetchPostsByDate({ userId, start, end }),
		enabled: !!userId && !!start && !!end
	});
}
