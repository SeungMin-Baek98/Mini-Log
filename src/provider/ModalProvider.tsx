import { createPortal } from 'react-dom';

import PostEditorModal from '@/components/modal/PostEditorModal';

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
