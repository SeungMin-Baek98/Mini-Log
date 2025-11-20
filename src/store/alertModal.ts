import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

type OpenState = {
	isOpen: true;
	title: string;
	description: string;
	onPositive?: () => void;
	onNegative?: () => void;
};

type CloseState = {
	isOpen: false;
};

type State = CloseState | OpenState;

const initialState = {
	isOpen: false
} as State;

const useAlertModalStore = create(
	devtools(
		combine(initialState, set => ({
			actions: {
				open: (parmas: Omit<OpenState, 'isOpen'>) => {
					set({ ...parmas, isOpen: true });
				},
				close: () => {
					set({ isOpen: false });
				}
			}
		})),
		{ name: 'AlertModalStore' }
	)
);

/** Alert창 open 커스텀 훅 */
export const useOpenAlertModal = () => {
	const open = useAlertModalStore(store => store.actions.open);
	return open;
};

export const useAlertModal = () => {
	const store = useAlertModalStore();
	return store as typeof store & State;
};
