import { basePath } from "../utils/siteConfig";
import Link from 'next/link'

export async function getServerSideProps() {
	// We need to implement `/api/getUser` by creating 
	// an endpoint in `pages/api` but for now let's just call it
	console.log('basePath: ', basePath)
	const response = await fetch(`${basePath}/api/getUser`).then((response) =>
	// const response = await fetch(`/api/getUser`).then((response) =>
		response.json()
	);
	console.log('response: ', response)

	const { user } = response;

	// If the `getUser` endpoint doesn't have a user in its response
	// then we will redirect to the login page
	// which means this page will only be viewable when `getUser` returns a user.

	if (!user) {
		return {
			redirect: { destination: "/login", permanent: false },
		};
	}
	// We'll pass the returned `user` to the page's React Component as a prop
	return { props: { user } };
}
export default function Protected({ user }) {
	return (
		<div>
			<h3>Protected page</h3>
			<Link href="/">
				<a>&larr; Home</a>
			</Link><br /><br />
      		Welcome {user.email}!{" "}
			<span role="img" aria-label="waving hand">
				👋🏾
            </span>{"You are currently viewing a top secret page!"}
		</div>
	);
}