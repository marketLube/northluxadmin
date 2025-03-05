import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/login");
  }, []);
  return (
    <div>
      <h1>Homepage</h1>
    </div>
  );
}
