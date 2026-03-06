import { fetchNotifications } from '@/api/notification';
import { QUERY_KEYS } from '@/lib/constants';
import { useSession } from '@/store/session';
import { useQuery } from '@tanstack/react-query';

export function useNotificationsData() {
	const session = useSession();
	return useQuery({
		queryKey: QUERY_KEYS.notification.list,
		queryFn: () => fetchNotifications(),
		enabled: !!session?.user?.id
	});
}
