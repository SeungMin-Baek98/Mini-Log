import ModalProvider from './provider/ModalProvider';
import SessionProvider from './provider/SessionProvider';
import RooteRoute from './RootRoute';

export default function App() {
	return (
		<SessionProvider>
			<ModalProvider>
				<RooteRoute />
			</ModalProvider>
		</SessionProvider>
	);
}
