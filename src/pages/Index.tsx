import CreatePostButton from '@/features/post/components/CreatePostButton';
import PostFeed from '@/features/post/components/PostFeed';
import WeeklyInsightCard from '@/features/insight/components/WeeklyInsightCard';

export default function IndexPage() {
	return (
		<div className="flex flex-col gap-10">
			<CreatePostButton />
			<WeeklyInsightCard />
			<PostFeed />
		</div>
	);
}
