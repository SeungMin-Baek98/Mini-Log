import { Link } from 'react-router';

import logo from '@/assets/logo.png';
import ThemeButton from './ThemeButton';
import ProfileButton from './ProfileButton';
import NotificationButton from './NotificationButton';

export default function Header() {
	return (
		<header className="supports-[backdrop-filter]:bg-background/72 sticky top-0 z-50 border-b border-white/40 px-4 backdrop-blur-xl sm:px-6">
			<div className="m-auto flex h-18 w-full max-w-5xl items-center justify-between">
				<Link to={'/'} className="flex items-center gap-3">
					<div className="flex flex-col">
						<span className="text-primary/70 text-[0.7rem] tracking-[0.28em] uppercase">
							Warm Lifelog
						</span>
						<div className="flex gap-2 text-lg font-semibold">
							<img
								src={logo}
								alt="미니 로그의 로고, 메세지 말풍선을 형상화한 모양이다"
								className="inset-0 h-8 w-8 object-cover"
							/>
							미니 로그
						</div>
					</div>
				</Link>
				<div className="flex items-center gap-4">
					<ThemeButton />
					<NotificationButton />
					<ProfileButton />
				</div>
			</div>
		</header>
	);
}
