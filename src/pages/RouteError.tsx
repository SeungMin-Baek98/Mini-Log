import { Link, useNavigate, useRouteError } from 'react-router';
import { ChevronLeft, Home, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AppRouteError } from '@/lib/route-error';

const DEFAULT_ERROR_COPY = {
	title: '문제가 발생했어요',
	description:
		'페이지를 불러오는 중 예상하지 못한 문제가 생겼습니다. 잠시 후 다시 시도해주세요.'
};

export default function RouteErrorPage() {
	const navigate = useNavigate();
	const error = useRouteError();

	const copy =
		error instanceof AppRouteError
			? {
					title: error.title,
					description: error.description
				}
			: DEFAULT_ERROR_COPY;

	return (
		<div className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
			<div className="border-border/80 bg-card/95 flex w-full max-w-xl flex-col items-center gap-5 rounded-[2rem] border px-6 py-10 text-center shadow-[0_22px_50px_rgba(96,76,48,0.08)] sm:px-10">
				<div className="bg-primary/10 text-primary rounded-full p-4">
					<TriangleAlert className="h-8 w-8" />
				</div>
				<div className="space-y-2">
					<p className="text-primary/70 text-xs font-medium tracking-[0.24em] uppercase">
						Error state
					</p>
					<h1 className="text-2xl font-semibold sm:text-3xl">{copy.title}</h1>
					<p className="text-muted-foreground text-sm leading-6 sm:text-base">
						{copy.description}
					</p>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button variant="outline" onClick={() => navigate(-1)}>
						<ChevronLeft className="h-4 w-4" />
						이전 페이지로
					</Button>
					<Button asChild>
						<Link to="/" replace>
							<Home className="h-4 w-4" />
							홈으로 이동
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
