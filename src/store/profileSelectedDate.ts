import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

type State = {
	selectedDate: Date | null;
};

const initialState: State = {
	selectedDate: null
};

const useProfileSelectedDateStore = create(
	devtools(
		combine(initialState, set => ({
			actions: {
				setSelectedDate: (date: Date | null) => set({ selectedDate: date }),
				clear: () => set({ selectedDate: null })
			}
		})),
		{ name: 'ProfileSelectedDateStore' }
	)
);

export const useProfileSelectedDate = () => {
	const store = useProfileSelectedDateStore();

	return store as typeof store & State;
};
