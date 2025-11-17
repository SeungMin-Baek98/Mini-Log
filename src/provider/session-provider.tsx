import { useEffect } from 'react';
import { useProfileData } from '@/hooks/queries/use-profile-data';
import { useIsSessionLoaded, useSession, useSetSession } from '@/store/session';

import supabase from '@/utils/supabase';
import GlobalLoader from '@/components/global-loader';

export default function SessionProvder({
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
		supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
		});
	}, []);

	if (!isSessionLoaded) return <GlobalLoader />;
	if (isProfileLoading) return <GlobalLoader />;

	return children;
}
