"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../components/Buttons/saveButton";

export default function LibraryDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "books" | "students" | "transactions"
  >("overview");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  // Simple demo data
  const demoData = {
    stats: {
      totalBooks: 1247,
      totalStudents: 856,
      totalStaff: 42,
      totalCategories: 28,
      activeBorrowings: 167,
      overdueBooks: 23,
    },
    books: [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        category: "Fiction",
        status: "Available",
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        category: "Fiction",
        status: "Available",
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        year: 1949,
        category: "Science Fiction",
        status: "Borrowed",
      },
    ],
    students: [
      {
        id: 1,
        name: "John Doe",
        course: "Computer Science",
        year: 3,
        status: "Active",
      },
      {
        id: 2,
        name: "Jane Smith",
        course: "Engineering",
        year: 2,
        status: "Active",
      },
      {
        id: 3,
        name: "Mike Johnson",
        course: "Business",
        year: 4,
        status: "Active",
      },
    ],
    transactions: [
      {
        id: 1,
        student: "John Doe",
        book: "The Great Gatsby",
        date: "2024-01-15",
        status: "Returned",
      },
      {
        id: 2,
        student: "Jane Smith",
        book: "1984",
        date: "2024-01-18",
        status: "Borrowed",
      },
    ],
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Simple check - if we have a token, consider user logged in
    setUser("Library User");
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading Dashboard...</div>
      </div>
    );
  }

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
              <p className="text-gray-600">Welcome back, {user}! • Demo Mode</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Navigation */}
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
            <button
              onClick={() => router.push("/positions")}
              className="flex-1 py-3 px-6 font-semibold rounded-lg transition-all text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-sm"
            >
              Positions CRUD
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6">
          {activeTab === "overview" && <Overview stats={demoData.stats} />}
          {activeTab === "books" && <Books books={demoData.books} />}
          {activeTab === "students" && (
            <Students students={demoData.students} />
          )}
          {activeTab === "transactions" && (
            <Transactions records={demoData.transactions} />
          )}
        </div>

        {/* Demo Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔧 Demo Dashboard - Showing sample data
          </p>
        </div>
      </div>
    </div>
  );
}

// Overview Component
function Overview({ stats }: { stats: any }) {
  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: "📚",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: "👨‍🎓",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: "👩‍🏫",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Active Borrowings",
      value: stats.activeBorrowings,
      icon: "📖",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: "⏰",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: "🏷️",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Library Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
            <p className="text-4xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Books Component
function Books({ books }: { books: any[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Book Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {book.title}
            </h3>
            <p className="text-gray-600 mb-1">{book.author}</p>
            <p className="text-sm text-gray-500 mb-2">Published: {book.year}</p>
            <div className="flex justify-between items-center">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {book.category}
              </span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  book.status === "Available"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {book.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Students Component
function Students({ students }: { students: any[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Student Directory
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {student.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {student.status}
              </span>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {student.name}
            </h3>
            <p className="text-gray-600 mb-1">{student.course}</p>
            <p className="text-sm text-gray-500">Year {student.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Transactions Component
function Transactions({ records }: { records: any[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Borrowing Activity
      </h2>
      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{record.book}</h3>
                <p className="text-sm text-gray-600">
                  Borrowed by {record.student}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Date: {record.date}
                </p>
              </div>
              <span
                className={`px-3 py-2 rounded-full text-sm font-semibold ${
                  record.status === "Returned"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {record.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
