import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

type State = {
	selectedDate: Date | null;
	selectedUserId: string | null;
};

const initialState: State = {
	selectedDate: null,
	selectedUserId: null
};

const useProfileSelectedDateStore = create(
	devtools(
		combine(initialState, set => ({
			actions: {
				setSelectedDate: (date: Date | null, userId: string | null) =>
					set({ selectedDate: date, selectedUserId: userId }),
				clear: () => set(initialState)
			}
		})),
		{ name: 'ProfileSelectedDateStore' }
	)
);

export const useProfileSelectedDate = () => {
	const store = useProfileSelectedDateStore();

	return store as typeof store & State;
};
