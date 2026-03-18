import { type Database } from './database.types';

/** Supabase Post 타입 정의 */
export type PostEntity = Database['public']['Tables']['post']['Row'];
export type ProfileEntity = Database['public']['Tables']['profile']['Row'];
export type CommentEntity = Database['public']['Tables']['comment']['Row'];
export type InsightSummaryRow =
	Database['public']['Tables']['insight_summary']['Row'];

export type WeeklyRecapStepType =
	| 'intro'
	| 'posts'
	| 'comments'
	| 'likes'
	| 'keywords'
	| 'mood'
	| 'suggestion'
	| 'summary'
	| 'empty'
	| 'cta';

export type WeeklyRecapStep = {
	step: number;
	type: WeeklyRecapStepType;
	message: string;
};

export type WeeklyRecapData = {
	mode: 'funnel' | 'empty';
	periodStart: string;
	periodEnd: string;
	counts: {
		posts: number;
		comments: number;
		likes: number;
		total: number;
	};
	steps: WeeklyRecapStep[];
	cta?: {
		label: string;
		href: string;
	};
};

export type WeeklyRecapRecord = {
	periodEnd: string;
	recap: WeeklyRecapData;
};

export type WeeklyRecapHistoryRecord = {
	id: string;
	createdAt: string;
	periodStart: string;
	periodEnd: string;
	recap: WeeklyRecapData;
};

export type Post = PostEntity & { author: ProfileEntity; isLiked: boolean };
export type Comment = CommentEntity & { author: ProfileEntity };
export type NestedComment = Comment & {
	parentComment?: Comment;
	children: NestedComment[];
};
export type PostSortOrder = 'latest' | 'oldest';

/** useMutation 콜백 타입 정의 */
export type UseMutationCallback = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onMutate?: () => void;
	onSettled?: () => void;
};

export type Theme = 'system' | 'dark' | 'light';
