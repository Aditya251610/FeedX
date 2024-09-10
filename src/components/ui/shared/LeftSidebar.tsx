import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useUserContext } from "../../../context/AuthContext";
import { Button } from "../button";
import { useSignOutAccountMutation } from "../../../lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { sidebarLinks } from "../../../constants";
import { INavLink } from "../../../types";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccountMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);

  return (
    <nav className="leftsidebar flex flex-col justify-between h-full">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/public/assets/images/logo.svg" alt="logo" height={36} width={170} />
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/public/assets/images/profile.png"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button variant="ghost" className="shad-button_ghost flex items-center gap-2" onClick={() => signOut()}>
        <img src="/public/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
