import ModalProvider from './provider/modalProvider';
import SessionProvder from './provider/SessionProvider';

import RooteRoute from './RooteRoute';

export default function App() {
	return (
		<SessionProvder>
			<ModalProvider>
				<RooteRoute />
			</ModalProvider>
		</SessionProvder>
	);
}
