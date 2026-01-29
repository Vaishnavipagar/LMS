import React from "react";

import CoursesApp from "./CoursesApp";
import MyCoursesApp from "./MyCoursesApp";
import BadgesApp from "./BadgesApp";
import CertificatesApp from "./CertificatesApp";
import NotesApp from "./NotesApp";
import WordApp from "./WordApp";
import SettingsApp from "./SettingsApp";
import AttendanceApp from "./AttendanceApp";
import DefaultApp from "./DefaultApp";

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

    case "notes":
      return <NotesApp />;

    case "word":
      return <WordApp />;

    case "settings":
      return <SettingsApp />;

    case "attendance":
      return <AttendanceApp />;

    default:
      return <DefaultApp type={type} />;
  }
}