import { motion } from 'motion/react';

export type TabCategory = 'all' | 'date';

const TAB_CATEGORIES: { type: TabCategory; label: string }[] = [
	{ type: 'all', label: '전체 게시글' },
	{ type: 'date', label: '날짜별 게시글' }
];
function Tab({
	value,
	onChange
}: {
	value: TabCategory;
	onChange: (tab: TabCategory) => void;
}) {
	return (
		<div className="bg-muted grid w-full grid-cols-2 gap-2 rounded-xl p-1">
			{TAB_CATEGORIES.map(tab => {
				const isSelected = value === tab.type;

				return (
					<button
						type="button"
						key={tab.type}
						aria-pressed={isSelected}
						onClick={() => onChange(tab.type)}
						className={`relative flex items-center justify-center overflow-hidden rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
							isSelected
								? 'text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						}`}>
						{isSelected && (
							<motion.span
								layoutId="tab-slide-indicator"
								className="bg-background border-border absolute inset-0 rounded-lg border shadow-sm"
								transition={{
									type: 'spring',
									stiffness: 420,
									damping: 32
								}}
							/>
						)}
						<span
							className={`relative z-10 transition-transform duration-200 ${
								isSelected ? 'translate-y-0' : 'translate-y-[1px]'
							}`}>
							{tab.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}

export { Tab };
