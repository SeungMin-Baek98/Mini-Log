import SessionProvder from './provider/session-provider';
import RooteRoute from './RooteRoute';

export default function App() {
	return (
		<SessionProvder>
			<RooteRoute />
		</SessionProvder>
	);
}
