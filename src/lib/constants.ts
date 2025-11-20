export const QUERY_KEYS = {
	profile: {
		all: ['profile'],
		list: ['profile', 'list'],
		byId: (userId: string) => ['profile', 'id', userId]
	},
	post: {
		all: ['post'],
		list: ['post', 'list'],
		byId: (postId: number) => ['post', 'id', postId]
	}
};

export const BUCKET_NAME = 'uploads';
