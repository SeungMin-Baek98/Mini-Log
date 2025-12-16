import { useMemo, useState, useCallback } from 'react';
import {
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	format
} from 'date-fns';

export function useCalendar(initialDate = new Date()) {
	const [cursor, setCursor] = useState(initialDate);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
	const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });

	const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

	const weeks = useMemo(() => {
		const daysForEach: Date[][] = [];
		for (let i = 0; i < days.length; i += 7)
			daysForEach.push(days.slice(i, i + 7));
		return daysForEach;
	}, [days]);

	const nextMonth = useCallback(
		() => setCursor(addMonths(cursor, 1)),
		[cursor]
	);

	const prevMonth = useCallback(
		() => setCursor(subMonths(cursor, 1)),
		[cursor]
	);

	const selectDate = useCallback((date: Date) => {
		setSelectedDate(date);
	}, []);

	const isSelected = useCallback(
		(date: Date) => (selectedDate ? isSameDay(date, selectedDate) : false),
		[selectedDate]
	);

	return {
		cursor,
		weeks,
		nextMonth,
		prevMonth,
		isSameMonth,
		isSameDay,
		selectDate,
		isSelected,
		format
	};
}
