import SignIn from "./signIn";
import Login from "./login";
import FailedModal from "./failedModal";

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
