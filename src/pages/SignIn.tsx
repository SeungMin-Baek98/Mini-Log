import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignInWithPassword } from '@/hooks/mutations/use-sign-in-with-password';

import gitHubLogo from '@/assets/github-mark.svg';
import { useSignInWithOAuth } from '@/hooks/mutations/use-sign-in-with-OAuth';

export default function SignUpPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { mutate: signInWithPassword } = useSignInWithPassword();
	const { mutate: signInWithOAuth } = useSignInWithOAuth();

	const handleSignInWithPasswordClick = () => {
		if (email.trim() === '') return;
		if (password.trim() === '') return;

		signInWithPassword({ email, password });
	};

	const handleSignInWithGithubClick = () => {
		signInWithOAuth('github');
	};

	const handleSignInWithKakaoClick = () => {
		signInWithOAuth('kakao');
	};

	const handleSignInWithGoogleClick = () => {
		signInWithOAuth('google');
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="text-xl font-bold">로그인</div>
			<div className="flex flex-col gap-2">
				<Input
					value={email}
					onChange={e => {
						setEmail(e.target.value);
					}}
					className="py-6"
					type="email"
					placeholder="example@abc.com"
				/>
				<Input
					value={password}
					onChange={e => {
						setPassword(e.target.value);
					}}
					className="py-6"
					type="password"
					placeholder="password"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Button className="w-full" onClick={handleSignInWithPasswordClick}>
					로그인
				</Button>
				<Button className="w-full" variant={'outline'} onClick={handleSignInWithGithubClick}>
					<img src={gitHubLogo} className="h-4 w-4" />
					Github 계정으로 로그인
				</Button>

				<Button className="w-full" variant={'outline'} onClick={handleSignInWithKakaoClick}>
					카카오 계정으로 로그인
				</Button>
				<Button className="w-full" variant={'outline'} onClick={handleSignInWithGoogleClick}>
					구글 계정으로 로그인
				</Button>
			</div>

			<div>
				<Link className="text-muted-foreground hover:underline" to={'/sign-up'}>
					계정이 없으시다면? 회원가입
				</Link>
			</div>
		</div>
	);
}
