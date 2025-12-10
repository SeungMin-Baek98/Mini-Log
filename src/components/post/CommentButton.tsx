import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router';

export default function CommentButton({
	id,
	commentCount,
	disabled = false
}: {
	id: number;
	commentCount: number;
	disabled?: boolean;
}) {
	return (
		<Link to={`/post/${id}`} aria-disabled={disabled}>
			<div
				className={`flex items-center gap-2 rounded-xl border-1 p-2 px-4 text-sm ${
					disabled
						? 'text-muted-foreground cursor-not-allowed'
						: 'hover:bg-muted cursor-pointer'
				}`}>
				<MessageCircle className="h-4 w-4" />
				<span>{commentCount}</span>
			</div>
		</Link>
	);
}
