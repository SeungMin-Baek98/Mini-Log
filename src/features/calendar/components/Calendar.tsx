import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CircleIcon } from 'lucide-react';
import { format, getDay, isSameMonth } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';

import { useCalendar } from '@/features/calendar/hooks/useCalendar';
import { getBgColorByPostCount } from '@/lib/color';
import { usePostCountByDate } from '@/features/profile/hooks/queries/usePostCountByDate';
import { cn } from '@/lib/utils';

type props = {
	value?: Date | null;
	onChange?: (date: Date | null) => void;
	userId: string;
};

export default function Calendar({ value, onChange, userId }: props) {
	const weekDayLabels = ['일', '월', '화', '수', '목', '금', '토'];
	const [direction, setDirection] = useState<'PREV' | 'NEXT'>('NEXT');
	const {
		cursor,
		weekDays,
		start,
		end,
		nextWeek,
		prevWeek,
		selectDate,
		isSelected,
		goToDate
	} = useCalendar();

	const { data: postCountByDate } = usePostCountByDate({
		userId,
		start,
		end
	});

	const handleSelect = (day: Date) => {
		selectDate(day);
		onChange?.(day);
	};
	const handlePrevWeekClick = () => {
		setDirection('PREV');
		prevWeek();
	};
	const handleNextWeekClick = () => {
		setDirection('NEXT');
		nextWeek();
	};

	useEffect(() => {
		if (!value) {
			selectDate(null);
			return;
		}

		selectDate(value);
		goToDate(value);
	}, [value, selectDate, goToDate]);

	const postCount = useMemo(() => {
		const countMap: Record<string, number> = {};
		if (postCountByDate) {
			postCountByDate.forEach(post => {
				const dateKey = format(new Date(post.created_at), 'yyyy-MM-dd');
				countMap[dateKey] = (countMap[dateKey] || 0) + 1;
			});
		}
		return countMap;
	}, [postCountByDate]);

	return (
		<div className="bg-muted flex w-full flex-col gap-4 rounded-xl border py-4 shadow-sm sm:p-4">
			<div className="text-muted-foreground text-center text-sm font-semibold">
				{format(cursor, 'yyyy.MM')}
			</div>

			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={handlePrevWeekClick}
					aria-label="이전 주"
					className="text-muted-foreground hover:bg-muted-foreground hover:text-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm transition">
					<ChevronLeft />
				</button>

				<div className="relative flex-1 overflow-hidden">
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={format(start, 'yyyy-MM-dd')}
							className="grid grid-cols-7 gap-2"
							initial={{
								opacity: 0,
								x: direction === 'NEXT' ? 24 : -24
							}}
							animate={{ opacity: 1, x: 0 }}
							exit={{
								opacity: 0,
								x: direction === 'NEXT' ? -24 : 24
							}}
							transition={{ duration: 0.2, ease: 'easeOut' }}>
							{weekDays.map(day => {
								const dateKey = format(day, 'yyyy-MM-dd');
								const isCurrentMonth = isSameMonth(day, cursor);

								return (
									<button
										type="button"
										onClick={() => handleSelect(day)}
										key={day.toISOString()}
										className={cn(
											'hover:bg-muted-foreground/80 flex min-w-0 flex-col items-center justify-center rounded-lg px-1 py-3 text-center transition',
											isSelected(day)
												? 'bg-muted-foreground text-primary-foreground'
												: isCurrentMonth
													? 'text-foreground'
													: 'text-muted-foreground'
										)}>
										<span
											className={cn(
												'text-[11px] font-medium',
												isSelected(day)
													? 'text-primary-foreground/80'
													: 'text-muted-foreground'
											)}>
											{weekDayLabels[getDay(day)]}
										</span>
										<span className="mt-1 text-sm font-semibold">
											{format(day, 'dd')}
										</span>
										<CircleIcon
											className={cn(
												'mt-2 h-2 w-2 rounded-full',
												getBgColorByPostCount(postCount[dateKey] || 0),
												isSelected(day) && 'opacity-90'
											)}
										/>
									</button>
								);
							})}
						</motion.div>
					</AnimatePresence>
				</div>

				<button
					type="button"
					onClick={handleNextWeekClick}
					aria-label="다음 주"
					className="text-muted-foreground hover:bg-muted-foreground hover:text-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm transition">
					<ChevronRight />
				</button>
			</div>
		</div>
	);
}
