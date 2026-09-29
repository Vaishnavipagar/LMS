import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { listUsers, deleteUser } from "../../services/admin/userService";

const ITEMS_PER_PAGE = 5;

/* convert role_id → role label */
const getRoleName = (roleId) => {
  if (roleId === 1) return "admin";
  if (roleId === 2) return "student";
  if (roleId === 3) return "instructor";
  return "student";
};

export default function UsersManager() {
  const { user, isLoaded } = useUser();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  /* ================= LOAD USERS ================= */

  const normalizeRole = (role) => {
    if (!role) return "student";
    if (role === "teacher") return "instructor"; // DB → UI mapping
    return role;
  };

  const loadUsers = async () => {
    if (!isLoaded || !user?.id) return;

    setLoading(true);
    setError("");

    try {
      const result = await listUsers(user.id);

      if (result?.success) {
        const mappedUsers = (result.data || []).map((u) => ({
          ...u,
          role: normalizeRole(u.role || getRoleName(Number(u.role_id)))
        }));

        setUsers(mappedUsers);
      } else {
        setError(result?.message || "Failed to load users");
      }
    } catch (err) {
      console.error(err);
      setError("Network error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [user?.id, isLoaded]);

  /* reset page when filter/search changes */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedRole]);

  /* ================= FILTER + SEARCH ================= */

  const processedUsers = useMemo(() => {
    let data = [...users];

    if (selectedRole) {
      data = data.filter((u) => u.role === selectedRole);
    }

    if (search) {
      data = data.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";

      if (sortDirection === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return data;
  }, [users, search, selectedRole, sortField, sortDirection]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= ACTIONS ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await deleteUser(user.id, id);

      if (!res?.success) {
        alert(res?.message || "Delete failed");
        return;
      }

      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected users?")) return;

    try {
      for (let id of selectedUsers) {
        await deleteUser(user.id, id);
      }

      setSelectedUsers([]);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed");
    }
  };

  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="p-6 space-y-6">

      <h3 className="text-2xl font-semibold">User Management</h3>

      {error && <p className="text-red-400">{error}</p>}

      {/* CONTROLS */}

      <div className="flex flex-wrap gap-4 items-center">

        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-black/40 border border-gray-700 rounded w-64"
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 bg-black/40 border border-gray-700 rounded"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>

        {selectedUsers.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Delete Selected ({selectedUsers.length})
          </button>
        )}
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/40">
            <tr>
              <th className="p-3"></th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("name")}>Name</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("email")}>Email</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("role")}>Role</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort("created_at")}>Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center">Loading...</td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr key={u.id} className="border-t border-gray-800 hover:bg-black/30">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => toggleSelect(u.id)}
                    />
                  </td>

                  <td className="p-3">{u.name || "-"}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>

                  <td className="p-3">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-cyan-500 text-white"
                  : "bg-black/40"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}