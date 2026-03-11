import CreatePostButton from '@/features/post/components/CreatePostButton';
import PostFeed from '@/features/post/components/PostFeed';
import WeeklyInsightCard from '@/features/insight/components/WeeklyInsightCard';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

function Chip({
	text,
	description,
	className = ''
}: {
	text: string;
	description: string;
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		// 창 크기가 변경될 때마다 isOpen 상태를 업데이트하여 모바일 뷰에서만 설명이 보이도록 함
		const handleResize = () => {
			if (window.innerWidth >= 640) {
				setIsOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div
			className={cn(
				'group relative whitespace-pre-line sm:whitespace-normal',
				className
			)}>
			<button
				type="button"
				onClick={() => setIsOpen(prev => !prev)}
				className="border-border/70 bg-background/55 dark:bg-card/55 group-hover:bg-background/70 cursor-pointer rounded-full border px-4 py-2 text-left backdrop-blur-sm transition-colors">
				<span>{text}</span>
			</button>
			<div
				className={cn(
					'text-muted-foreground overflow-hidden pl-2 text-xs leading-6 transition-all duration-300 sm:hidden',
					isOpen ? 'mt-2 max-h-24 opacity-100' : 'max-h-0 opacity-0'
				)}>
				{description}
			</div>
			<div className="bg-background/95 border-border/80 text-muted-foreground pointer-events-none absolute top-full left-1/2 z-50 mt-3 hidden w-64 -translate-x-1/2 translate-y-1 rounded-2xl border px-4 py-3 text-xs leading-6 opacity-0 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 sm:block">
				<div className="bg-background/95 border-border/80 absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-t border-l" />
				<div className="relative">{description}</div>
			</div>
		</div>
	);
}

export default function IndexPage() {
	return (
		<div className="flex flex-col gap-8 sm:gap-10">
			<section className="border-border/70 relative overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_94%,white)_0%,color-mix(in_oklab,var(--secondary)_82%,white)_100%)] px-6 py-8 shadow-[0_24px_60px_rgba(96,76,48,0.08)] sm:overflow-visible sm:px-8 sm:py-10 dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_68%,black)_100%)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
				<div className="bg-primary/12 dark:bg-primary/18 absolute -top-16 right-0 h-40 w-40 rounded-full blur-3xl" />
				<div className="bg-accent/14 dark:bg-accent/16 absolute bottom-0 left-0 h-28 w-28 rounded-full blur-2xl" />
				<div className="relative flex flex-col gap-5">
					<div className="space-y-2">
						<p className="text-primary/70 text-xs font-medium tracking-[0.24em] uppercase">
							Daily moments
						</p>
						<h1 className="max-w-xl text-3xl leading-tight font-semibold sm:text-5xl">
							흘러가는 하루를
							<br />
							조용히 기록해두는 공간
						</h1>
						<p className="text-muted-foreground max-w-2xl text-sm leading-7 sm:text-base">
							오늘의 생각, 사진, 작은 감정을 가볍게 남기고 다시 돌아와 살펴볼 수
							있는 라이프로그 피드예요.
						</p>
					</div>
					<div className="text-muted-foreground relative flex flex-wrap items-center gap-3 text-sm">
						<Chip
							text="사진과 짧은 글을 함께 기록"
							description={`하루의 장면을 사진과 짧은 문장으로 남기고\n시간이 지난 뒤에도 그 순간의 감정을 다시 꺼내볼 수 있어요.`}
						/>
						<Chip
							text="AI기반 주간 회고로 한 주를 정리"
							description={`한 주 동안 쌓인 기록을 바탕으로 AI가 흐름을 정리해줘서\n내가 어떤 시간을 보냈는지 더 쉽게 돌아볼 수 있어요.`}
						/>
					</div>
				</div>
			</section>
			<CreatePostButton />
			<WeeklyInsightCard />
			<PostFeed />
		</div>
	);
}
