import { Input } from '@/components/ui/input';
import { AuthFormLayout, AuthSubmitButton } from '@/components/auth';
import { useUpdatePassword } from '@/hooks/mutations/auth/useUpdatePassword';

import { generateErrorMessage } from '@/lib/error';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
		useUpdatePassword({
			onSuccess: () => {
				toast.info('비밀번호가 성공적으로 변경되었습니다.', {
					position: 'top-center'
				});
				navigate('/');
			},
			onError: error => {
				const message = generateErrorMessage(error);
				toast.error(message, {
					position: 'top-center'
				});
				setPassword('');
			}
		});
	const handleUpdatePasswordClick = () => {
		if (password.trim() === '') return;
		updatePassword(password);
	};

	return (
		<AuthFormLayout
			title="비밀번호를 재설정하기"
			description="새로운 비밀번호를 입력하세요">
			<Input
				disabled={isUpdatePasswordPending}
				value={password}
				onChange={e => setPassword(e.target.value)}
				className="py-6"
				placeholder="password"
				type="password"
			/>
			<AuthSubmitButton
				disabled={isUpdatePasswordPending}
				type="button"
				onClick={handleUpdatePasswordClick}>
				비밀번호 재설정
			</AuthSubmitButton>
		</AuthFormLayout>
	);
}
