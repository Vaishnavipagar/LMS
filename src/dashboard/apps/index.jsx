import React from "react";

import CoursesApp from "./CoursesApp";
import MyCoursesApp from "./MyCoursesApp";
import BadgesApp from "./BadgesApp";
import CertificatesApp from "./CertificatesApp";
import SettingsApp from "./SettingsApp";

import AdminApp from "../../apps/admin/AdminApp";

function ComingSoon({ type }) {
  return (
    <div className="p-10 text-center">
      <h3 className="text-lg font-bold text-slate-900 capitalize">{type || "App"}</h3>
      <p className="text-sm text-slate-500 mt-2">This section is being rebuilt for the new Supabase + R2 release.</p>
    </div>
  );
}

export function renderApp(type, openWindow) {
  switch (type) {
    case "courses":
      return <CoursesApp />;
    case "mycourses":
      return <MyCoursesApp />;
    case "badges":
      return <BadgesApp />;
    case "certificates":
      return <CertificatesApp />;
    case "settings":
      return <SettingsApp />;
    case "admin":
      return <AdminApp />;
    default:
      return <ComingSoon type={type} />;
  }
}
