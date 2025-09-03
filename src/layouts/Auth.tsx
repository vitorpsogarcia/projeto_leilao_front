import { Outlet } from "react-router";
import Header from "../components/Header";

export const Auth = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
