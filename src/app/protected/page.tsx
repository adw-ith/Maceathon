import DisplayFiles from "@/components/display";
import Logout from "@/components/logout";
import UploadForm from "@/components/upload";
import ProtectedRoute from "@/Redirects/ProtectedRoute";
import React from "react";

export default function Protected() {
  return (
    <ProtectedRoute>
      <div className="relative bg-slate-950 flex min-h-screen md:min-h-[75vh] h-fit justify-center md:justify-end">
        <div className="hidden md:block w-[75%] h-full opacity-20">
          <img
            src="https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>
        <div className="z-10">
          <UploadForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
