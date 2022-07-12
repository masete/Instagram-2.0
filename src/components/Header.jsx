import React, { useContext, useState } from "react";
import {
  SearchIcon,
  PlusCircleIcon,
  PaperAirplaneIcon,
  HomeIcon,
  LogoutIcon,
  LoginIcon,
  XIcon,
} from "@heroicons/react/outline";
import UserContext from "../context/user";
import * as ROUTES from "../constants/routes";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useRecoilState } from "recoil";
import { postModalState } from "../atoms/modalAtom";
import useUser from "../hooks/use-user";
function Header() {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useRecoilState(postModalState);
  const auth = getAuth();
  const {
    user: { username, image },
  } = useUser();
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <div className="fixed top-0 z-50 w-screen border-b bg-white shadow-sm">
      <div className="mx-3 flex max-w-7xl items-center justify-evenly lg:-mx-3 xl:mx-auto">
        {/* Left Side */}
        <Link
          to={ROUTES.DASHBOARD}
          className="relative hidden w-32 cursor-pointer sm:inline-grid"
        >
          <img src="/images/logo.png" alt="Logo" className=" object-contain" />
        </Link>
        <Link
          to={ROUTES.DASHBOARD}
          className="opacity-8 relative h-12 w-12 flex-shrink-0 cursor-pointer sm:hidden"
        >
          <img
            src="/images/logo-icon.png"
            alt="Logo"
            className=" object-contain "
          />
        </Link>
        {/* Middle Part */}
        <div
          className={`-mr-1 ${
            active ? " w-[600px]" : "max-w-[140px] sm:max-w-xs"
          }`}
        >
          <div className="relative mt-1 mb-1 rounded-md p-3">
            <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-full rounded-md border-[2.4px] border-gray-400 bg-gray-100 p-2 pl-10 hover:border-gray-500 focus:border-gray-500 focus:outline-none sm:text-base"
              onClick={() => setActive(true)}
              onKeyDown={() => setActive(true)}
              value={search}
              onChange={({ target }) => setSearch(target.value)}
            />
            <div
              className={`absolute top-[22px] right-5 flex cursor-pointer items-center justify-end outline-none ${
                !active && "hidden"
              }`}
              onClick={() =>{ setSearch(""), setActive(false)}}
            >
              <XIcon className="h-6 w-6 cursor-pointer text-gray-500" />
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div
          className={`flex items-center justify-end space-x-1 lg:space-x-3 ${
            active && "hidden"
          }`}
        >
          <Link to={ROUTES.DASHBOARD}>
            <HomeIcon className="navButton hidden sm:flex" />
          </Link>
          {user ? (
            <>
              <div className="relative">
                <PaperAirplaneIcon className="navButton mb-[6px] rotate-50" />
                <div className="absolute -top-1 -right-1 h-5 w-5 animate-pulse rounded-full bg-red-500 text-center text-sm text-white">
                  3
                </div>
              </div>
              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="navButton"
              />
              <Link to={ROUTES.LOGIN}>
                <button
                  type="button"
                  aria-label="Log Out"
                  onClick={() => signOut(auth)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      signOut(auth);
                    }
                  }}
                >
                  <LogoutIcon className="navButton mt-[6px] sm:mt-[1px] " />
                </button>
              </Link>
              <div className="items-center">
                <Link to={`/profile/${username}`}>
                  <img
                    src={image}
                    alt=""
                    className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover p-[1px] mt-1"
                  />
                </Link>
              </div>
            </>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="mt-[6px] flex items-center space-x-2 rounded-md p-2 text-lg font-semibold transition ease-in hover:bg-gray-300 hover:bg-opacity-50 sm:mt-[1px]"
            >
              <LoginIcon className="navButton  " />
              <span>Log In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;