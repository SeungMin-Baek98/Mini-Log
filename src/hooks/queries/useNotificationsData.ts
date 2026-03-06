import { fetchNotifications } from '@/api/notification';
import { QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import { useQuery } from '@tanstack/react-query';

export function useNotificationsData() {
	const session = useSession();
	const userId = session?.user?.id;
	return useQuery({
		queryKey: userId
			? QUERY_KEYS.notification.listByUser(userId)
			: QUERY_KEYS.notification.list,
		queryFn: () => {
			if (!userId) throw new Error('로그인 유저가 없습니다.');
			return fetchNotifications({ userId });
		},
		enabled: !!userId
	});
}
