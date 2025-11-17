import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignInWithPassword } from '@/hooks/mutations/use-sign-in-with-password';
import { useSignInWithOAuth } from '@/hooks/mutations/use-sign-in-with-OAuth';
import { generateErrorMessage } from '@/lib/error';

import gitHubLogo from '@/assets/github-mark.svg';
import googleLogo from '@/assets/google-icon.png';
import kakaoLogo from '@/assets/kakaotalk_sharing_btn_small.png';

export default function SignUpPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
		useSignInWithPassword({
			onError: error => {
				const message = generateErrorMessage(error);
				toast.error(message, {
					position: 'top-center'
				});

				setPassword('');
			}
		});
	const { mutate: signInWithOAuth, isPending: isSignInWithOAuthPending } =
		useSignInWithOAuth({
			onError: error => {
				const message = generateErrorMessage(error);
				toast.error(message, {
					position: 'top-center'
				});
			}
		});

	/** 이메일 & 비밀번호 로그인 */
	const handleSignInWithPasswordClick = () => {
		if (email.trim() === '') return;
		if (password.trim() === '') return;

		signInWithPassword({ email, password });
	};

	/** 깃허브 로그인 */
	const handleSignInWithGithubClick = () => {
		signInWithOAuth('github');
	};

	/** 카카오 로그인 */
	const handleSignInWithKakaoClick = () => {
		signInWithOAuth('kakao');
	};

	/** 구글 로그인 */
	const handleSignInWithGoogleClick = () => {
		signInWithOAuth('google');
	};

	const isPending = isSignInWithPasswordPending || isSignInWithOAuthPending;
	return (
		<div className="flex flex-col gap-9">
			<div className="text-xl font-bold">로그인</div>
			<div className="flex flex-col gap-2">
				<Input
					disabled={isPending}
					value={email}
					onChange={e => {
						setEmail(e.target.value);
					}}
					className="py-6"
					type="email"
					placeholder="example@abc.com"
				/>
				<Input
					disabled={isPending}
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
				<Button
					disabled={isPending}
					className="w-full"
					onClick={handleSignInWithPasswordClick}>
					로그인
				</Button>
				<div className="flex flex-col gap-9">
					<div className="border-t border-solid border-gray-400 pt-4 text-xl font-bold">
						소셜 로그인
					</div>
					<div className="flex flex-col gap-2">
						<Button
							disabled={isPending}
							className="w-full truncate"
							variant={'outline'}
							onClick={handleSignInWithGithubClick}>
							<img src={gitHubLogo} className="h-4 w-4" />
							Github 계정으로 로그인
						</Button>
						<Button
							disabled={isPending}
							className="w-full truncate"
							variant={'outline'}
							onClick={handleSignInWithGoogleClick}>
							<img src={googleLogo} className="h-4 w-4" />
							Google 계정으로 로그인
						</Button>
						<Button
							disabled={isPending}
							className="w-full truncate"
							variant={'outline'}
							onClick={handleSignInWithKakaoClick}>
							<img src={kakaoLogo} className="h-4 w-4" />
							Kakao 계정으로 로그인
						</Button>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Link className="text-muted-foreground hover:underline" to={'/sign-up'}>
					계정이 없으시다면? 회원가입
				</Link>
				<Link
					className="text-muted-foreground hover:underline"
					to={'/forget-password'}>
					비밀번호를 잊으셨나요?
				</Link>
			</div>
		</div>
	);
}
