import supabase from '@/utils/supabase';

// 모든 댓글 불러오기
export async function fetchComments(postId: number) {
	const { data, error } = await supabase
		.from('comment')
		.select('*, author: profile!author_id (*)')
		.eq('post_id', postId)
		.order('created_at', { ascending: true });

	if (error) throw error;
	return data;
}

// 댓글 작성하기
export async function createComment({
	postId,
	content,
	parentCommentId,
	rootCommentId
}: {
	postId: number;
	content: string;
	parentCommentId?: number;
	rootCommentId?: number;
}) {
	const { data, error } = await supabase.rpc('add_comment_with_count', {
		p_post_id: postId,
		p_content: content,
		p_parent_comment_id: parentCommentId,
		p_root_comment_id: rootCommentId
	});
	// .from('comment')
	// .insert({
	// 	post_id: postId,
	// 	content: content,
	// 	parent_comment_id: parentCommentId,
	// 	root_comment_id: rootCommentId
	// })
	// .select()
	// .single();

	if (error) throw error;

	return data;
}

// 댓글 수정하기
export async function updateComment({
	id,
	content
}: {
	id: number;
	content: string;
}) {
	const { data, error } = await supabase
		.from('comment')
		.update({ content })
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;

	return data;
}

// 댓글 삭제하기
export async function deleteComment(id: number) {
	const { data, error } = await supabase.rpc('delete_comment_with_count', {
		p_comment_id: id
	});
	// .from('comment')
	// .delete()
	// .eq('id', id)
	// .select()
	// .single();

	if (error) throw error;
	return data;
}
