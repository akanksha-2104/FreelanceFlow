import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../common/Navbar";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />

        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}