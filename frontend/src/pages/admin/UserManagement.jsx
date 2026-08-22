import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/api";

const formatDate = (value) => (value ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Never");

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    const result = await adminApi.getUsers();
    if (result.success) setUsers(result.users);
    else setError(result.error || "Could not load users from the database.");
    setLoading(false);
  };
  useEffect(() => { loadUsers(); }, []);

  const displayedUsers = useMemo(() => users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase())
  ), [users, search]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently? This cannot be undone.")) return;
    setDeleting(id);
    const result = await adminApi.deleteUser(id);
    if (result.success) setUsers((current) => current.filter((user) => user.id !== id));
    else setError(result.error || "Could not delete this user.");
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">User Directory</h2>
          <p className="mt-1 text-xs text-slate-500">Live user accounts stored in MongoDB.</p>
        </div>
        <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">Total users: {users.length}</span>
      </div>
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or role..." className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Registered</th><th className="px-5 py-3">Last login</th><th className="px-5 py-3" /></tr></thead>
          <tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-400">Loading database users…</td></tr> : displayedUsers.map((user) => <tr key={user.id}><td className="px-5 py-4 font-semibold text-slate-900">{user.name}</td><td className="px-5 py-4 text-slate-600">{user.email}</td><td className="px-5 py-4 capitalize">{user.role}</td><td className="px-5 py-4 capitalize">{user.status}</td><td className="px-5 py-4 text-slate-600">{formatDate(user.createdAt)}</td><td className="px-5 py-4 text-slate-600">{formatDate(user.lastLoginAt)}</td><td className="px-5 py-4 text-right"><button onClick={() => deleteUser(user.id)} disabled={deleting === user.id} className="text-xs font-bold text-rose-600 disabled:opacity-50">{deleting === user.id ? "Deleting…" : "Delete"}</button></td></tr>)}
          {!loading && !displayedUsers.length && <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-400">No database users found.</td></tr>}</tbody>
        </table></div>
      </div>
    </div>
  );
}
