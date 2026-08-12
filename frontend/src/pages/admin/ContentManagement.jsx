import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

export default function ContentManagement() {
  const [contentList, setContentList] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    setContentList(adminService.getContent());
  }, []);

  const filteredContent = contentList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    const updated = adminService.deleteContent(itemToDelete.id);
    setContentList(updated);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Content & Generated Learning Assets
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review, publish, archive, or delete generated roadmaps, concept maps, and mistake maps across the system.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white sm:w-72"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none"
        >
          <option value="All">All Content Types</option>
          <option value="Roadmap">Roadmap</option>
          <option value="Concept Map">Concept Map</option>
          <option value="Mistake Map">Mistake Map</option>
          <option value="Skill Gap Report">Skill Gap Report</option>
        </select>
      </div>

      {/* Content Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">Asset Title</th>
                <th className="px-6 py-3.5">Author</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Views</th>
                <th className="px-6 py-3.5">Created</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredContent.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No content items found.
                  </td>
                </tr>
              ) : (
                filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/20 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{item.title}</td>
                    <td className="px-6 py-4 text-slate-600">{item.author}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{item.views}</td>
                    <td className="px-6 py-4 text-slate-500">{item.createdDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h4 className="text-lg font-bold text-slate-900 text-center">Delete Content Asset?</h4>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{itemToDelete.title}</strong>?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
