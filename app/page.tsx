

import SignIn from "./signIn";
import Login from "./login";

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
