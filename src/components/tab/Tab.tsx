export type TabCategory = 'all' | 'date';

const TAB_CATEGORIES: { type: TabCategory; label: string }[] = [
	{ type: 'all', label: '전체 게시글' },
	{ type: 'date', label: '날짜별 게시글' }
];
export default function Tab({
	value,
	onChange
}: {
	value: TabCategory;
	onChange: (tab: TabCategory) => void;
}) {
	const handleTabClick = (tab: TabCategory) => {
		onChange(tab);
	};

	return (
		<div className="flex w-full items-center justify-center gap-4">
			{TAB_CATEGORIES.map(tab => {
				return (
					<button
						className={`border-muted flex-1 border-b-4 ${value === tab.type ? 'border-primary' : ''}`}
						key={tab.type}
						onClick={() => handleTabClick(tab.type)}>
						<span
							className={`text-sm ${value === tab.type ? 'text-black' : 'text-gray-300'}`}>
							{tab.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
