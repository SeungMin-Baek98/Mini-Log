import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

import type { WeeklyRecapData } from '@/types';

type State = {
	isOpen: boolean;
	data: WeeklyRecapData | null;
	currentStepIndex: number;
};

const initialState: State = {
	isOpen: false,
	data: null,
	currentStepIndex: 0
};

const useWeeklyRecapModalStore = create(
	devtools(
		combine(initialState, set => ({
			actions: {
				open: (data: WeeklyRecapData) => {
					set({
						isOpen: true,
						data,
						currentStepIndex: 0
					});
				},
				nextStep: () => {
					set(state => {
						if (!state.data) return state;
						if (state.data.steps.length === 0) return state;

						const upperBound = Math.max(0, state.data.steps.length - 1);
						const nextIndex = Math.min(state.currentStepIndex + 1, upperBound);
						return { ...state, currentStepIndex: nextIndex };
					});
				},
				prevStep: () => {
					set(state => {
						if (!state.data) return state;
						const prevIndex = Math.max(state.currentStepIndex - 1, 0);
						return { ...state, currentStepIndex: prevIndex };
					});
				},
				close: () => {
					set({ isOpen: false });
				},
				reset: () => {
					set(initialState);
				}
			}
		})),
		{ name: 'weeklyRecapModalStore' }
	)
);

export const useWeeklyRecapModal = () => {
	const store = useWeeklyRecapModalStore();
	return store as typeof store & State;
};

export const useWeeklyRecapModalActions = () => {
	const actions = useWeeklyRecapModalStore(store => store.actions);
	return actions;
};
