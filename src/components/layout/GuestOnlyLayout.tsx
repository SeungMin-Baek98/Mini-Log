import { useSession } from '@/store/session';
import { getAuthRedirectPath } from '@/features/auth/lib/redirect';
import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router';
import { AuthShell } from '@/features/auth/components';

export default function GuestOnlyLayout() {
	const session = useSession();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const nextPath = getAuthRedirectPath(searchParams.get('next'));

	if (session) {
		const fallbackPath = location.pathname === nextPath ? '/' : nextPath;
		return <Navigate to={fallbackPath} replace={true} />;
	}

	return (
		<AuthShell>
			<Outlet />
		</AuthShell>
	);
}
