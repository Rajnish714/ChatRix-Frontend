"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { parsePagesSegmentConfig } from "next/dist/build/segment-config/pages/pages-segment-config";

export default function LoginPage(){
    const {user,isError,isLoading,loginUser}=useAuth()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit= async(e: React.FormEvent)=>{
    e.preventDefault();
     const loggedInUser = await loginUser({ email, password });

    if (loggedInUser) {
      console.log("Logged in user:", loggedInUser);
     
    }
    }

    return(<div>
        <h1>Login</h1>
          {isError && <p style={{ color: "red" }}>{isError}</p>}
          <form onSubmit={handleSubmit}>
           <input  value={email} type="email"   placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
            <input  value={password} type="password"  placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
             <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
          </form>
            {user && (
        <div style={{ marginTop: 20 }}>
          <h3>User in Zustand:</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>)
}