import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="w-full max-w-7xl mx-auto container px-4 flex justify-center items-center ">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
