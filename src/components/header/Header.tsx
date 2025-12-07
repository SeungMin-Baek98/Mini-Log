import { SunIcon } from 'lucide-react';
import { Link } from 'react-router';

import logo from '@/assets/logo.png';
import ProfileButton from './ProfileButton';

export default function Header() {
	return (
		<header className="h-15 border-b">
			<div className="m-auto flex h-full w-full max-w-175 justify-between px-4">
				<Link to={'/'} className="flex items-center gap-2">
					<img
						src={logo}
						alt="한입 로그의 로고, 메세지 말풍선을 형상화한 모양이다"
						className="w-5"
					/>
					<div className="font-bold">한입 로그</div>
				</Link>
				<div className="flex items-center gap-5">
					<div className="hover:bg-muted cursor-pointer rounded-full p-2">
						<SunIcon />
					</div>
					<ProfileButton />
				</div>
			</div>
		</header>
	);
}
