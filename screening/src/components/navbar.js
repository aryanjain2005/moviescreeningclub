import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../images/logo.png';
import { useLogin } from './LoginContext'; // Import useLogin hook

const Navbar = () => {
  const { loggedIn, logout } = useLogin();
  const navigate = useNavigate();
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    setUserType(userType);
  }, [loggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu); 
    console.log("ShowMenu current state",showMenu);
  };

  return (
  <nav
    class="relative flex w-full flex-nowrap items-center justify-between bg-zinc-50 py-2 text-neutral-500 shadow-dark-mild hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-700 lg:flex-wrap lg:justify-start lg:py-4"
    data-twe-navbar-ref>
    <div class="flex w-full flex-wrap items-center justify-around px-3">
      <div class="ms-2">
        <a class="text-xl text-black dark:text-white flex items-center" href="#">
          <img className="h-1/6 w-1/6" src={Logo} alt="not found" />
          <p>Movies</p>
        </a>
      </div>
      <button
        class="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
        type="button"
        data-twe-collapse-init
        data-twe-target="#navbarSupportedContent2"
        aria-controls="navbarSupportedContent2"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span
          class="[&>svg]:w-7 [&>svg]:stroke-black/50 dark:[&>svg]:stroke-neutral-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clip-rule="evenodd" />
          </svg>
        </span>
      </button>


      <div
        class="!visible mt-2 hidden flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto"
        id="navbarSupportedContent2"
        data-twe-collapse-item>

        <ul
          class="list-style-none me-auto flex flex-col ps-0 lg:mt-1 lg:flex-row"
          data-twe-navbar-nav-ref>
          <li
            class="my-4 ps-2 lg:my-0 lg:pe-1 lg:ps-2"
            data-twe-nav-item-ref>
            <a
              class="text-black dark:text-white lg:px-2"
              aria-current="page"
              href="#"
              data-twe-nav-link-ref
              >Home</a
            >
          </li>
          <li
            class="mb-4 ps-2 lg:mb-0 lg:pe-1 lg:ps-0"
            data-twe-nav-item-ref>
            <a
              class="p-0 text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
              href="#"
              data-twe-nav-link-ref
              >Features</a
            >
          </li>
          <li
            class="mb-4 ps-2 lg:mb-0 lg:pe-1 lg:ps-0"
            data-twe-nav-item-ref>
            <a
              class="p-0 text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none dark:text-white/60 dark:hover:text-white/80 dark:focus:text-white/80 dark:active:text-white/80 lg:px-2"
              href="#"
              data-twe-nav-link-ref
              >Pricing</a
            >
          </li>
          <li
            class="mb-4 ps-2 lg:mb-0 lg:pe-1 lg:ps-0"
            data-twe-nav-link-ref>
            <a
              class="pointer-events-none text-black/30 dark:text-white/30 lg:px-2"
              >Disabled</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );
}

const NavItem = ({ to, children }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
  >
    {children}
  </Link>
);

export default Navbar;
