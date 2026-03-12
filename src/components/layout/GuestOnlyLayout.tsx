import { useSession } from '@/store/session';
import { Navigate, Outlet } from 'react-router';
import { AuthShell } from '@/features/auth/components';

export default function GuestOnlyLayout() {
	const session = useSession();
	if (session) return <Navigate to={'/'} replace={true} />;

	return (
		<AuthShell>
			<Outlet />
		</AuthShell>
	);
}
