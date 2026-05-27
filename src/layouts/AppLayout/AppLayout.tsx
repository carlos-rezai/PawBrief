import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <nav>
        <Link to="/">PawBrief</Link>
      </nav>
      <Outlet />
    </>
  );
}
