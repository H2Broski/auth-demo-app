"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/app/components/Buttons/saveButton"; // Adjust import based on your actual file structure

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

export default function LibraryDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "books" | "students" | "transactions"
  >("overview");
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalStudents: 0,
    totalStaff: 0,
    totalCategories: 0,
    activeBorrowings: 0,
    overdueBooks: 0,
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // Check authentication on component mount
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
    fetchStats();
  };

  useEffect(() => {
    if (!loading) {
      if (activeTab === "books") fetchBooks();
      if (activeTab === "students") fetchStudents();
      if (activeTab === "transactions") fetchBorrowRecords();
    }
  }, [activeTab, loading]);

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

  const fetchStats = async () => {
    try {
      setDataLoading(true);
      const data = await fetchWithAuth(`${API_BASE_URL}/api/library/stats`);
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setDataLoading(true);
      const data = await fetchWithAuth(`${API_BASE_URL}/api/books`);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setDataLoading(true);
      const data = await fetchWithAuth(`${API_BASE_URL}/api/students`);
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchBorrowRecords = async () => {
    try {
      setDataLoading(true);
      const data = await fetchWithAuth(`${API_BASE_URL}/api/borrow-records`);
      setBorrowRecords(data);
    } catch (error) {
      console.error("Error fetching borrow records:", error);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Library Management System
              </h1>
              <p className="text-gray-600 mt-2">
                Connected to your Aiven MySQL database
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>

          <nav className="flex space-x-4 mt-4 border-b">
            {(["overview", "books", "students", "transactions"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
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
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
            <div className="text-lg">Loading data...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
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

// Component functions (same as before)
function Overview({ stats }: { stats: Stats }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Library Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Books" value={stats.totalBooks} />
        <StatCard title="Total Students" value={stats.totalStudents} />
        <StatCard title="Total Staff" value={stats.totalStaff} />
        <StatCard title="Active Borrowings" value={stats.activeBorrowings} />
        <StatCard title="Overdue Books" value={stats.overdueBooks} />
        <StatCard title="Total Categories" value={stats.totalCategories} />
      </div>
    </div>
  );
}

function Books({ books }: { books: Book[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Book Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.book_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {book.book_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {book.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {book.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {book.published_year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {book.category_name}
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
      <h2 className="text-2xl font-semibold mb-6">Student Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.student_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.student_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.first_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.year_level}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Transactions({ records }: { records: BorrowRecord[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Borrowing Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrow ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrow Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Return Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.borrow_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.borrow_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.student_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.book_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.borrow_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.return_date || "Not Returned"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.return_date
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.return_date ? "Returned" : "Borrowed"}
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

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
      </div>
    </div>
  );
}
