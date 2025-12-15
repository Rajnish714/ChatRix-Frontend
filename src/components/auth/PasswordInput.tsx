
"use client";
import { useState } from "react";
type Props = {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
};

export function PasswordInput({label,value,onChange}:Props){
      const [show, setShow] = useState(false);
    
    return(<div>
        {label && <label>{label}</label>}
       
        <input  
        type={show ? "text" : "password"}
        placeholder="Password"
        maxLength={12}
        value={value} 
        onChange={e=>onChange(e.target.value)}/>

       <button
        type="button"
        onClick={() => setShow((s) => !s)}
      >
        {show ? "Hide" : "Show"}
      </button></div>)
}