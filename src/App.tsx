import { RouterProvider } from 'react-router';

import ModalProvider from './provider/ModalProvider';
import SessionProvider from './provider/SessionProvider';
import { router } from './RootRoute';

export default function App() {
	return (
		<SessionProvider>
			<ModalProvider>
				<RouterProvider router={router} />
			</ModalProvider>
		</SessionProvider>
	);
}
