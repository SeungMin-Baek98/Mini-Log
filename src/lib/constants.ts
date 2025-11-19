export const QUERY_KEYS = {
	profile: {
		all: ['profile'],
		list: ['profile', 'list'],
		byId: (userId: string) => ['profile', 'id', userId]
	}
};

export const BUCKET_NAME = 'uploads';
