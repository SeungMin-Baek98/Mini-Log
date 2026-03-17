import { useEffect } from 'react';

import { useProfileData } from '@/features/profile/hooks/queries/useProfileData';
import { useIsSessionLoaded, useSession, useSetSession } from '@/store/session';

import supabase from '@/utils/supabase';
import GlobalLoader from '@/components/GlobalLoader';

export default function SessionProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const session = useSession();
	const isSessionLoaded = useIsSessionLoaded();
	const setSession = useSetSession();

	const { data: profile, isLoading: isProfileLoading } = useProfileData(
		session?.user.id
	);

	useEffect(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [setSession]);

	if (!isSessionLoaded) return <GlobalLoader />;
	if (isProfileLoading) return <GlobalLoader />;

	return children;
}
