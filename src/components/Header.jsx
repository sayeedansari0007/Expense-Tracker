import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

export default function Header() {
  return (
    <header className="header">

      <div className="logo">
        SpendSmart
      </div>

      <nav className="nav">

        <SignedOut>
          <SignInButton mode="modal">
            <button className="ghost-btn">
              Login
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="primary-btn">
              Sign up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: "36px",
                  height: "36px"
                }
              }
            }}
          />
        </SignedIn>

      </nav>

    </header>
  );
}