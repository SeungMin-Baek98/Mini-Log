import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { useWeeklyInsightHistoryData } from '@/features/insight/hooks/queries/useWeeklyInsightHistoryData';
import type { WeeklyRecapData } from '@/types';

const PAGE_SIZE = 5;

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '-';
	return date.toLocaleDateString('ko-KR');
}

function getSummaryMessage(recap: WeeklyRecapData) {
	const summaryStep = recap.steps.find(step => step.type === 'summary');
	if (summaryStep?.message) return summaryStep.message;

	const emptyStep = recap.steps.find(step => step.type === 'empty');
	if (emptyStep?.message) return emptyStep.message;

	return (
		recap.steps[recap.steps.length - 1]?.message ?? '요약 데이터가 없어요.'
	);
}

export default function WeeklyRecapArchiveModal({
	userId,
	open,
	onOpenChange
}: {
	userId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
	const [currentPage, setCurrentPage] = useState(1);
	const {
		data: recaps = [],
		isPending,
		error,
		refetch
	} = useWeeklyInsightHistoryData(userId, open);

	const sortedRecaps = useMemo(() => {
		return [...recaps].sort((a, b) => {
			const aTime = new Date(a.periodEnd).getTime();
			const bTime = new Date(b.periodEnd).getTime();
			const aValue = Number.isNaN(aTime) ? 0 : aTime;
			const bValue = Number.isNaN(bTime) ? 0 : bTime;

			return sortOrder === 'latest' ? bValue - aValue : aValue - bValue;
		});
	}, [recaps, sortOrder]);

	const totalPages = Math.ceil(sortedRecaps.length / PAGE_SIZE);
	const startIndex = (currentPage - 1) * PAGE_SIZE;
	const pagedRecaps = useMemo(
		() => sortedRecaps.slice(startIndex, startIndex + PAGE_SIZE),
		[sortedRecaps, startIndex]
	);

	useEffect(() => {
		if (open) {
			setCurrentPage(1);
		}
	}, [open]);

	useEffect(() => {
		const maxPage = Math.max(1, totalPages);
		if (currentPage > maxPage) {
			setCurrentPage(maxPage);
		}
	}, [currentPage, totalPages]);

	// Todo: 정렬 기능은 일단 제거, 추후 필요하면 다시 고민
	const handleToggleSortOrder = () => {
		setSortOrder(prev => (prev === 'latest' ? 'oldest' : 'latest'));
		setCurrentPage(1);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[85vh] max-w-[calc(100%-1.5rem)] gap-4 p-4 sm:max-w-4xl sm:p-6">
				<DialogHeader className="text-left">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="space-y-1">
							<DialogTitle>주간 회고 모아보기</DialogTitle>
							<DialogDescription>
								지금까지 받은 AI 주간 회고를 기간별로 확인할 수 있어요.
							</DialogDescription>
						</div>
						{/* Todo: 정렬 기능은 일단 제거, 추후 필요하면 다시 고민 */}
						{/* <Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleToggleSortOrder}>
							{sortOrder === 'latest' ? '최신순' : '오래된순'}
						</Button> */}
					</div>
				</DialogHeader>

				{isPending ? (
					<div className="text-muted-foreground flex min-h-40 items-center justify-center text-sm">
						주간 회고 목록을 불러오는 중이에요...
					</div>
				) : error ? (
					<div className="flex min-h-40 flex-col items-center justify-center gap-3">
						<p className="text-muted-foreground text-sm">
							주간 회고 목록을 불러오지 못했어요.
						</p>
						<Button variant="outline" onClick={() => refetch()}>
							다시 시도
						</Button>
					</div>
				) : recaps.length === 0 ? (
					<div className="text-muted-foreground flex min-h-40 items-center justify-center text-sm">
						아직 받은 주간 회고가 없어요.
					</div>
				) : (
					<div className="flex flex-col gap-4">
						<div className="max-h-[56vh] overflow-y-auto rounded-md border">
							<Table className="min-w-[760px]">
								<TableHeader>
									<TableRow>
										<TableHead className="min-w-[170px]">집계 기간</TableHead>
										<TableHead className="min-w-[300px]">한 줄 요약</TableHead>
										<TableHead className="min-w-[170px]">활동</TableHead>
										<TableHead className="min-w-[120px]">생성일</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pagedRecaps.map(record => (
										<TableRow key={record.id}>
											<TableCell className="whitespace-normal">
												<p className="font-medium">
													{formatDate(record.periodStart)}
												</p>
												<p className="text-muted-foreground text-xs">
													~ {formatDate(record.periodEnd)}
												</p>
											</TableCell>
											<TableCell className="max-w-[420px] text-sm leading-6 whitespace-normal">
												{getSummaryMessage(record.recap)}
											</TableCell>
											<TableCell className="text-sm whitespace-normal">
												<p>게시글 {record.recap.counts.posts}개</p>
												<p className="text-muted-foreground text-xs">
													댓글 {record.recap.counts.comments} · 좋아요
													{record.recap.counts.likes}
												</p>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{formatDate(record.createdAt)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
						<Pagination
							className="pt-1"
							currentPage={currentPage}
							onPageChange={setCurrentPage}
							totalPages={Math.max(1, totalPages)}
						/>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
