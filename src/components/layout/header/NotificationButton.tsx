import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

import {
	useNotificationsData,
	useUnreadNotificationCountData
} from '@/hooks/queries/useNotificationsData';
import { useSession } from '@/store/session';
import supabase from '@/utils/supabase';
import { QUERY_KEYS } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
	markAllNotificationsAsRead,
	markNotificationAsRead,
	type NotificationRow
} from '@/api/notification';
import { useNavigate } from 'react-router';

export default function NotificationButton() {
	const session = useSession();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const userId = session?.user?.id ?? '';
	const notificationQueryKey = QUERY_KEYS.notification.listByUser(
		userId
	);
	const unreadCountQueryKey = QUERY_KEYS.notification.unreadCountByUser(userId);

	const { data: notifications = [] } = useNotificationsData();
	const { data: unreadCount = 0 } = useUnreadNotificationCountData();

	useEffect(() => {
		if (!session?.user.id) return;

		const channel = supabase
			.channel(`notification:${session.user.id}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'notification',
					filter: `user_id=eq.${session.user.id}`
				},
				payload => {
					const newNotification = payload.new as NotificationRow;

					queryClient.setQueryData<NotificationRow[] | undefined>(
						notificationQueryKey,
						prev =>
							prev ? [newNotification, ...prev].slice(0, 20) : [newNotification]
					);
					if (!newNotification.read_at) {
						queryClient.setQueryData<number>(unreadCountQueryKey, prev =>
							(prev ?? 0) + 1
						);
					}
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, [session?.user.id, queryClient]);

	if (!session?.user) return null;

	const handleClickNotification = async (notification: NotificationRow) => {
		if (!notification.read_at) {
			const updatedNotification = await markNotificationAsRead(
				notification.id,
				session.user.id
			);
				if (updatedNotification) {
					queryClient.setQueryData<NotificationRow[] | undefined>(
						notificationQueryKey,
					prev =>
						prev?.map(item =>
							item.id === notification.id
								? { ...item, read_at: new Date().toISOString() }
								: item
						)
					);
					queryClient.setQueryData<number>(unreadCountQueryKey, prev =>
						Math.max((prev ?? 0) - 1, 0)
					);
				}
			}

		if (notification.post_id) {
			setOpen(false);
			navigate(`/post/${notification.post_id}`);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					aria-label="알림">
					<Bell className="h-4 w-4" />
					{unreadCount > 0 && (
						<span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
							{unreadCount > 9 ? '9+' : unreadCount}
						</span>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-80 p-0">
				<div className="flex items-center justify-between border-b px-3 py-2">
					<p className="text-sm font-semibold">알림</p>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 px-2 text-xs"
								onClick={async () => {
									await markAllNotificationsAsRead(session.user.id);
									queryClient.setQueryData<NotificationRow[] | undefined>(
									notificationQueryKey,
									prev =>
										prev?.map(item =>
											item.read_at
												? item
												: { ...item, read_at: new Date().toISOString() }
										)
									);
									queryClient.setQueryData<number>(unreadCountQueryKey, 0);
								}}>
							모두 읽음
						</Button>
					)}
				</div>
				<div className="max-h-96 overflow-y-auto">
					{notifications.length === 0 ? (
						<p className="text-muted-foreground px-4 py-6 text-center text-xs">
							아직 도착한 알림이 없어요.
						</p>
					) : (
						<ul className="divide-y text-sm">
							{notifications.map(notification => (
								<li key={notification.id}>
									<button
										type="button"
										className={`hover:bg-accent w-full cursor-pointer px-4 py-3 text-left ${
											!notification.read_at ? 'bg-accent/40' : ''
										}`}
										onClick={() => handleClickNotification(notification)}>
										<p className="text-muted-foreground mb-1 text-xs">
											{formatNotificationTitle(notification)}
										</p>
										{renderNotificationBody(notification)}
										<p className="text-muted-foreground mt-1 text-[10px]">
											{new Date(notification.created_at).toLocaleString()}
										</p>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

function formatNotificationTitle(notification: NotificationRow) {
	switch (notification.type) {
		case 'post_commented':
			return '내 게시글에 새로운 댓글이 달렸어요';
		case 'comment_replied':
			return '내 댓글에 답글이 달렸어요';
		case 'post_liked':
			return '내 게시글에 좋아요가 눌렸어요';
		default:
			return '새로운 알림';
	}
}

function renderNotificationBody(notification: NotificationRow) {
	if (notification.payload && typeof notification.payload === 'object') {
		const preview =
			(notification.payload as any).comment_preview ??
			(notification.payload as any).message ??
			null;

		if (preview) {
			return <p className="text-foreground line-clamp-2 text-xs">{preview}</p>;
		}
	}

	return null;
}
