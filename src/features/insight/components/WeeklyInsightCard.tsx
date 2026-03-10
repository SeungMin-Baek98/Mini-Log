import { Button } from '@/components/ui/button';
import { generateErrorMessage } from '@/lib/error';
import { useGenerateWeeklyInsight } from '@/features/insight/hooks/mutations/useGenerateWeeklyInsight';
import { useWeeklyInsightData } from '@/features/insight/hooks/queries/useWeeklyInsightData';
import type { WeeklyRecapStep } from '@/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

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

export default function WeeklyInsightCard() {
	const { data: insight, isLoading } = useWeeklyInsightData();
	const { mutateAsync: generateInsight, isPending } =
		useGenerateWeeklyInsight();
	const [currentStepIndex, setCurrentStepIndex] = useState(0);

	useEffect(() => {
		setCurrentStepIndex(0);
	}, [insight]);

	const handleGenerateInsight = async () => {
		try {
			await generateInsight();
			toast.success('주간 회고를 생성했어요.', {
				position: 'top-center'
			});
		} catch (error) {
			toast.error(generateErrorMessage(error), {
				position: 'top-center'
			});
		}
	};

	const steps = insight?.steps ?? [];
	const currentStep = steps[currentStepIndex];
	const isFirst = currentStepIndex === 0;
	const isLast = currentStepIndex === steps.length - 1;

	return (
		<section className="bg-card flex flex-col gap-4 rounded-xl border p-5">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h2 className="text-base font-semibold">AI 주간 회고</h2>
					<p className="text-muted-foreground text-xs">
						이번 주 기록을 요약해서 보여줘요.
					</p>
				</div>
				<Button onClick={handleGenerateInsight} disabled={isPending}>
					{isPending ? '생성 중...' : '회고 생성'}
				</Button>
			</div>

			{isLoading && (
				<p className="text-muted-foreground text-sm">
					회고를 불러오는 중입니다.
				</p>
			)}

			{!isLoading && !insight && (
				<p className="text-muted-foreground text-sm">
					아직 생성된 회고가 없어요. 버튼을 눌러 첫 회고를 만들어보세요.
				</p>
			)}

			{!isLoading && insight && currentStep && (
				<div className="flex flex-col gap-4">
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

					<div className="text-muted-foreground flex items-center justify-between text-xs">
						<p>
							집계 기간: {insight.periodStart} ~ {insight.periodEnd}
						</p>
						<p>총 활동 {insight.counts.total}개</p>
					</div>

					<div className="flex items-center justify-between gap-2">
						<Button
							variant="outline"
							onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
							disabled={isFirst}>
							이전
						</Button>
						<Button
							onClick={() =>
								setCurrentStepIndex(prev =>
									Math.min(prev + 1, steps.length - 1)
								)
							}
							disabled={isLast}>
							다음
						</Button>
					</div>

					{insight.mode === 'empty' && isLast && insight.cta && (
						<Button asChild>
							<Link to={insight.cta.href}>{insight.cta.label}</Link>
						</Button>
					)}
				</div>
			)}
		</section>
	);
}
