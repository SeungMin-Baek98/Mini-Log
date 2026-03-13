import { Link } from 'react-router';

export default function Footer() {
	return (
		<footer className="text-muted-foreground border-t py-6">
			<div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 text-center text-sm sm:flex-row sm:px-6 sm:text-left">
				<div>@SeungMinBaek</div>
				<Link
					className="hover:text-foreground underline-offset-4 hover:underline"
					to="/privacy-policy">
					개인정보처리방침
				</Link>
			</div>
		</footer>
	);
}
