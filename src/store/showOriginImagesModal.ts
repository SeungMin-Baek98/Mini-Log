import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

type OpenState = {
	isOpen: true;
	images: string[];
	initialIndex: number;
};

type CloseState = {
	isOpen: false;
};

type State = CloseState | OpenState;

const initialState = {
	isOpen: false
} as State;

const useShowOriginImagesModalStore = create(
	devtools(
		combine(initialState, set => ({
			actions: {
				open: ({
					images,
					initialIndex = 0
				}: {
					images: string[];
					initialIndex?: number;
				}) => {
					if (images.length === 0) return;

					const safeIndex = Math.min(
						Math.max(initialIndex, 0),
						images.length - 1
					);

					set({
						isOpen: true,
						images,
						initialIndex: safeIndex
					});
				},
				close: () => {
					set({ isOpen: false });
				}
			}
		})),
		{ name: 'ShowOriginImagesModalStore' }
	)
);

export const useOpenShowOriginImagesModal = () => {
	const open = useShowOriginImagesModalStore(store => store.actions.open);

	return open;
};

export const useShowOriginImagesModal = () => {
	const store = useShowOriginImagesModalStore();

	return store as typeof store & State;
};
