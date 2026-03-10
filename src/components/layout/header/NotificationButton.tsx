import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

import {
	useNotificationsData,
	useUnreadNotificationCountData
} from '@/features/notification/hooks/queries/useNotificationsData';
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
} from '@/features/notification/api/notification';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { generateErrorMessage } from '@/lib/error';
import { fetchLatestWeeklyInsight } from '@/features/insight/api/insight';
import { useWeeklyRecapModalActions } from '@/store/weeklyRecapModal';

export default function NotificationButton() {
	const session = useSession();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const weeklyRecapModalActions = useWeeklyRecapModalActions();
	const [open, setOpen] = useState(false);
	const userId = session?.user?.id ?? '';
	const notificationQueryKey = QUERY_KEYS.notification.listByUser(userId);
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
						queryClient.setQueryData<number>(
							unreadCountQueryKey,
							prev => (prev ?? 0) + 1
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

		if (notification.type === 'weekly_recap_ready') {
			try {
				const insight = await queryClient.fetchQuery({
					queryKey: QUERY_KEYS.insight.latestByUser(userId),
					queryFn: () => fetchLatestWeeklyInsight(userId)
				});

				if (!insight) {
					toast.error('주간 회고 데이터를 불러오지 못했어요.', {
						position: 'top-center'
					});
					return;
				}

				weeklyRecapModalActions.open(insight.recap);
				setOpen(false);
			} catch (error) {
				toast.error(generateErrorMessage(error), {
					position: 'top-center'
				});
			}

			return;
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
						<span className="bg-destructive absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
							{unreadCount > 9 ? '9+' : unreadCount}
						</span>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent align="end" className="max-w-80 p-0">
				<div className="flex items-center justify-between border-b px-3 py-2">
					<div className="flex flex-col items-start">
						<p className="text-sm font-semibold">알림</p>
						<p className="text-muted-foreground text-[10px]">
							최대 20개의 최근 알림이 표시됩니다.
						</p>
					</div>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 self-start px-2 text-xs"
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
											!notification.read_at ? 'bg-accent' : ''
										}`}
										onClick={() => handleClickNotification(notification)}>
										<div className="flex justify-between">
											<p className="text-muted-foreground mb-1 text-xs">
												{formatNotificationTitle(notification)}
											</p>
											{!notification.read_at && (
												<div className="bg-chart-2/40 flex size-4 animate-pulse items-center justify-center rounded-full">
													<div className="bg-chart-2 size-2 rounded-full" />
												</div>
											)}
										</div>
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

/**
 *	알림 제목을 유형에 따라 포맷팅하는 함수
 *	각 알림 유형에 대해 사용자에게 보여줄 메시지를 반환
 *	알림 유형에 따라 다른 메시지를 반환하여 사용자가 알림의 내용을 빠르게 이해할 수 있도록 도와줌
 *
 */
function formatNotificationTitle(notification: NotificationRow) {
	switch (notification.type) {
		case 'weekly_recap_ready':
			return '주간 회고가 도착했어요';
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

/**
 *
 *	알림 본문을 렌더링하는 함수
 *	알림의 payload에서 미리보기 텍스트를 추출하여 표시
 *	댓글 미리보기 또는 메시지 미리보기를 보여줌으로써 사용자가 알림의 내용을 빠르게 파악할 수 있도록 도와줌
 *	알림 유형에 따라 적절한 본문을 렌더링하여 사용자 경험을 향상시킴
 */
function renderNotificationBody(notification: NotificationRow) {
	if (notification.payload && typeof notification.payload === 'object') {
		const payload = notification.payload as any;
		const preview = payload.comment_preview ?? payload.message ?? null;

		if (notification.type === 'weekly_recap_ready') {
			const totalActivity = payload.total_activity as number | undefined;
			if (typeof totalActivity === 'number') {
				return (
					<p className="text-foreground text-xs">지난 주 회고를 해볼까요?</p>
				);
			}
		}

		if (preview) {
			return <p className="text-foreground line-clamp-2 text-xs">{preview}</p>;
		}
	}

	return null;
}
