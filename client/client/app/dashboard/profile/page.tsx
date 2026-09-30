"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
  router.push("/login");
  return;
}


     const user_id = user?.id;

    setUser(user);
    setLoading(false);
  };


  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };


  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        Loading Profile...
      </div>
    );
  }


  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px",
      }}
    >

      <h1
        style={{
          fontSize: "34px",
          marginBottom: "25px",
        }}
      >
        👤 My Profile
      </h1>


      <div
        style={{
          maxWidth: "600px",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >

        <h2>
          {user?.user_metadata?.full_name || "User"}
        </h2>


        <p>
          📧 Email:
          <br />
          {user?.email}
        </p>


        <p>
          🆔 User ID:
        </p>


        <div
          style={{
            background:"#f3f4f6",
            padding:"10px",
            borderRadius:"8px",
            wordBreak:"break-all",
          }}
        >
          {user?.id}
        </div>


        <p style={{marginTop:"20px"}}>
          📅 Created:
          <br />
          {new Date(
            user?.created_at
          ).toLocaleDateString()}
        </p>


        <button
          onClick={logout}
          style={{
            marginTop:"25px",
            width:"100%",
            padding:"14px",
            background:"#dc2626",
            color:"#fff",
            border:"none",
            borderRadius:"10px",
            cursor:"pointer",
            fontWeight:"bold",
          }}
        >
          🚪 Logout
        </button>

      </div>

    </main>
  );
}