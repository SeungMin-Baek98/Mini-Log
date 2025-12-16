import { useMemo } from 'react';
import { CircleIcon } from 'lucide-react';
import { endOfMonth, format, isSameMonth, startOfMonth } from 'date-fns';

import { useCalendar } from '@/hooks/useCalendar';
import { getBgColorByPostLength } from '@/lib/color';
import { usePostCountByDate } from '@/hooks/queries/usePostCountByDate';

type props = {
	value?: Date | null;
	onChange?: (date: Date) => void;
	userId: string;
};

export default function Calendar({ value, onChange, userId }: props) {
	const { cursor, weeks, nextMonth, prevMonth, selectDate, isSelected } =
		useCalendar();
	const start = startOfMonth(cursor);
	const end = endOfMonth(cursor);

	const { data: postCountByDate } = usePostCountByDate({
		userId,
		start,
		end
	});

	const handleSelect = (day: Date) => {
		selectDate(day);
		onChange?.(day);
	};

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
		<div className="w-[360px] rounded-xl border bg-white p-4 shadow-sm">
			{/* Header */}
			<header className="mb-4 flex items-center justify-between">
				<button
					onClick={prevMonth}
					className="text-muted-foreground hover:bg-muted rounded-md px-2 py-1 text-sm">
					◀
				</button>

				<span className="text-sm font-semibold">
					{format(cursor, 'yyyy.MM')}
				</span>

				<button
					onClick={nextMonth}
					className="text-muted-foreground hover:bg-muted rounded-md px-2 py-1 text-sm">
					▶
				</button>
			</header>

			{/* Days */}
			<div className="text-muted-foreground mb-2 grid grid-cols-7 text-center text-xs font-medium">
				{['일', '월', '화', '수', '목', '금', '토'].map(d => (
					<span key={d}>{d}</span>
				))}
			</div>

			{/* Dates */}
			<div className="space-y-1">
				{weeks.map((week, wi) => (
					<div key={wi} className="grid grid-cols-7 gap-1">
						{week.map(day => {
							return (
								<button
									onClick={() => handleSelect(day)}
									key={day.toISOString()}
									className={[
										'flex h-9 w-9 items-center justify-center rounded-md text-sm transition',
										isSelected(day)
											? 'bg-primary text-primary-foreground'
											: isSameMonth(day, cursor)
												? 'text-muted-foreground'
												: 'text-muted-foreground/30'
									].join(' ')}>
									<div className="flex flex-col items-center justify-center gap-1">
										{format(day, 'd')}

										<CircleIcon
											className={`h-2 w-2 rounded-full ${getBgColorByPostLength(postCount[format(day, 'yyyy-MM-dd')] || 0)}`}
										/>
									</div>
								</button>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
