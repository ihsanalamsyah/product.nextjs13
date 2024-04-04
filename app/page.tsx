
import SignIn from "./components/signIn";
import Login from "./components/login";

export default function Home() {
  return (
    <div>
      <div className="py-2 flex">
        <SignIn />
        <Login />
      </div>
    </div>
  );
}
