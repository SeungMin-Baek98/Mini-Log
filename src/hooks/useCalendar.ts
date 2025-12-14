import { format, startOfWeek } from 'date-fns';

export const useCalendar = (selectedDate: Date) => {
	const weekDays = [];
	const weekStartDate = startOfWeek(new Date());

	for (let i = 0; i < 7; i++) {
		const day = new Date(weekStartDate);
		day.setDate(weekStartDate.getDate() + i);
		weekDays.push({
			date: day,
			formatted: format(day, 'EEEE, MMMM do')
		});
	}

	return { weekDays };
};
