import { useState, useEffect, useMemo } from "react";
import { adminService } from "../../services/adminService";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("joinedDate");
  const [selectedUser, setSelectedUser] = useState(null); // For User Details Drawer
  const [userToDelete, setUserToDelete] = useState(null); // For Delete Confirmation Modal
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(adminService.getUsers());
  };

  // Search & Filter Logic
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "All" || user.role === roleFilter;
        const matchesStatus = statusFilter === "All" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "aiUsageScore") return b.aiUsageScore - a.aiUsageScore;
        return new Date(b.joinedDate) - new Date(a.joinedDate);
      });
  }, [users, search, roleFilter, statusFilter, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Action Handlers
  const handleRoleChange = (userId, newRole) => {
    const updated = adminService.updateUserRole(userId, newRole);
    setUsers(updated);
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
  };

  const handleStatusToggle = (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    const updated = adminService.updateUserStatus(userId, newStatus);
    setUsers(updated);
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    const updated = adminService.deleteUser(userToDelete.id);
    setUsers(updated);
    if (selectedUser && selectedUser.id === userToDelete.id) {
      setSelectedUser(null);
    }
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Directory & Access Control
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage user accounts, admin permissions, active status, and individual AI consumption metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs">
            Total Users: <strong className="text-indigo-600">{users.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin Only</option>
          <option value="User">User Only</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white"
        >
          <option value="joinedDate">Sort by: Registration Date</option>
          <option value="name">Sort by: Name</option>
          <option value="aiUsageScore">Sort by: AI Request Usage</option>
        </select>
      </div>

      {/* Main Users Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">AI Usage</th>
                <th className="px-6 py-3.5">Joined</th>
                <th className="px-6 py-3.5">Last Active</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-indigo-50/30 cursor-pointer"
                    onClick={() => setSelectedUser(u)}
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{u.name}</span>
                          <span className="text-[11px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition ${
                          u.role === "Admin"
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          u.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : u.status === "Suspended"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === "Active"
                              ? "bg-emerald-500"
                              : u.status === "Suspended"
                              ? "bg-rose-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>

                    {/* AI Usage Progress Bar */}
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span>Score</span>
                          <span>{u.aiUsageScore}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-600"
                            style={{ width: `${u.aiUsageScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {u.joinedDate}
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-4 text-slate-500">
                      {u.lastActive}
                    </td>

                    {/* Actions Menu */}
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedUser(u)}
                          title="View Details"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
                        >
                          👁️
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleStatusToggle(u.id, u.status)}
                          title={u.status === "Active" ? "Suspend Account" : "Activate Account"}
                          className={`rounded-lg p-1.5 text-xs font-bold transition ${
                            u.status === "Active"
                              ? "text-rose-600 hover:bg-rose-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setUserToDelete(u)}
                          title="Delete User"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50">
          <span className="text-xs text-slate-500">
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredUsers.length} total users)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40 transition hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40 transition hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* USER DETAILS SIDE DRAWER / MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl h-full overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">User Profile Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {/* Profile Card Summary */}
              <div className="mt-6 text-center">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-indigo-500/20"
                />
                <h4 className="mt-3 text-lg font-bold text-slate-900">{selectedUser.name}</h4>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-bold text-indigo-700">
                    {selectedUser.role}
                  </span>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      selectedUser.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-b border-slate-100 py-4 text-xs">
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400 block font-semibold">AI Usage Score</span>
                  <strong className="text-lg text-slate-900">{selectedUser.aiUsageScore}%</strong>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400 block font-semibold">Requests Sent</span>
                  <strong className="text-lg text-slate-900">{selectedUser.requestsCount}</strong>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400 block font-semibold">Roadmaps Created</span>
                  <strong className="text-lg text-slate-900">{selectedUser.roadmapCount}</strong>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="text-slate-400 block font-semibold">Mistakes Logged</span>
                  <strong className="text-lg text-slate-900">{selectedUser.mistakesLogged}</strong>
                </div>
              </div>

              {/* Account History */}
              <div className="mt-5 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Account Audit & Activity
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Joined Date</span>
                    <span className="font-semibold text-slate-800">{selectedUser.joinedDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Last Active</span>
                    <span className="font-semibold text-slate-800">{selectedUser.lastActive}</span>
                  </div>
                  <div className="py-2 bg-indigo-50/50 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase block">
                      Recent Activity
                    </span>
                    <span className="font-semibold text-slate-800 text-xs">
                      {selectedUser.recentActivity}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleStatusToggle(selectedUser.id, selectedUser.status)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Toggle Status
              </button>
              <button
                onClick={() => {
                  setUserToDelete(selectedUser);
                  setSelectedUser(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mx-auto text-xl font-bold">
              ⚠️
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Delete User Account?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-slate-900">{userToDelete.name}</strong> ({userToDelete.email})? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
