import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { listPayments, addPayment } from "../../services/admin/paymentService";
import { listUsers } from "../../services/admin/userService";
import { listCourses } from "../../services/admin/courseService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

export default function PaymentsManager() {

const { user, isLoaded } = useUser();

/* SAVE ADMIN CLERK ID AUTOMATICALLY */

useEffect(() => {
if (user?.id) {
localStorage.setItem("admin_clerk_id", user.id);
}
}, [user]);

const [payments, setPayments] = useState([]);
const [revenue, setRevenue] = useState({
total_revenue: 0,
monthly_revenue: 0,
today_revenue: 0
});

const [users, setUsers] = useState([]);
const [courses, setCourses] = useState([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [showAddForm, setShowAddForm] = useState(false);

const [formData, setFormData] = useState({
clerk_id: "",
course_id: "",
amount: "",
payment_method: "cash"
});

const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

/* ================= ADMIN CLERK ID ================= */

const getClerkId = () => {

if (user?.id) return user.id;

const storedAdmin = localStorage.getItem("admin_clerk_id");
const storedUser = localStorage.getItem("clerkId");

return storedAdmin || storedUser || null;

};

/* ================= LOAD DATA ================= */

const loadData = async () => {

const id = getClerkId();

if (!isLoaded || !id) return;

setLoading(true);
setError("");

try {

/* PAYMENTS */

const paymentsResult = await listPayments(id, { page: currentPage });

if (paymentsResult?.success) {

setPayments(paymentsResult.data || []);
setRevenue(paymentsResult.revenue || {});
setTotalPages(paymentsResult.pagination?.pages || 1);

}

/* USERS (STUDENTS ONLY) */

const usersResult = await listUsers(id);

if (usersResult?.success) {

const normalizedUsers = (usersResult.data || [])
.filter((u) => (u.role || "").toLowerCase() === "student")
.map((u) => ({
clerk_id: u.clerk_id,
name: u.name || u.email,
email: u.email
}));

setUsers(normalizedUsers);

} else {

setUsers([]);

}

/* COURSES */

const coursesResult = await listCourses(id);

if (coursesResult?.success) {

setCourses(Array.isArray(coursesResult.data) ? coursesResult.data : []);

} else {

setCourses([]);

}

} catch (err) {

console.error("Payments load error:", err);
setError("Failed to load payment data");

} finally {

setLoading(false);

}

};

useEffect(() => {

if (!isLoaded || !user?.id) return;
loadData();

}, [user?.id, isLoaded, currentPage]);

/* ================= OPEN FORM ================= */

const openAddForm = async () => {

await loadData();
setShowAddForm(true);

};

/* ================= ADD PAYMENT ================= */

const handleAddPayment = async () => {

const id = getClerkId();

if (!id) {

setError("Admin authentication required");
return;

}

if (!formData.clerk_id || !formData.course_id || !formData.amount) {

setError("Please fill all fields");
return;

}

try {

const result = await addPayment(id, formData);

if (result?.success) {

setSuccess("Payment recorded successfully!");

setShowAddForm(false);

setFormData({
clerk_id: "",
course_id: "",
amount: "",
payment_method: "cash"
});

loadData();

setTimeout(() => setSuccess(""), 3000);

} else {

setError(result?.message || "Failed to record payment");

}

} catch (err) {

console.error(err);
setError("Network error");

}

};

const formatCurrency = (amount) => {

return new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR"
}).format(amount || 0);

};

if (loading) return <LoadingSpinner message="Loading payments..." />;

return (

<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="p-6 space-y-6"

>

<div className="flex justify-between items-center">

<h2 className="text-2xl font-bold">Payments Management</h2>

<button
onClick={openAddForm}
className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"

>

* Add Payment

</button>

</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-gradient-to-br from-green-900 to-green-700 p-6 rounded-xl">
<p className="text-sm opacity-80">Total Revenue</p>
<p className="text-3xl font-bold">
{formatCurrency(revenue.total_revenue)}
</p>
</div>

<div className="bg-gradient-to-br from-blue-900 to-blue-700 p-6 rounded-xl">
<p className="text-sm opacity-80">Monthly Revenue</p>
<p className="text-3xl font-bold">
{formatCurrency(revenue.monthly_revenue)}
</p>
</div>

<div className="bg-gradient-to-br from-purple-900 to-purple-700 p-6 rounded-xl">
<p className="text-sm opacity-80">Today's Revenue</p>
<p className="text-3xl font-bold">
{formatCurrency(revenue.today_revenue)}
</p>
</div>

</div>

{error && <ErrorMessage message={error} />}
{success && <p className="text-green-400">{success}</p>}

{showAddForm && (

<div className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">

<h3 className="text-lg font-semibold">Record New Payment</h3>

<select
value={formData.clerk_id}
onChange={(e) =>
setFormData({ ...formData, clerk_id: e.target.value })
}
className="w-full p-3 bg-black/40 border border-gray-700 rounded"

>

<option value="">Select Student</option>

{users.map((u) => (

<option key={u.clerk_id || u.email} value={u.clerk_id}>
{u.name} {u.email ? `(${u.email})` : ""}
</option>

))}

</select>

<select
value={formData.course_id}
onChange={(e) => {

const course = courses.find(
(c) => c.id === parseInt(e.target.value)
);

setFormData({
...formData,
course_id: e.target.value,
amount: course?.price || ""
});

}}
className="w-full p-3 bg-black/40 border border-gray-700 rounded"

>

<option value="">Select Course</option>

{courses.map((course) => (

<option key={course.id} value={course.id}>
{course.title} - {formatCurrency(course.price)}
</option>

))}

</select>

<input
type="number"
placeholder="Amount"
value={formData.amount}
onChange={(e) =>
setFormData({ ...formData, amount: e.target.value })
}
className="w-full p-3 bg-black/40 border border-gray-700 rounded"
/>

<select
value={formData.payment_method}
onChange={(e) =>
setFormData({
...formData,
payment_method: e.target.value
})
}
className="w-full p-3 bg-black/40 border border-gray-700 rounded"

>

<option value="cash">Cash</option>
<option value="card">Card</option>
<option value="online">Online</option>

</select>

<div className="flex gap-4">

<button
onClick={handleAddPayment}
className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700"

>

Save Payment

</button>

<button
onClick={() => setShowAddForm(false)}
className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600"

>

Cancel

</button>

</div>

</div>

)}

</motion.div>

);

}
