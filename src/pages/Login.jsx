import React from "react";
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-20">
      <SignIn 
        path="/login"
        routing="path"
        signUpUrl="/signup" 
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