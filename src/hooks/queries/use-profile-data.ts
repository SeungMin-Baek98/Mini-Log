import { createProfile, fetchProfile } from '@/api/profile';
import { QUERY_KEYS } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';
import { useSession } from '@/store/session';

export function useProfileData(userId?: string) {
	const session = useSession();
	const isMine = userId === session?.user.id;

	return useQuery({
		queryKey: QUERY_KEYS.profile.byId(userId!),
		queryFn: async () => {
			try {
				const profile = await fetchProfile(userId!);
				return profile;
			} catch (error) {
				if (isMine && (error as PostgrestError).code === 'PGRST116') {
					return await createProfile(userId!);
				}
				throw error;
			}
		},
		enabled: !!userId // userId가 없을경우 쿼리가 실행되지 않도록 설정해두어서 queryKey에 userId타입을 단언하도록하였다.
	});
}
