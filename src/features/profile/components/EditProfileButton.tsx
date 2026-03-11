import { useOpenProfileEditorModal } from '@/store/profileEditorModal';
import { Button } from '@/components/ui/button';

export default function EditProfileButton({
	className
}: {
	className?: string;
}) {
	const openProfileEditorModal = useOpenProfileEditorModal();

	return (
		<Button
			variant="secondary"
			className={`cursor-pointer ${className}`}
			onClick={openProfileEditorModal}>
			프로필 수정
		</Button>
	);
}
