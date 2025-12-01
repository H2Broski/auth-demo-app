"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../components/Buttons/saveButton";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://nestjsdemo-8840.onrender.com";

interface Position {
  position_id: number;
  position_code: string;
  position_name: string;
}

export default function PositionsDashboard() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchPositions();
  }, [router]);

  const fetchPositions = async () => {
    const token = getToken();
    if (!token) return;

    setRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/positions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPositions(data);
        setError("");
      } else {
        setError("Failed to fetch positions");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/positions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          position_code: positionCode,
          position_name: positionName,
        }),
      });

      if (response.ok) {
        setSuccess("Position created successfully!");
        setPositionCode("");
        setPositionName("");
        fetchPositions();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create position");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  const handleEdit = (position: Position) => {
    setEditingId(position.position_id);
    setPositionCode(position.position_code);
    setPositionName(position.position_name);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setError("");
    setSuccess("");

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/positions/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          position_code: positionCode,
          position_name: positionName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Position updated successfully!");
        setPositionCode("");
        setPositionName("");
        setEditingId(null);
        await fetchPositions();
      } else {
        setError(data.message || "Failed to update position");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this position?")) return;

    setError("");
    setSuccess("");

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/positions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Position deleted successfully!");
        await fetchPositions();
      } else {
        setError(data.message || "Failed to delete position");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setPositionCode("");
    setPositionName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Positions Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={fetchPositions}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Refreshing...
                </>
              ) : (
                "Refresh"
              )}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Create/Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingId ? "Edit Position" : "Create Position"}
          </h2>
          <form
            onSubmit={editingId ? handleUpdate : handleCreate}
            className="flex gap-4"
          >
            <input
              type="text"
              placeholder="Position Code"
              value={positionCode}
              onChange={(e) => setPositionCode(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Position Name"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Positions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Positions List</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Code
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {positions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        No positions found. Create one above!
                      </td>
                    </tr>
                  ) : (
                    positions.map((position) => (
                      <tr
                        key={position.position_id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{position.position_id}</td>
                        <td className="py-3 px-4">{position.position_code}</td>
                        <td className="py-3 px-4">{position.position_name}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(position)}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-1 rounded font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(position.position_id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
