import { createPortal } from 'react-dom';

import PostEditorModal from '@/components/modal/PostEditorModal';
import AlertModal from '@/components/modal/AlertModal';
import ProfileEditorModal from '@/components/modal/ProfileEditorModal';

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
					<ProfileEditorModal />
				</>,
				document.getElementById('modal-root')!
			)}
			{children}
		</>
	);
}
