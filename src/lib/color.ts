export function getBgColorByPostLength(postLength: number) {
	if (postLength >= 5) return 'bg-chart-5';

	switch (postLength) {
		case 1:
			return 'bg-chart-1';
		case 2:
			return 'bg-chart-2';
		case 3:
			return 'bg-chart-3';
		case 4:
			return 'bg-chart-4';

		default:
			return 'bg-muted';
	}
}
