import { useOpenProfileEditorModal } from '@/store/profileEditorModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function EditProfileButton({
	className
}: {
	className?: string;
}) {
	const openProfileEditorModal = useOpenProfileEditorModal();

	return (
		<Button
			variant="secondary"
			className={cn('cursor-pointer', className)}
			onClick={openProfileEditorModal}>
			프로필 수정
		</Button>
	);
}
