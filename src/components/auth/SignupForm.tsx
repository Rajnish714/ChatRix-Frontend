   
   
   "use client";
   import { useState } from "react";
  import { useRouter } from "next/navigation";
   import { useAuth } from "@/hooks/useAuth";
   import { PasswordInput } from "./PasswordInput";
  
   
   export default function SignupForm(){  
    const router = useRouter();
    
       const {isError,isLoading,signupUser}=useAuth()
        const [username, setUsername] = useState("");
       const [email, setEmail] = useState("");
       const [password, setPassword] = useState("");
        const [profile, setProfile] = useState<string | null>(null);
       
       const handleSubmit= async(e: React.FormEvent)=>{
       e.preventDefault();
        const SignupUser= await signupUser({ username,email, password, profile});
   
       if (SignupUser) {
        router.push("/signup/otp")
        
       }
       }
   
       return(<div>
         <h1>Signup</h1>
          {isError && <p style={{ color: "red" }}>{isError}</p>}
          <form onSubmit={handleSubmit}>
            <input  value={username} type="username"   placeholder="Username" onChange={e=>setUsername(e.target.value)}/>
           <input  value={email} type="email"   placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
          <PasswordInput label="Password" onChange={setPassword} value={password}/>
             <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending OTP..." : "Signup"}
        </button>
          </form>
    
       </div>)
   }
 