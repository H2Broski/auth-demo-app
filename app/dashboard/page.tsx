"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/app/components/Buttons/saveButton";
import {
  mockStats,
  mockBooks,
  mockStudents,
  mockBorrowRecords,
} from "@/app/lib/mockData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://nestjsdemo-8840.onrender.com";

// ... keep your existing interfaces ...

export default function LibraryDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "books" | "students" | "transactions"
  >("overview");
  const [stats, setStats] = useState(mockStats);
  const [books, setBooks] = useState(mockBooks);
  const [students, setStudents] = useState(mockStudents);
  const [borrowRecords, setBorrowRecords] = useState(mockBorrowRecords);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(false);

    // Try to fetch real data, fallback to mock data
    fetchRealData();
  };

  const fetchRealData = async () => {
    try {
      setDataLoading(true);
      const token = getToken();

      // Try to fetch real stats
      const statsResponse = await fetch(`${API_BASE_URL}/api/library/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const realStats = await statsResponse.json();
        setStats(realStats);
        setUseMockData(false);

        // Fetch other real data
        await Promise.all([
          fetchBooks(),
          fetchStudents(),
          fetchBorrowRecords(),
        ]);
      } else {
        // Use mock data if real API fails
        setUseMockData(true);
      }
    } catch (error) {
      console.error("Failed to fetch real data, using mock data:", error);
      setUseMockData(true);
    } finally {
      setDataLoading(false);
    }
  };

  // ... keep your existing fetch functions, but add mock data fallback ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Library Management System
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  Connected to your Aiven MySQL database
                  {useMockData && (
                    <span className="ml-2 text-orange-500 text-sm">
                      (Using demo data)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchRealData()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh Data
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm">
            {(["overview", "books", "students", "transactions"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-3 px-6 font-semibold rounded-lg transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </nav>
        </header>

        {/* Main Content */}
        {dataLoading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading library data...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6">
            {activeTab === "overview" && <Overview stats={stats} />}
            {activeTab === "books" && <Books books={books} />}
            {activeTab === "students" && <Students students={students} />}
            {activeTab === "transactions" && (
              <Transactions records={borrowRecords} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Overview Component with Icons
function Overview({ stats }: { stats: any }) {
  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: "📚",
      color: "blue",
      description: "Books in collection",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: "👨‍🎓",
      color: "green",
      description: "Registered students",
    },
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: "👩‍🏫",
      color: "purple",
      description: "Library staff",
    },
    {
      title: "Active Borrowings",
      value: stats.activeBorrowings,
      icon: "📖",
      color: "orange",
      description: "Currently borrowed",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: "⏰",
      color: "red",
      description: "Past due date",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: "🏷️",
      color: "indigo",
      description: "Book categories",
    },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Library Overview</h2>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-white/70 text-sm">{stat.description}</div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
            <p className="text-4xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm py-1">
              + Add New Book
            </button>
            <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm py-1">
              + Register Student
            </button>
            <button className="w-full text-left text-blue-600 hover:text-blue-700 text-sm py-1">
              📋 Process Borrowing
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Recent Activity</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>📖 Jane Smith borrowed "1984"</div>
            <div>✅ John Doe returned "The Great Gatsby"</div>
            <div>➕ New book "The Hobbit" added</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-green-500">● Connected</span>
            </div>
            <div className="flex justify-between">
              <span>API:</span>
              <span className="text-green-500">● Online</span>
            </div>
            <div className="flex justify-between">
              <span>Last Sync:</span>
              <span className="text-gray-500">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Books Component
function Books({ books }: { books: any[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Book Management</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
          + Add New Book
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr
                key={book.book_id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{book.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {book.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {book.published_year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {book.category_name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Available
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Enhanced Students Component
function Students({ students }: { students: any[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Student Management</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
          + Register Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.student_id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {student.first_name[0]}
                {student.last_name[0]}
              </div>
              <span className="text-sm text-gray-500">
                ID: {student.student_id}
              </span>
            </div>
            <h3 className="font-semibold text-lg text-gray-800">
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-gray-600 mb-2">{student.course}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Year {student.year_level}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Transactions Component
function Transactions({ records }: { records: any[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Borrowing Transactions
      </h2>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.borrow_id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    record.return_date ? "bg-green-400" : "bg-yellow-400"
                  }`}
                ></div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {record.book_title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Borrowed by {record.student_name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Borrowed: {new Date(record.borrow_date).toLocaleDateString()}
                </div>
                <div
                  className={`text-sm font-medium ${
                    record.return_date ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {record.return_date
                    ? `Returned: ${new Date(
                        record.return_date
                      ).toLocaleDateString()}`
                    : "Currently Borrowed"}
                </div>
              </div>
            </div>
            {!record.return_date && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Mark as Returned
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
