import Link from "next/link";

export default function Page404() {
  return (
    <div>
      <p>Not Found Page</p>
      <Link href="/"><button>Back Home</button></Link>
    </div>
  );
}
  