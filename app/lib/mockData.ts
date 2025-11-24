export const mockStats = {
  totalBooks: 1247,
  totalStudents: 856,
  totalStaff: 42,
  totalCategories: 28,
  activeBorrowings: 167,
  overdueBooks: 23,
};

export const mockBooks = [
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
  {
    book_id: 3,
    title: "1984",
    author: "George Orwell",
    published_year: 1949,
    category_name: "Science Fiction",
  },
  {
    book_id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    published_year: 1813,
    category_name: "Classic Literature",
  },
  {
    book_id: 5,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    published_year: 1937,
    category_name: "Fantasy",
  },
];

export const mockStudents = [
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
  {
    student_id: 3,
    first_name: "Michael",
    last_name: "Johnson",
    course: "Business Administration",
    year_level: 4,
  },
  {
    student_id: 4,
    first_name: "Sarah",
    last_name: "Williams",
    course: "Psychology",
    year_level: 1,
  },
  {
    student_id: 5,
    first_name: "David",
    last_name: "Brown",
    course: "Biology",
    year_level: 3,
  },
];

export const mockBorrowRecords = [
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
  {
    borrow_id: 3,
    student_name: "Michael Johnson",
    book_title: "The Hobbit",
    staff_name: "Prof. Brown",
    borrow_date: "2024-01-10",
    return_date: "2024-01-20",
  },
  {
    borrow_id: 4,
    student_name: "Sarah Williams",
    book_title: "Pride and Prejudice",
    staff_name: "Dr. Wilson",
    borrow_date: "2024-01-22",
    return_date: null,
  },
];
