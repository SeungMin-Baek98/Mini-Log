import PostEditorModal from '@/components/modal/PostEditorModal';
import { createPortal } from 'react-dom';

export default function ModalProvider({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{createPortal(
				<PostEditorModal />,
				document.getElementById('modal-root')!
			)}
			{children}
		</>
	);
}
