import { Input } from '@/components/ui/input';
import { AuthFormLayout, AuthSubmitButton } from '@/components/auth';
import { useRequestPasswordResetEmail } from '@/hooks/mutations/auth/useRequestPasswordResetEmail';

import { generateErrorMessage } from '@/lib/error';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ForgetPasswordPage() {
	const [email, setEmail] = useState('');
	const {
		mutate: requestPasswordResetEmail,
		isPending: isRequestPasswordEmailPending
	} = useRequestPasswordResetEmail({
		onSuccess: () => {
			toast.info('인증 메일이 발송되었습니다.', {
				position: 'top-center'
			});
			setEmail('');
		},
		onError: error => {
			const message = generateErrorMessage(error);
			toast.error(message, {
				position: 'top-center'
			});
			setEmail('');
		}
	});

	const handleSendEmailClick = () => {
		if (email.trim() === '') return;
		requestPasswordResetEmail(email);
	};
	return (
		<AuthFormLayout
			title="비밀번호를 잊으셨나요?"
			description="이메일로 비밀번호를 재설정 할 수 있는 인증 링크를 보내드립니다.">
			<Input
				value={email}
				onChange={e => {
					setEmail(e.target.value);
				}}
				disabled={isRequestPasswordEmailPending}
				className="py-6"
				placeholder="example@abc.com"
			/>
			<AuthSubmitButton
				disabled={isRequestPasswordEmailPending}
				type="button"
				onClick={handleSendEmailClick}>
				인증 메일 요청하기
			</AuthSubmitButton>
		</AuthFormLayout>
	);
}
