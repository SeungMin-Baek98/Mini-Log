import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useCreateComment } from '@/features/comment/hooks/mutations/useCreateComment';
import { toast } from 'sonner';
import { useUpdateComment } from '@/features/comment/hooks/mutations/useUpdateComments';
import { useSession } from '@/store/session';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';

type CreateMode = {
	type: 'CREATE';
	postId: number;
};

type EditMode = {
	type: 'EDIT';
	commentId: number;
	initialContent: string;
	onClose: () => void; // 편집 모드시에 닫기 함수를 추가하여 isEditing 상태를 토글하는 용도
};

type ReplyMode = {
	type: 'REPLY';
	postId: number;
	parentCommentId: number;
	rootCommentId: number;
	onClose: () => void; // 답글 모드시에 닫기 함수를 추가하여 isReply 상태를 토글하는 용도
};

type Props = CreateMode | EditMode | ReplyMode;

export default function CommentEditor(props: Props) {
	const session = useSession();
	const requireAuth = useRequireAuth();
	const initialEditContent =
		props.type === 'EDIT' ? props.initialContent : undefined;

	const { mutate: createComment, isPending: isCreateCommentPending } =
		useCreateComment({
			onSuccess: () => {
				setContent('');
				if (props.type === 'REPLY') props.onClose();
			},
			onError: error => {
				toast.error('댓글 추가에 실패했습니다', {
					position: 'top-center'
				});
			}
		});
	const { mutate: updateComment, isPending: isUpdateCommentPending } =
		useUpdateComment({
			onSuccess: () => {
				(props as EditMode).onClose();
			},
			onError: error => {
				toast.error('댓글 수정에 실패했습니다', { position: 'top-center' });
			}
		});

	const [content, setContent] = useState('');

	useEffect(() => {
		if (props.type === 'EDIT') {
			setContent(initialEditContent ?? '');
		}
	}, [initialEditContent, props.type]);

	const handleSubmitClick = () => {
		if (content.trim() === '') return;
		if ((props.type === 'CREATE' || props.type === 'REPLY') && !session) {
			requireAuth({
				message: '댓글은 로그인 후 남길 수 있어요.'
			});
			return;
		}

		if (props.type === 'CREATE') {
			createComment({ postId: props.postId, content });
		} else if (props.type === 'REPLY') {
			createComment({
				postId: props.postId,
				content,
				parentCommentId: props.parentCommentId,
				rootCommentId: props.rootCommentId
			});
		} else {
			// EDIT 모드일 때의 처리 (추가 구현 필요)
			updateComment({
				id: props.commentId,
				content
			});
		}
	};

	const isPending = isCreateCommentPending || isUpdateCommentPending;

	if (!session && props.type !== 'EDIT') {
		return (
			<div className="flex flex-col gap-2">
				<Textarea
					readOnly
					value=""
					placeholder="댓글을 남겨보세요."
					onClick={() =>
						requireAuth({
							message: '댓글은 로그인 후 남길 수 있어요.'
						})
					}
					onFocus={() =>
						requireAuth({
							message: '댓글은 로그인 후 남길 수 있어요.'
						})
					}
				/>
				<div className="flex justify-end gap-2">
					{props.type === 'REPLY' && (
						<Button variant={'outline'} onClick={() => props.onClose()}>
							취소
						</Button>
					)}
					<Button
						type="button"
						onClick={() =>
							requireAuth({
								message: '댓글은 로그인 후 남길 수 있어요.'
							})
						}>
						작성
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<Textarea
				disabled={isPending}
				value={content}
				placeholder="댓글을 남겨보세요."
				onChange={e => {
					setContent(e.target.value);
				}}
			/>
			<div className="flex justify-end gap-2">
				{(props.type === 'EDIT' || props.type === 'REPLY') && (
					<Button
						disabled={isPending}
						variant={'outline'}
						onClick={() => props.onClose()}>
						취소
					</Button>
				)}
				<Button disabled={isPending} onClick={handleSubmitClick}>
					작성
				</Button>
			</div>
		</div>
	);
}
