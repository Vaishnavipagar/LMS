import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LessonPlayer from "../../components/course/LessonPlayer";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

export default function CoursePlayer() {
  const { courseId } = useParams();

  const [curriculum, setCurriculum] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* LOAD CURRICULUM */
  const loadCourse = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost/linux/backend/api/admin/admin_curriculum.php?action=course&course_id=${courseId}`
      );

      const data = await res.json();

      if (data.success) {
        setCurriculum(data.data || []);

        // auto select first lesson
        if (data.data?.[0]?.lessons?.[0]) {
          setSelectedLesson(data.data[0].lessons[0]);
        }
      } else {
        setError("Failed to load course");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId]);

  if (loading) return <LoadingSpinner message="Loading course..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* VIDEO PLAYER */}
      <div className="lg:col-span-2">
        <LessonPlayer lesson={selectedLesson} />
      </div>

      {/* LESSON LIST */}
      <div className="bg-gray-900 rounded-xl p-5 border border-white/10">
        <h2 className="text-lg font-semibold mb-4">
          Course Content
        </h2>

        <div className="space-y-4">
          {curriculum.map((module) => (
            <div key={module.id}>
              <h3 className="text-sm font-bold text-cyan-400 mb-2">
                {module.title}
              </h3>

              {module.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition ${
                    selectedLesson?.id === lesson.id
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}