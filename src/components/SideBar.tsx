import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SideBar() {
  const session = useSession();
  const user = session.data?.user;
  return (
    <nav className="navbar">
      <ul className="navList">
        <li>
          <Link href="/">Home</Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>Profile</Link>
          </li>
        )}
        {user == null ? (
          <li>
            <a onClick={() => void signIn()}>Log In</a>
          </li>
        ) : (
          <li>
            <a onClick={() => void signOut()}>Log Out</a>
          </li>
        )}
      </ul>
    </nav>
  );
}
