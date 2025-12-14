import { useCalendar } from '@/hooks/useCalendar';

export default function Calendar() {
	const { weekDays } = useCalendar(new Date());
	return (
		<div>
			{weekDays.map(day => (
				<div key={day.formatted}>{day.formatted}</div>
			))}
		</div>
	);
}
