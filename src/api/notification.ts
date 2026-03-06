import type { Tables } from '@/database.types';
import supabase from '@/utils/supabase';

export type NotificationRow = Tables<'notification'>;

export async function fetchNotifications({
	userId,
	limit = 20
}: {
	userId: string;
	limit?: number;
}) {
	const { data, error } = await supabase
		.from('notification')
		.select(
			'*, actor: profile!notification_actor_fk (*), post: post!notification_post_fk (*), comment: comment!notification_comment_fk (*)'
		)
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error) throw error;
	return data as (NotificationRow & {
		actor?: Tables<'profile'> | null;
		post?: Tables<'post'> | null;
		comment?: Tables<'comment'> | null;
	})[];
}

export async function fetchUnreadNotificationCount(userId: string) {
	const { count, error } = await supabase
		.from('notification')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', userId)
		.is('read_at', null);

	if (error) throw error;
	return count ?? 0;
}

export async function markNotificationAsRead(id: number, userId: string) {
	const { data, error } = await supabase
		.from('notification')
		.update({ read_at: new Date().toISOString() })
		.eq('id', id)
		.eq('user_id', userId)
		.is('read_at', null)
		.select()
		.maybeSingle();

	if (error) throw error;
	return (data as NotificationRow | null) ?? null;
}

export async function markAllNotificationsAsRead(userId: string) {
	const { error } = await supabase
		.from('notification')
		.update({ read_at: new Date().toISOString() })
		.eq('user_id', userId)
		.is('read_at', null);

	if (error) throw error;
}
