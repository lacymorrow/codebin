import GithubAuth from "@/components/auth/github";
import GoogleAuth from "@/components/auth/google";

export default function Home() {
  return (
    <div>
      <GoogleAuth />
      <GithubAuth/>
    </div>
  );
}
