import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  listCourses,
  addCourse,
  deleteCourse,
  updateCourse
} from "../../services/admin/courseService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

export default function CoursesManager() {

  const { user, isLoaded } = useUser();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [courseType, setCourseType] = useState("manual");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    level: "beginner",
    instructor: "",
    category: "Linux",
    image: "",
    youtube_url: "",
    color: "#3B82F6"
  });

  const getClerkId = () =>
    user?.id ||
    localStorage.getItem("admin_clerk_id") ||
    localStorage.getItem("clerkId");

  /* LOAD COURSES */

  const loadCourses = async () => {

    const id = getClerkId();

    if (!isLoaded || !id) return;

    setLoading(true);

    try {

      const result = await listCourses(id);

      if (result?.success) {
        setCourses(result.data || []);
      } else {
        setError(result?.message || "Failed to load courses");
      }

    } catch (err) {

      console.error(err);
      setError("Network error loading courses");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (!isLoaded || !user?.id) return;

    loadCourses();

  }, [isLoaded, user?.id]);

  /* DELETE */

  const handleDeleteCourse = async (courseId) => {

    const id = getClerkId();
    if (!id) return;

    if (!window.confirm("Delete this course?")) return;

    try {

      const result = await deleteCourse(id, courseId);

      if (result?.success) {

        setCourses(prev =>
          prev.filter(c => c.id !== courseId)
        );

        setSuccess("Course deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);

      } else {
        setError(result?.message || "Failed to delete course");
      }

    } catch {
      setError("Network error deleting course");
    }
  };

  /* INPUT */

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* VALIDATION */

  const validateForm = () => {

    if (!formData.title.trim())
      return "Title is required";

    if (formData.price === "" || isNaN(formData.price))
      return "Valid price required";

    if (!formData.instructor.trim())
      return "Instructor required";

    if (courseType === "manual" && !formData.description.trim())
      return "Description required";

    if (courseType === "youtube" && !formData.youtube_url.trim())
      return "YouTube URL required";

    return null;
  };

  const resetForm = () => {

    setEditingCourse(null);
    setCourseType("manual");

    setFormData({
      title: "",
      description: "",
      price: "",
      duration: "",
      level: "beginner",
      instructor: "",
      category: "Linux",
      image: "",
      youtube_url: "",
      color: "#3B82F6"
    });
  };

  /* ADD */

  const handleAddCourse = async () => {

    const id = getClerkId();
    if (!id) return;

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setActionLoading(true);

    try {

      const result = await addCourse(id, {
        ...formData,
        youtube_url: courseType === "youtube" ? formData.youtube_url : ""
      });

      if (result?.success) {

        setSuccess("Course added successfully!");

        resetForm();
        setShowAddForm(false);

        loadCourses();

        setTimeout(() => setSuccess(""), 3000);

      } else {
        setError(result?.message || "Failed to add course");
      }

    } catch {
      setError("Network error adding course");
    } finally {
      setActionLoading(false);
    }
  };

  /* EDIT */

  const handleEditCourse = (course) => {

    setEditingCourse(course);

    setCourseType(
      course.youtube_url ? "youtube" : "manual"
    );

    setFormData({
      title: course.title || "",
      description: course.description || "",
      price: course.price || "",
      duration: course.duration || "",
      level: course.level || "beginner",
      instructor: course.instructor || "",
      category: course.category || "Linux",
      image: course.image || "",
      youtube_url: course.youtube_url || "",
      color: course.color || "#3B82F6"
    });

    setShowAddForm(true);
  };

  /* UPDATE */

  const handleUpdateCourse = async () => {

    const id = getClerkId();

    if (!id || !editingCourse) return;

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setActionLoading(true);

    try {

      const result = await updateCourse(id, {
        id: editingCourse.id,
        ...formData,
        youtube_url: courseType === "youtube" ? formData.youtube_url : ""
      });

      if (result?.success) {

        setSuccess("Course updated successfully!");

        resetForm();
        setShowAddForm(false);

        loadCourses();

      } else {
        setError(result?.message || "Failed to update");
      }

    } catch {
      setError("Network error updating course");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return <LoadingSpinner message="Loading courses..." />;

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">

        <h3 className="text-xl font-semibold text-white">
          Course Management
        </h3>

        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="bg-green-600 px-4 py-2 rounded-lg text-white"
        >
          + Add Course
        </button>

      </div>

      {error && <ErrorMessage message={error} />}
      {success && <p className="text-green-400">{success}</p>}

      {/* ADD / EDIT FORM */}

      {showAddForm && (

        <div className="bg-gray-900 p-6 rounded border border-gray-700 space-y-4">

          <h4 className="text-white text-lg font-semibold">
            {editingCourse ? "Edit Course" : "Add Course"}
          </h4>

          {/* COURSE TYPE */}

          <div className="flex gap-6 text-white">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={courseType === "manual"}
                onChange={() => setCourseType("manual")}
              />
              Manual Course
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={courseType === "youtube"}
                onChange={() => setCourseType("youtube")}
              />
              YouTube Course
            </label>

          </div>

          <input
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <input
            name="instructor"
            placeholder="Instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <input
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <input
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />

          {courseType === "youtube" && (

            <input
              name="youtube_url"
              placeholder="YouTube URL"
              value={formData.youtube_url}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />

          )}

          <div className="flex gap-3">

            <button
              onClick={editingCourse ? handleUpdateCourse : handleAddCourse}
              className="bg-green-600 px-4 py-2 rounded text-white"
            >
              {editingCourse ? "Update Course" : "Add Course"}
            </button>

            <button
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="bg-gray-600 px-4 py-2 rounded text-white"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* COURSE LIST */}

      <div className="grid gap-4">

        {courses.map(course => {

          const youtubeEmbed =
            course.youtube_url
              ? course.youtube_url.replace("watch?v=", "embed/")
              : null;

          return (

            <div
              key={course.id || course.course_id}
              className="bg-gray-900 p-5 rounded border border-gray-700 flex justify-between"
            >

              <div>

                <h4 className="text-white">
                  {course.title}
                </h4>

                <p className="text-gray-400 text-sm">
                  {course.instructor} • ₹{course.price}
                </p>

                {youtubeEmbed && (
                  <iframe
                    className="w-72 h-40 mt-2 rounded"
                    src={youtubeEmbed}
                    title="video"
                    allowFullScreen
                  />
                )}

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => handleEditCourse(course)}
                  className="text-blue-400"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-red-400"
                >
                  Delete
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}