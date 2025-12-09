import { Outlet } from 'react-router';

import Header from './header/Header';
import Footer from './footer/Footer';

export default function GlobalLayout() {
	return (
		<div className="flex min-h-[100vh] flex-col">
			<Header />
			<main className="m-auto w-full max-w-175 flex-1 border-x px-4 py-6">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
