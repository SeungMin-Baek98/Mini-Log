import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../lib/utils';

interface PaginationProps {
	className?: string;
	currentPage: number;
	onPageChange: (page: number) => void;
	totalPages: number;
}

function getPageItems(
	currentPage: number,
	totalPages: number
): ('ellipsis-end' | 'ellipsis-start' | number)[] | null {
	if (totalPages <= 0) return null;

	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	if (currentPage <= 4) {
		return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
	}

	if (currentPage >= totalPages - 3) {
		return [
			1,
			'ellipsis-start',
			totalPages - 4,
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages
		];
	}

	return [
		1,
		'ellipsis-start',
		currentPage - 1,
		currentPage,
		currentPage + 1,
		'ellipsis-end',
		totalPages
	];
}

function Pagination({
	className,
	currentPage,
	onPageChange,
	totalPages
}: PaginationProps) {
	const pageItems = getPageItems(currentPage, totalPages);
	const showPrev = currentPage > 1;
	const showNext = currentPage < totalPages;

	const navButtonStyle =
		'text-input-text hover:bg-primary-100 focus-visible:ring-ring/50 flex size-9 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 md:size-10';

	if (pageItems === null) return null;

	return (
		<nav
			aria-label="페이지네이션"
			className={cn(
				'text-body-1 flex items-center justify-center gap-1 md:gap-2',
				className
			)}>
			<button
				type="button"
				disabled={!showPrev}
				aria-label="이전 페이지"
				onClick={() => onPageChange(currentPage - 1)}
				className={cn(navButtonStyle, !showPrev && 'invisible')}>
				<ChevronLeft className="size-4 md:size-5" />
			</button>

			{pageItems.map(item => {
				if (typeof item === 'string') {
					return (
						<span
							key={item}
							className="text-input-text flex size-9 items-center justify-center select-none md:size-10"
							aria-hidden="true">
							...
						</span>
					);
				}

				const isActive = item === currentPage;

				return (
					<button
						key={item}
						type="button"
						disabled={isActive}
						aria-label={`${item} 페이지`}
						aria-current={isActive ? 'page' : undefined}
						onClick={() => onPageChange(item)}
						className={cn(
							navButtonStyle,
							isActive && 'bg-primary hover:bg-unset cursor-default text-white'
						)}>
						{item}
					</button>
				);
			})}

			<button
				type="button"
				disabled={!showNext}
				aria-label="다음 페이지"
				onClick={() => onPageChange(currentPage + 1)}
				className={cn(navButtonStyle, !showNext && 'invisible')}>
				<ChevronRight className="size-4 md:size-5" />
			</button>
		</nav>
	);
}

export { Pagination };
export type { PaginationProps };
