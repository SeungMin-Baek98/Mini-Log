import supabase from '@/utils/supabase';

/** 게시글 POST 요청 */
export async function createPost(content: string) {
	const { data, error } = await supabase.from('post').insert({ content });

	if (error) throw error;
	return data;
}
