import CreatePostButton from '@/features/post/components/CreatePostButton';
import PostFeed from '@/features/post/components/PostFeed';
import WeeklyInsightCard from '@/features/insight/components/WeeklyInsightCard';

export default function IndexPage() {
	return (
		<div className="flex flex-col gap-8 sm:gap-10">
			<section className="border-border/70 relative overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_94%,white)_0%,color-mix(in_oklab,var(--secondary)_82%,white)_100%)] px-6 py-8 shadow-[0_24px_60px_rgba(96,76,48,0.08)] sm:px-8 sm:py-10 dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_68%,black)_100%)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
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
					<div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
						<span className="border-border/70 bg-background/55 dark:bg-card/55 rounded-full border px-4 py-2 backdrop-blur-sm">
							사진과 짧은 글을 함께 기록
						</span>
						<span className="border-border/70 bg-background/55 dark:bg-card/55 rounded-full border px-4 py-2 backdrop-blur-sm">
							주간 회고로 한 주를 정리
						</span>
					</div>
				</div>
			</section>
			<CreatePostButton />
			<WeeklyInsightCard />
			<PostFeed />
		</div>
	);
}
