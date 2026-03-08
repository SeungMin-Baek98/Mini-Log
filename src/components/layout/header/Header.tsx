import { Link } from 'react-router';

import logo from '@/assets/logo.png';
import ThemeButton from './ThemeButton';
import ProfileButton from './ProfileButton';
import NotificationButton from './NotificationButton';

export default function Header() {
	return (
		<header className="h-15 border-b px-4 sm:px-0">
			<div className="m-auto flex h-full w-full max-w-175 justify-between">
				<Link to={'/'} className="flex items-center gap-2">
					<img
						src={logo}
						alt="미니 로그의 로고, 메세지 말풍선을 형상화한 모양이다"
						className="w-5"
					/>
					<div className="font-bold">미니 로그</div>
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
