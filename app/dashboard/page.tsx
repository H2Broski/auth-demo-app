"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/app/components/Buttons/saveButton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://nestjsdemo-8840.onrender.com";

interface Stats {
  totalBooks: number;
  totalStudents: number;
  totalStaff: number;
  totalCategories: number;
  activeBorrowings: number;
  overdueBooks: number;
}

interface Book {
  book_id: number;
  title: string;
  author: string;
  published_year: number;
  category_name: string;
}

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  course: string;
  year_level: number;
}

interface BorrowRecord {
  borrow_id: number;
  student_name: string;
  book_title: string;
  staff_name: string;
  borrow_date: string;
  return_date: string | null;
}

// Mock data for fallback
const mockStats = {
  totalBooks: 1247,
  totalStudents: 856,
  totalStaff: 42,
  totalCategories: 28,
  activeBorrowings: 167,
  overdueBooks: 23,
};

const mockBooks = [
  {
    book_id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    published_year: 1925,
    category_name: "Classic Literature",
  },
  {
    book_id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    published_year: 1960,
    category_name: "Fiction",
  },
];

const mockStudents = [
  {
    student_id: 1,
    first_name: "John",
    last_name: "Doe",
    course: "Computer Science",
    year_level: 3,
  },
  {
    student_id: 2,
    first_name: "Jane",
    last_name: "Smith",
    course: "Engineering",
    year_level: 2,
  },
];

const mockBorrowRecords = [
  {
    borrow_id: 1,
    student_name: "John Doe",
    book_title: "The Great Gatsby",
    staff_name: "Dr. Wilson",
    borrow_date: "2024-01-15",
    return_date: "2024-01-22",
  },
  {
    borrow_id: 2,
    student_name: "Jane Smith",
    book_title: "1984",
    staff_name: "Dr. Wilson",
    borrow_date: "2024-01-18",
    return_date: null,
  },
];

export default function LibraryDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "books" | "students" | "transactions"
  >("overview");
  const [stats, setStats] = useState<Stats>(mockStats);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [borrowRecords, setBorrowRecords] =
    useState<BorrowRecord[]>(mockBorrowRecords);
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
    fetchRealData();
  };

  useEffect(() => {
    if (!loading && activeTab !== "overview") {
      if (activeTab === "books") fetchBooks();
      if (activeTab === "students") fetchStudents();
      if (activeTab === "transactions") fetchBorrowRecords();
    }
  }, [activeTab, loading]);

  // Fetch functions
  const fetchWithAuth = async (url: string) => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      throw new Error("No token");
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      clearToken();
      router.push("/login");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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
      } else {
        setUseMockData(true);
      }
    } catch (error) {
      console.error("Failed to fetch real data, using mock data:", error);
      setUseMockData(true);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setDataLoading(true);
      if (useMockData) {
        setBooks(mockBooks);
      } else {
        const data = await fetchWithAuth(`${API_BASE_URL}/api/books`);
        setBooks(data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks(mockBooks);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setDataLoading(true);
      if (useMockData) {
        setStudents(mockStudents);
      } else {
        const data = await fetchWithAuth(`${API_BASE_URL}/api/students`);
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents(mockStudents);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchBorrowRecords = async () => {
    try {
      setDataLoading(true);
      if (useMockData) {
        setBorrowRecords(mockBorrowRecords);
      } else {
        const data = await fetchWithAuth(`${API_BASE_URL}/api/borrow-records`);
        setBorrowRecords(data);
      }
    } catch (error) {
      console.error("Error fetching borrow records:", error);
      setBorrowRecords(mockBorrowRecords);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
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

// Component functions
function Overview({ stats }: { stats: Stats }) {
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
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${
              colorClasses[stat.color as keyof typeof colorClasses]
            } text-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200`}
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
    </div>
  );
}

function Books({ books }: { books: Book[] }) {
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

function Students({ students }: { students: Student[] }) {
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

function Transactions({ records }: { records: BorrowRecord[] }) {
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
