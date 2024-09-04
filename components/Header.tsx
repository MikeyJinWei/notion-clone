"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Breadcrumbs from "./Breadcrumbs";

const Header = () => {
  const { user } = useUser();

  return (
    <div className="p-5 flex items-center justify-between">
      {user && (
        <h1>
          {user?.firstName}
          {`'s`} Space
        </h1>
      )}

      <Breadcrumbs />

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};
export default Header;
