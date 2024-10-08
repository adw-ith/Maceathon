"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import Loading from "@/components/loading";

const UnProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/protected");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
};

export default UnProtectedRoute;
