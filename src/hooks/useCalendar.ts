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

	/**
	 * 달력에 표시할 시작일과 종료일
	 * 예: 2023년 8월이면 7월 마지막 주 일요일 ~ 9월 첫째 주 토요일
	 */
	const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
	const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });

	/**
	 * 달력에 표시할 날짜들
	 * 예: 2023년 8월이면 7월 마지막 주 일요일 ~ 9월 첫째 주 토요일
	 */
	const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

	/**
	 * 각 주차별로 날짜들을 나눈 배열
	 */
	const weeks = useMemo(() => {
		const daysForEach: Date[][] = [];
		for (let i = 0; i < days.length; i += 7)
			daysForEach.push(days.slice(i, i + 7));
		return daysForEach;
	}, [days]);

	/**
	 * 다음 달로 이동
	 * 예: 2023년 8월 -> 2023년 9월
	 */
	const nextMonth = useCallback(
		() => setCursor(addMonths(cursor, 1)),
		[cursor]
	);

	/**
	 * 이전 달로 이동
	 * 예: 2023년 8월 -> 2023년 7월
	 */
	const prevMonth = useCallback(
		() => setCursor(subMonths(cursor, 1)),
		[cursor]
	);

	/**
	 * 날짜 선택
	 * @param date 선택할 날짜
	 */
	const selectDate = useCallback((date: Date | null) => {
		setSelectedDate(date);
	}, []);

	/**
	 * 특정 달로 이동
	 * @param date 이동할 달의 날짜
	 */
	const goToMonth = useCallback((date: Date) => {
		setCursor(startOfMonth(date));
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
		weeks,
		nextMonth,
		prevMonth,
		isSameMonth,
		isSameDay,
		selectDate,
		goToMonth,
		isSelected,
		format
	};
}
