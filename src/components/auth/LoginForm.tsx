   
   
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
   return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
      
  
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Login
      </h1>


      {isError && (
        <p className="text-sm text-red-600 text-center">
          {isError}
        </p>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          id="Email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium
                     hover:bg-blue-700 transition disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex flex-col gap-2 text-sm text-center">
        <button
          onClick={() => router.push("/forgot-password")}
          className="text-blue-600 hover:underline"
        >
          Forgot Password?
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="text-gray-600 hover:underline"
        >
          Don’t have an account? Sign up
        </button>
      </div>
    </div>
  </div>
);
      //  return(<div className="flex items-center justify-center h-screen">
      //    <h1>Login</h1>
      //     {isError && <p style={{ color: "red" }}>{isError}</p>}

      //     <form onSubmit={handleSubmit}>
      //      <input  value={email} type="email"   placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
      //     <PasswordInput label="Password" onChange={setPassword} value={password}/>
      //        <button type="submit" disabled={isLoading}>
      //     {isLoading ? "Logging in..." : "Login"}
      //   </button>
      //     </form>
      //       <button onClick={()=>router.push("/forgot-password")}>Forgot Password</button>
      //    <button onClick={()=>router.push("/signup")}>Signup</button>
      //  </div>)
   }
 