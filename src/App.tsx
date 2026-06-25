import { Suspense } from 'react';
import { RouterProvider } from 'react-router';

import GlobalLoader from './components/GlobalLoader';
import ModalProvider from './provider/ModalProvider';
import SessionProvider from './provider/SessionProvider';
import { router } from './RootRoute';

export default function App() {
	return (
		<SessionProvider>
			<ModalProvider>
				<Suspense fallback={<GlobalLoader />}>
					<RouterProvider router={router} />
				</Suspense>
			</ModalProvider>
		</SessionProvider>
	);
}
