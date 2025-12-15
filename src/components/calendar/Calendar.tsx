import { useCalendar } from '@/hooks/useCalendar';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

type props = {
	value?: Date | null;
	onChange?: (date: Date) => void;
};

export default function Calendar({ value, onChange }: props) {
	const { cursor, weeks, nextMonth, prevMonth, selectDate, isSelected } =
		useCalendar();

	const handleSelect = (day: Date) => {
		selectDate(day);
		onChange?.(day);
	};

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
											: 'hover:bg-muted'
									].join(' ')}>
									{format(day, 'd')}
								</button>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
