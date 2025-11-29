import ModalProvider from './provider/ModalProvider';
import SessionProvider from './provider/SessionProvider';
import RooteRoute from './RooteRoute';

export default function App() {
	return (
		<SessionProvider>
			<ModalProvider>
				<RooteRoute />
			</ModalProvider>
		</SessionProvider>
	);
}
