import { useOpenEditPostModal } from '@/store/postEditorModal';
import { Button } from '../ui/button';
import type { PostEntity } from '@/types';

export default function EditPostButton(props: PostEntity) {
	const openEditPostModal = useOpenEditPostModal();

	const handleButtonClick = () => {
		openEditPostModal({
			postId: props.id,
			content: props.content,
			imageUrls: props.image_urls
		});
	};

	return (
		<Button
			className="cursor-pointer"
			variant={'ghost'}
			onClick={handleButtonClick}>
			수정
		</Button>
	);
}
