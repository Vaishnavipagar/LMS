import React from "react";
import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-slate-50 pt-24 pb-10 px-4">
      <div className="w-full max-w-md flex items-center justify-center">
        <SignUp 
          path="/signup" 
          routing="path"
          signInUrl="/login" 
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