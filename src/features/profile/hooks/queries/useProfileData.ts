import { createProfile, fetchProfile } from '@/features/profile/api/profile';
import { QUERY_KEYS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { useSession } from '@/store/session';

export function getProfileQueryOptions({
	userId,
	sessionUserId
}: {
	userId: string;
	sessionUserId?: string;
}) {
	const isMine = userId === sessionUserId;

	return {
		queryKey: QUERY_KEYS.profile.byId(userId),
		queryFn: async () => {
			try {
				const profile = await fetchProfile(userId);
				return profile;
			} catch (error) {
				if (isMine && (error as PostgrestError).code === 'PGRST116') {
					return await createProfile(userId);
				}
				throw error;
			}
		},
		staleTime: 30 * 1000
	};
}

export function useProfileData(
	userId?: string,
	options?: {
		enabled?: boolean;
	}
) {
	const session = useSession();

	return useQuery({
		...getProfileQueryOptions({
			userId: userId!,
			sessionUserId: session?.user.id
		}),
		enabled: !!userId && (options?.enabled ?? true)
	});
}
