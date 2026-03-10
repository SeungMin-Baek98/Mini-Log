import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { useWeeklyRecapModal } from '@/store/weeklyRecapModal';
import type { WeeklyRecapStep } from '@/types';

function getStepTitle(step: WeeklyRecapStep['type']) {
	switch (step) {
		case 'intro':
			return '이번 주 회고 시작';
		case 'posts':
			return '게시글 활동';
		case 'comments':
			return '댓글 활동';
		case 'likes':
			return '좋아요 활동';
		case 'keywords':
			return '핵심 키워드';
		case 'mood':
			return '이번 주 분위기';
		case 'suggestion':
			return '다음 주 제안';
		case 'summary':
			return '한 줄 회고';
		case 'empty':
			return '활동 없음';
		case 'cta':
			return '다음 행동';
		default:
			return '회고';
	}
}

export default function WeeklyRecapModal() {
	const { isOpen, data, currentStepIndex, actions } = useWeeklyRecapModal();

	if (!data) return null;

	const { steps, periodStart, periodEnd, counts, mode, cta } = data;
	const currentStep = steps[currentStepIndex];
	const isFirst = currentStepIndex === 0;
	const isLast = currentStepIndex === steps.length - 1;

	const handleClose = () => {
		actions.close();
		actions.reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>AI 주간 회고</DialogTitle>
					<DialogDescription>
						이번 주 기록을 요약해서 보여줘요.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					{currentStep && (
						<div className="bg-muted/50 flex flex-col gap-2 rounded-lg p-4">
							<p className="text-muted-foreground text-xs">
								Step {currentStep.step} / {steps.length} ·{' '}
								{getStepTitle(currentStep.type)}
							</p>
							{currentStep.type === 'keywords' && (
								<p className="text-primary text-xs font-medium">
									이번 주 게시글을 토대로 알려드려요!
								</p>
							)}
							<p className="text-sm leading-relaxed">{currentStep.message}</p>
						</div>
					)}

					<div className="text-muted-foreground flex items-center justify-between text-xs">
						<p>
							집계 기간: {periodStart} ~ {periodEnd}
						</p>
						<p>총 활동 {counts.total}개</p>
					</div>

					<div className="flex items-center justify-between gap-2">
						<Button
							variant="outline"
							onClick={actions.prevStep}
							disabled={isFirst}>
							이전
						</Button>
						{isLast ? (
							<Button onClick={handleClose}>닫기</Button>
						) : (
							<Button onClick={actions.nextStep}>다음</Button>
						)}
					</div>

					{mode === 'empty' && isLast && cta && (
						<Button asChild>
							<a href={cta.href}>{cta.label}</a>
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

