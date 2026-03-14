import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import {
	AuthFieldGroup,
	AuthFormLayout,
	AuthLinkList,
	AuthSubmitButton,
	SocialLoginButton
} from '@/features/auth/components';
import { generateErrorMessage } from '@/lib/error';
import { useSignInWithPassword } from '@/features/auth/hooks/mutations/useSignInWithPassword';
import { useSignInWithOAuth } from '@/features/auth/hooks/mutations/useSignInWithOAuth';

import gitHubLogo from '@/assets/github-mark.svg';
import googleLogo from '@/assets/google-icon.png';
import kakaoLogo from '@/assets/kakaotalk_sharing_btn_small.png';

export default function SignInPage() {
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
	const handleSignInWithPassword = () => {
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
		<AuthFormLayout
			title="로그인"
			className="gap-9"
			contentClassName="gap-0"
			onSubmit={e => {
				e.preventDefault();
				handleSignInWithPassword();
			}}>
			<AuthFieldGroup>
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
			</AuthFieldGroup>
			<AuthFieldGroup>
				<AuthSubmitButton
					disabled={isPending}
					type="submit"
					className="mt-10">
					로그인
				</AuthSubmitButton>
				<div className="flex flex-col gap-9">
					<div className="border-t border-solid border-gray-400 pt-4 text-xl font-bold">
						소셜 로그인
					</div>
					<AuthFieldGroup>
						<SocialLoginButton
							disabled={isPending}
							type="button"
							onClick={handleSignInWithGithubClick}>
							<img src={gitHubLogo} className="h-4 w-4" />
							Github 계정으로 로그인
						</SocialLoginButton>
						<SocialLoginButton
							disabled={isPending}
							type="button"
							onClick={handleSignInWithGoogleClick}>
							<img src={googleLogo} className="h-4 w-4" />
							Google 계정으로 로그인
						</SocialLoginButton>
						<SocialLoginButton
							disabled={isPending}
							type="button"
							onClick={handleSignInWithKakaoClick}>
							<img src={kakaoLogo} className="h-4 w-4" />
							Kakao 계정으로 로그인
						</SocialLoginButton>
					</AuthFieldGroup>
				</div>
			</AuthFieldGroup>

			<AuthLinkList className="mt-4">
				<Link className="text-muted-foreground hover:underline" to={'/sign-up'}>
					계정이 없으시다면? 회원가입
				</Link>
				<Link
					className="text-muted-foreground hover:underline"
					to={'/forget-password'}>
					비밀번호를 잊으셨나요?
				</Link>
			</AuthLinkList>
		</AuthFormLayout>
	);
}
