import type { Tables } from '@/database.types';
import supabase from '@/utils/supabase';

export type NotificationRow = Tables<'notification'>;

export async function fetchNotifications(limit = 20) {
	const { data, error } = await supabase
		.from('notification')
		.select(
			'*, actor: profile!notification_actor_fk (*), post: post!notification_post_fk (*), comment: comment!notification_comment_fk (*)'
		)
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error) throw error;
	return data as (NotificationRow & {
		actor?: Tables<'profile'> | null;
		post?: Tables<'post'> | null;
		comment?: Tables<'comment'> | null;
	})[];
}

export async function markNotificationAsRead(id: number) {
	const { data, error } = await supabase
		.from('notification')
		.update({ read_at: new Date().toISOString() })
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return data as NotificationRow;
}

export async function markAllNotificationsAsRead(userId: string) {
	const { error } = await supabase
		.from('notification')
		.update({ read_at: new Date().toISOString() })
		.eq('user_id', userId)
		.is('read_at', null);

	if (error) throw error;
}
