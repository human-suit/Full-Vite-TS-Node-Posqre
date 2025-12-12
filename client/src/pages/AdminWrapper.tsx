import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Admin from "./Admin/Admin";

export default function AdminWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  return <Admin />;
}
