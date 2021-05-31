import { useRouter } from "next/router";

export default function Welcome() {
    const router = useRouter();
    const { email } = router.query;
    return (
        <main>
            <p>
                Thank you for signing up. Please check your {email} inbox to verify
          your e-mail address!
        </p>
        </main>

    );
}