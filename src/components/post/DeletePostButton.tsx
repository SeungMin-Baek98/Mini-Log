import { Button } from '../ui/button';
import { useOpenAlertModal } from '@/store/alertModal';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

import useDeletePost from '@/hooks/mutations/post/useDeletePost';

export default function DeletePostButton({ id }: { id: number }) {
	const openAlertModal = useOpenAlertModal();
	const navigate = useNavigate();

	const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
		onSuccess: () => {
			const pathname = window.location.pathname;
			if (pathname.startsWith(`/post/${id}`)) {
				navigate('/', { replace: true });
			}
		},
		onError: error => {
			toast.error('포스트 삭제에 실패했습니다', {
				position: 'top-center'
			});
		}
	});
	const handleDeleteClick = () => {
		openAlertModal({
			title: '포스트 삭제',
			description: '삭제된 포스트는 되돌릴 수 없습니다. 정말 삭제하시겠습니까?',
			onPositive: () => {
				deletePost(id);
			}
		});
	};

	return (
		<Button
			disabled={isDeletePostPending}
			className="cursor-pointer"
			variant={'ghost'}
			onClick={handleDeleteClick}>
			삭제
		</Button>
	);
}
