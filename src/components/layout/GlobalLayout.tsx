import { Outlet } from 'react-router';

import Header from './header/Header';
import Footer from './footer/Footer';

export default function GlobalLayout() {
	return (
		<div className="flex min-h-[100vh] flex-col">
			<Header />
			<main className="relative m-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
