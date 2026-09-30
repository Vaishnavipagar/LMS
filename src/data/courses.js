// DO NOT EDIT COURSES HERE — edit the per-category files instead:
// courses.development.js / courses.business.js / courses.design.js / courses.marketing.js

import { DEVELOPMENT_COURSES } from "./courses.development";
import { BUSINESS_COURSES } from "./courses.business";
import { DESIGN_COURSES } from "./courses.design";
import { MARKETING_COURSES } from "./courses.marketing";

export const TABS = ["All", "Development", "Business", "Design", "Marketing"];

// Home order matches the reference image; /courses page shows all 8.
export const HOME_COURSE_IDS = [
  "business-accounting",
  "finance-management",
  "app-design",
  "genetic-testing",
  "web-design",
  "english-vocab",
];

const ALL = [
  ...DEVELOPMENT_COURSES,
  ...BUSINESS_COURSES,
  ...DESIGN_COURSES,
  ...MARKETING_COURSES,
];

export const ALL_COURSES = HOME_COURSE_IDS.map((id) => ALL.find((c) => c.id === id)).filter(Boolean);

export function getCourse(id) {
  return ALL.find((c) => c.id === id);
}

export function coursesByTab(tab) {
  if (tab === "All") return ALL;
  return ALL.filter((c) => c.tab === tab);
}
