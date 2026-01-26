import React from "react";
import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-20">
      <SignUp 
        path="/signup" 
        routing="path"
        signInUrl="/login" 
        fallbackRedirectUrl="/" 
        appearance={{
          elements: {
            card: "shadow-2xl border border-slate-200 rounded-2xl",
            rootBox: "w-full max-w-md",
          },
        }}
      />
    </div>
  );
}