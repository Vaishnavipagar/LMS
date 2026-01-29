import React from "react";
import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-slate-50 pt-24 pb-10 px-4">
      <div className="w-full max-w-md flex items-center justify-center">
        <SignIn 
          path="/login"
          routing="path"
          signUpUrl="/signup" 
          fallbackRedirectUrl="/" 
          appearance={{
            elements: {
              card: "shadow-2xl border border-slate-200 rounded-2xl",
              rootBox: "mx-auto",
              cardBox: "mx-auto",
            },
          }}
        />
      </div>
    </div>
  );
}