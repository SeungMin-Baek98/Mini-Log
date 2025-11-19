import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<div className="text-xl font-bold">비밀번호를 재설정하기</div>
				<div className="text-muted-foreground">
					새로운 비밀번호를 입력하세요
				</div>
			</div>
			<Input
				disabled={isUpdatePasswordPending}
				value={password}
				onChange={e => setPassword(e.target.value)}
				className="py-6"
				placeholder="password"
				type="password"
			/>
			<Button
				className="w-full"
				disabled={isUpdatePasswordPending}
				onClick={handleUpdatePasswordClick}>
				비밀번호 재설정
			</Button>
		</div>
	);
}
