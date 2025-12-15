   
   
   "use client";
   import { useState } from "react";
   import { useAuth } from "@/hooks/useAuth";
   import { PasswordInput } from "./PasswordInput";
   import { useRouter } from "next/navigation";
   
   export default function LoginForm(){
    const router= useRouter()
       const {isError,isLoading,loginUser}=useAuth()
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
          <PasswordInput label="Password" onChange={setPassword} value={password}/>
             <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
          </form>
            <button onClick={()=>router.push("/forgot-password")}>Forgot Password</button>
         <button onClick={()=>router.push("/signup")}>Signup</button>
       </div>)
   }
 