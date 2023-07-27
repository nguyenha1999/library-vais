import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const Main = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === "/") {
      navigate("/books");
    }
  }, [navigate, pathname]);
  return <Outlet />;
};

export default Main;
