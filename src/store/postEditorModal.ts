import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

type CreateMode = {
	isOpen: true;
	type: 'CREATE';
};

type EditMode = {
	isOpen: true;
	type: 'EDIT';
	postId: number;
	content: string;
	imageUrls: string[] | null;
};

type OpenState = CreateMode | EditMode;

type CloseState = {
	isOpen: false;
};

type State = CloseState | OpenState;

const initialState = {
	isOpen: false
} as State;

const usePostEditorModalStore = create(
	devtools(
		combine(initialState, set => ({
			actions: {
				openCreate: () => {
					set({ isOpen: true, type: 'CREATE' });
				},
				openEdit: (param: Omit<EditMode, 'isOpen' | 'type'>) => {
					set({
						isOpen: true,
						type: 'EDIT',
						...param
					});
				},
				close: () => {
					set({ isOpen: false });
				}
			}
		})),
		{ name: 'postEditorModalStore' }
	)
);

/** PostEditorModal 창 open 커스텀 훅(게시글 생성) */
export const useOpenCreatePostModal = () => {
	const openCreate = usePostEditorModalStore(store => store.actions.openCreate);

	return openCreate;
};

/** PostEditorModal 창 open 커스텀 훅(게시글 수정) */
export const useOpenEditPostModal = () => {
	const openEdit = usePostEditorModalStore(store => store.actions.openEdit);

	return openEdit;
};

/** PostEditorModal 상태 커스텀 훅 */
export const usePostEditorModal = () => {
	const store = usePostEditorModalStore();

	return store as typeof store & State;
};
