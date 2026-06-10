import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function LinksTable() {
  const [search, setSearch] = useState("");

  const links = useQuery(api.links.getUserLinks, {});
  const deleteLink = useMutation(api.links.deleteLink);
  const bulkDeleteLinks = useMutation(api.links.bulkDeleteLinks);


  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (links === undefined) {
    return <p>Loading...</p>;
  }

  if (links.length === 0) {
    return (
      <div className=" border p-8 text-center">
        <h3 className="text-xl font-semibold">
          No links yet
        </h3>

        <p className="mt-2 text-slate-400">
          Create your first shortened URL.
        </p>
      </div>
    );
  }

  const filteredLinks = links.filter((link) => {
    const isExpired = link.expiresAt && Date.now() > link.expiresAt;

    const matchesSearch =
      link.shortSlug.toLowerCase().includes(search.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !isExpired) ||
      (statusFilter === "expired" && isExpired);

    const matchesStartDate =
      !startDate || link.createdAt >= new Date(startDate).getTime();

    const matchesEndDate =
      !endDate ||
      link.createdAt <= new Date(endDate).setHours(23, 59, 59, 999);

    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="overflow-x-auto">
      {/* <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search links..."
        className="mb-4 w-full border p-3 text-black"
      /> */}

      <div className="mb-4 grid gap-3 md:grid-cols-4">
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search slug or URL..."
    className=" border p-3 text-black"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className=" border p-3 text-black"
  >
    <option value="all">All Status</option>
    <option value="active">Active</option>
    <option value="expired">Expired</option>
  </select>

  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className=" border p-3 text-black"
  />

  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className=" border p-3 text-black"
  />
</div>
      {selectedIds.length > 0 && (
  <button
    type="button"
    onClick={() => {
      const confirmed = window.confirm(
        `Delete ${selectedIds.length} selected link(s)?`
      );

      if (confirmed) {
        bulkDeleteLinks({
          linkIds: selectedIds as any,
        });

        setSelectedIds([]);
      }
    }}
    className="rounded bg-red-700 px-4 py-2 text-white"
  >
    Delete Selected ({selectedIds.length})
  </button>
)}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3">
              <input
                type="checkbox"
                checked={
                  filteredLinks.length > 0 &&
                  selectedIds.length === filteredLinks.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(filteredLinks.map((link) => link._id));
                  } else {
                    setSelectedIds([]);
                  }
                }}
              />
            </th>

            <th className="p-3 text-left">
              Slug
            </th>

            <th className="p-3 text-left">
              Original URL
            </th>

            <th className="p-3 text-left">
              Clicks
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredLinks.map((link) => {
            const isExpired =
              link.expiresAt &&
              Date.now() >
              link.expiresAt;

            return (

              <tr
                key={link._id}
                className="border-b"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(link._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, link._id]);
                      } else {
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== link._id)
                        );
                      }
                    }}
                  />
                </td>
                <td className="p-3">
                  {link.shortSlug}
                </td>

                <td className="max-w-xs truncate p-3">
                  {link.originalUrl}
                </td>

                <td className="p-3">
                  {link.clickCount}
                </td>

                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-sm ${isExpired
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {isExpired
                      ? "Expired"
                      : "Active"}
                  </span>
                </td>

                <td className="flex gap-2 p-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${link.shortSlug}`
                      )
                    }
                    className="bg-white border-black border-2 px-3 py-1 text-black"
                  >
                    Copy
                  </button>

                  <a
                    href={`/analytics/${link.shortSlug}`}
                    className="bg-white border-black border-2 px-3 py-1 text-black"
                  >
                    Analytics
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const confirmed =
                        window.confirm(
                          "Delete this link?"
                        );

                      if (confirmed) {
                        deleteLink({
                          linkId:
                            link._id,
                        });
                      }
                    }}
                    className="bg-black px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}