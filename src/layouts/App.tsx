import { Outlet } from "react-router";
import { useEffect } from "react";
import Header from "../components/Header";
import useUserStore from "../stores/userStore";

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
