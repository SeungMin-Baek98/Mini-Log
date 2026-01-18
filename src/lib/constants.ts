export const QUERY_KEYS = {
	profile: {
		all: ['profile'],
		list: ['profile', 'list'],
		byId: (userId: string) => ['profile', 'id', userId]
	},
	post: {
		all: ['post'],
		list: ['post', 'list'],
		userList: (userId: string) => ['post', 'userList', userId],
		byId: (postId: number) => ['post', 'id', postId],
		calendar: (userId: string, monthKey: string) => [
			'post',
			'calendar',
			userId,
			monthKey
		]
	},
	comment: {
		all: ['comment'],
		post: (postId: number) => ['comment', 'post', postId]
	}
};

export const BUCKET_NAME = 'uploads';

// UI Constants
export const MAX_IMAGE_WIDTH_PX = 480; // 이미지 캐러셀 최대 너비

// Post Count Threshold
export const MIN_POST_COUNT_FOR_HIGHEST_COLOR = 5; // 차트 최고 색상을 위한 최소 포스트 개수

// Scroll Thresholds (in pixels)
export const SCROLL_DOWN_THRESHOLD_PX = 350; // Floating 버튼 표시를 위한 스크롤 임계값
export const SCROLL_UP_THRESHOLD_PX = 250; // Normal 버튼 표시를 위한 스크롤 임계값
