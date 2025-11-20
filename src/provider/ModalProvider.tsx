import { createPortal } from 'react-dom';

import PostEditorModal from '@/components/modal/PostEditorModal';
import AlertModal from '@/components/modal/AlertModal';

export default function ModalProvider({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{createPortal(
				<>
					<PostEditorModal />
					<AlertModal />
				</>,
				document.getElementById('modal-root')!
			)}
			{children}
		</>
	);
}
