/* eslint-disable react/no-direct-mutation-state */

import { useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("https://univibes-backend.onrender.com/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });

    // eslint-disable-next-line
  }, 5000);

  function logout() {
    fetch("https://univibes-backend.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    });

    setUserInfo(null);
  }

  const username = userInfo?.username;
// eslint-disable-next-line
  return (
    <header>
      <Link to="/" className="logo">
        UniVibes
      </Link>
      <nav>
        {username && (
          <>
            hello, {username}
            
            <Link to="/create">Create New Post</Link>
            
            <p onClick={logout}>LogOut</p>
          </>
        )}

        {!username && (
          <>
            <Link to="/login" className="login">
              login
            </Link>
            <Link to="/register" className="register">
              register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
