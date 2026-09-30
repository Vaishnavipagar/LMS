import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourse } from "../data/courses";

function enrolledKey(id) {
  return `learnaxis_enrolled_${id}`;
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = getCourse(courseId);
  const [enrolled, setEnrolled] = useState(() => !!localStorage.getItem(enrolledKey(courseId)));

  if (!course) {
    return (
      <div className="min-h-screen bg-white pt-32 text-center px-6">
        <h1 className="text-xl font-extrabold">Course not found</h1>
        <button onClick={() => navigate("/courses")} className="mt-5 rounded-lg bg-[#0a4a3c] text-white px-6 py-3 text-sm font-bold">
          Back to courses
        </button>
      </div>
    );
  }

  const enroll = () => {
    if (!localStorage.getItem("learnaxis_user")) {
      navigate("/login");
      return;
    }
    localStorage.setItem(enrolledKey(course.id), "1");
    setEnrolled(true);
  };

  return (
    <div className="bg-[#f4f6f4] min-h-screen pt-24 pb-16">
      <div className="w-full max-w-4xl mx-auto px-5">
        <img src={course.img} alt={course.title} className="block w-full h-72 object-cover rounded-2xl" />
        <p className="text-[12px] text-gray-500 font-semibold mt-5">{course.cat} • {course.instructor}</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">{course.title}</h1>
        <p className="text-sm text-gray-500 mt-3">
          {course.students} students · {course.lessons} lessons · ★★★★★ ({course.reviews} Reviews)
        </p>
        {enrolled && (
          <p className="mt-4 text-[13px] font-bold text-[#0a4a3c] bg-[#c9f29b]/40 border border-[#0a4a3c]/20 rounded-lg px-4 py-3">
            Enrolled. Start with lesson 1 — your progress saves in this browser demo.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={enroll}
            className={`rounded-lg px-7 py-3 text-sm font-extrabold transition ${enrolled ? "bg-[#0a4a3c] text-white" : "bg-[#f2d90d] text-black hover:brightness-110"}`}
          >
            {enrolled ? "Enrolled ✓" : `Enroll for ${course.price}`}
          </button>
          <button onClick={() => navigate("/courses")} className="rounded-lg border border-gray-300 bg-white px-7 py-3 text-sm font-bold hover:border-black transition">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
