import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", {
      replace: true,
      state: { message: "Logged out successfully." },
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Smart Leads
          </p>
          <h1 className="text-lg font-semibold text-text-primary sm:text-xl">Sales Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden rounded-xl border border-border bg-surface px-4 py-2 text-right sm:block">
            <p className="text-sm font-semibold text-text-primary">
              {user?.email || "Authenticated user"}
            </p>
            <p className="text-xs uppercase tracking-wide text-text-secondary">
              {user?.role || "sales"}
            </p>
          </div>

          <Button type="button" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
