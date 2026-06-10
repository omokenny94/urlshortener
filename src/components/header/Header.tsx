import { useState, useEffect, useRef } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

export default function Navbar() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
const lastFocusedElementRef = useRef<HTMLElement | null>(null);

   const openMenu = () => {
      lastFocusedElementRef.current =
  document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
      setIsMenuOpen(true);

      // Move focus into menu after state update
      setTimeout(() => {
         menuRef.current?.focus();
      }, 0);
   };

   const closeMenu = () => {
      setIsMenuOpen(false);

      // Restore focus after state update
      setTimeout(() => {
         lastFocusedElementRef.current?.focus();
      }, 0);
   };

   useEffect(() => {
      const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    setIsMenuOpen(false);
  }
};

      document.addEventListener('keydown', handleEscapeKey);

      return () => {
         document.removeEventListener('keydown', handleEscapeKey);
      };
   }, [isMenuOpen]);


   return (
      <nav
         className="flex py-2 px-4 md:px-8 bg-white border-b border-slate-300 min-h-[68px] relative z-20"
         aria-label="Main navigation"
      >
         <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 w-full">
            <a
               href="/"
               className="min-w-9 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
               <span className="sr-only">URL Shortener</span>
               <img
                  src="../public/icons.svg"
                  alt="readymadeui logo"
                  className="h-9 w-auto"
               />
            </a>

            <div
               id="collapseMenu"
               ref={menuRef}
               tabIndex={-1}
               className={`${isMenuOpen ? "block" : "hidden"} lg:block max-lg:bg-white max-lg:border-l max-lg:border-slate-300 max-lg:w-1/2 max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto max-sm:w-full z-50 outline-none`}
            >
               <div className="py-2 px-4 flex justify-between items-center border-b border-slate-300 sticky top-0 bg-white lg:hidden max-lg:min-h-[68px]">
                  <a
                     href="#"
                     className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  >
                     <span className="sr-only">URL Shortener</span>
                     <img
                        src="icons.svg"
                        alt="readymadeui logo dialog"
                        className="h-9 w-auto"
                     />
                  </a>
                  <button type="button" aria-controls="collapseMenu"
                     onClick={closeMenu}
                     id="toggleClose"
                     className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  >
                     <span className="sr-only">Close main menu</span>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 fill-slate-900"
                        aria-hidden="true"
                        viewBox="0 0 329.269 329"
                     >
                        <path
                           d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0"
                           data-original="#000000"
                        />
                     </svg>
                  </button>
               </div>

               
            </div>

            <div className="flex items-center gap-4">
               <a
                  href="/"
                  className="text-slate-900 text-sm font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
               >
                  Home
               </a>

               <a
                  href="/dashboard"
                  className="text-slate-900 text-sm font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
               >
                  Dashboard
               </a>
               
               <SignedIn>
            <div className="flex items-center gap-4">
              <UserButton />
              <SignOutButton>
                <button className="bg-black p-3 text-white">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </SignedIn>

          <SignedOut>
<SignInButton>
   <button className="bg-black p-3 text-white">
                  Signin
                </button>
</SignInButton>
          </SignedOut>

               <button
                  type="button"
                  aria-controls="collapseMenu"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                  id="toggleOpen"
                  onClick={openMenu}
                  className="cursor-pointer lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                  <span className="sr-only">Open main menu</span>
                  <svg
                     className="size-7 fill-slate-900"
                     aria-hidden="true"
                     viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                     ></path>
                  </svg>
               </button>
            </div>
         </div>
      </nav>
   );
};