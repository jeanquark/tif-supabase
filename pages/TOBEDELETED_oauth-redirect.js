import Link from 'next/link'

export default function OAuthRedirect() {
	return (
		<div>
			<h3>OAuth redirect page</h3>
			<Link href="/">
				<a>&larr; Home</a>
			</Link><br /><br />
      		Thanks for logging via OAuth!
		</div>
	);
}