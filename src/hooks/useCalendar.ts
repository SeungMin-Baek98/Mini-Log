import { useState, useCallback } from 'react';
import {
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	addWeeks,
	subWeeks
} from 'date-fns';

export function useCalendar(initialDate = new Date()) {
	const [cursor, setCursor] = useState(initialDate);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const start = startOfWeek(cursor, { weekStartsOn: 0 });
	const end = endOfWeek(cursor, { weekStartsOn: 0 });
	const weekDays = eachDayOfInterval({ start, end });

	/**
	 * 다음 주로 이동
	 */
	const nextWeek = useCallback(
		() => setCursor(current => addWeeks(current, 1)),
		[]
	);

	/**
	 * 이전 주로 이동
	 */
	const prevWeek = useCallback(
		() => setCursor(current => subWeeks(current, 1)),
		[]
	);

	/**
	 * 날짜 선택
	 * @param date 선택할 날짜
	 */
	const selectDate = useCallback((date: Date | null) => {
		setSelectedDate(date);
	}, []);

	/**
	 * 특정 날짜가 포함된 주로 이동
	 * @param date 이동할 기준 날짜
	 */
	const goToDate = useCallback((date: Date) => {
		setCursor(date);
	}, []);

	/**
	 * 특정 날짜가 선택된 날짜인지 확인
	 * @param date 확인할 날짜
	 * @returns 선택된 날짜면 true, 아니면 false
	 */
	const isSelected = useCallback(
		(date: Date) => (selectedDate ? isSameDay(date, selectedDate) : false),
		[selectedDate]
	);

	return {
		cursor,
		weekDays,
		start,
		end,
		nextWeek,
		prevWeek,
		isSameMonth,
		selectDate,
		goToDate,
		isSelected
	};
}
