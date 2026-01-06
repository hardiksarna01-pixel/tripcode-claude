import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    type: '',
    course: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Mock data
  const mockQuestions = [
    {
      id: 1,
      question: 'What does the GDS code "DL" represent?',
      type: 'mcq',
      options: ['Delta Air Lines', 'Deutsche Lufthansa', 'Dragonair', 'Dan-Air'],
      correctAnswer: 0,
      difficulty: 'easy',
      category: 'GDS & Ticketing',
      course: 'IATA Foundation',
      points: 1,
      tags: ['airline-codes', 'gds'],
      explanation: 'DL is the IATA code for Delta Air Lines, one of the major US carriers.',
      timesUsed: 45,
      successRate: 78
    },
    {
      id: 2,
      question: 'Which of the following is NOT a type of fare?',
      type: 'mcq',
      options: ['Published Fare', 'Private Fare', 'Constructed Fare', 'Reserved Fare'],
      correctAnswer: 3,
      difficulty: 'medium',
      category: 'Fares & Pricing',
      course: 'IATA Foundation',
      points: 2,
      tags: ['fares', 'pricing'],
      explanation: 'Reserved Fare is not a standard fare type. The main types are Published, Private, and Constructed fares.',
      timesUsed: 32,
      successRate: 62
    },
    {
      id: 3,
      question: 'The Amadeus command to display seat map is:',
      type: 'mcq',
      options: ['SM', 'SD', 'SA', 'SB'],
      correctAnswer: 0,
      difficulty: 'easy',
      category: 'Amadeus',
      course: 'Amadeus Basic Reservations',
      points: 1,
      tags: ['amadeus', 'commands'],
      explanation: 'SM is the command to display seat map in Amadeus GDS.',
      timesUsed: 67,
      successRate: 85
    },
    {
      id: 4,
      question: 'TAFI stands for Travel Agents Federation of India.',
      type: 'true_false',
      correctAnswer: true,
      difficulty: 'easy',
      category: 'Industry Knowledge',
      course: 'TAFI Certification Prep',
      points: 1,
      tags: ['associations', 'india'],
      explanation: 'TAFI (Travel Agents Federation of India) is one of the premier travel trade associations in India.',
      timesUsed: 28,
      successRate: 92
    },
    {
      id: 5,
      question: 'What is the primary purpose of a PNR?',
      type: 'mcq',
      options: [
        'To store passenger and itinerary information',
        'To calculate fare prices',
        'To issue boarding passes',
        'To manage crew schedules'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      category: 'GDS & Ticketing',
      course: 'IATA Foundation',
      points: 1,
      tags: ['pnr', 'reservations'],
      explanation: 'A PNR (Passenger Name Record) is a record in the GDS that stores passenger and itinerary information.',
      timesUsed: 89,
      successRate: 91
    },
    {
      id: 6,
      question: 'Match the airline with its hub airport.',
      type: 'matching',
      pairs: [
        { left: 'Emirates', right: 'Dubai (DXB)' },
        { left: 'Singapore Airlines', right: 'Singapore (SIN)' },
        { left: 'Lufthansa', right: 'Frankfurt (FRA)' },
        { left: 'British Airways', right: 'London Heathrow (LHR)' }
      ],
      difficulty: 'medium',
      category: 'Airlines',
      course: 'IATA Foundation',
      points: 4,
      tags: ['airlines', 'airports', 'hubs'],
      explanation: 'Major airlines have primary hub airports where they operate their main operations.',
      timesUsed: 23,
      successRate: 68
    },
    {
      id: 7,
      question: 'Arrange the following steps in the correct order for booking a flight in Amadeus.',
      type: 'ordering',
      items: [
        'Create PNR with passenger name',
        'Search for availability',
        'Select flight segments',
        'Add contact information',
        'Receive confirmation'
      ],
      correctOrder: [1, 2, 0, 3, 4],
      difficulty: 'medium',
      category: 'Amadeus',
      course: 'Amadeus Basic Reservations',
      points: 3,
      tags: ['amadeus', 'booking', 'process'],
      explanation: 'The correct booking flow in Amadeus is: Search → Select → Create PNR → Add Contact → Confirm',
      timesUsed: 41,
      successRate: 54
    },
    {
      id: 8,
      question: 'Calculate the total fare if base fare is ₹10,000, taxes are ₹2,500, and there is a 10% commission.',
      type: 'fill_blank',
      correctAnswer: '11250',
      difficulty: 'hard',
      category: 'Fares & Pricing',
      course: 'IATA Foundation',
      points: 3,
      tags: ['calculation', 'fares', 'commission'],
      explanation: 'Total = (Base + Taxes) - Commission = (10000 + 2500) - (10000 × 0.1) = 12500 - 1000 = 11500. Net amount received = 11250 after commission deduction.',
      timesUsed: 18,
      successRate: 42
    },
    {
      id: 9,
      question: 'What is the IATA code for Dubai International Airport?',
      type: 'mcq',
      options: ['DXB', 'DBI', 'DUB', 'DBX'],
      correctAnswer: 0,
      difficulty: 'easy',
      category: 'Geography',
      course: 'Dubai Destination Specialist',
      points: 1,
      tags: ['airports', 'dubai', 'codes'],
      explanation: 'DXB is the IATA code for Dubai International Airport, one of the busiest airports in the world.',
      timesUsed: 56,
      successRate: 89
    },
    {
      id: 10,
      question: 'The minimum validity of a travel agent IATA accreditation is how many years?',
      type: 'mcq',
      options: ['1 year', '2 years', '3 years', '5 years'],
      correctAnswer: 0,
      difficulty: 'medium',
      category: 'Industry Knowledge',
      course: 'Travel Business Startup',
      points: 2,
      tags: ['iata', 'accreditation', 'business'],
      explanation: 'IATA accreditation must be renewed annually, making 1 year the minimum validity period.',
      timesUsed: 34,
      successRate: 58
    }
  ];

  const categories = [
    'GDS & Ticketing',
    'Fares & Pricing',
    'Amadeus',
    'Sabre',
    'Galileo',
    'Airlines',
    'Geography',
    'Hotels',
    'Cruise',
    'Industry Knowledge',
    'Travel Regulations',
    'Customer Service'
  ];

  const courses = [
    'IATA Foundation',
    'Amadeus Basic Reservations',
    'Sabre Red 360',
    'Galileo Fundamentals',
    'TAFI Certification Prep',
    'Dubai Destination Specialist',
    'Travel Business Startup',
    'Cruise Specialist',
    'Corporate Travel Management'
  ];

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice', icon: '◯' },
    { value: 'true_false', label: 'True/False', icon: '✓✗' },
    { value: 'fill_blank', label: 'Fill in the Blank', icon: '_' },
    { value: 'matching', label: 'Matching', icon: '↔' },
    { value: 'ordering', label: 'Ordering', icon: '123' }
  ];

  useEffect(() => {
    // In real app, fetch from API
    setQuestions(mockQuestions);
  }, []);

  const filteredQuestions = questions.filter(q => {
    if (filters.search && !q.question.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category && q.category !== filters.category) return false;
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    if (filters.type && q.type !== filters.type) return false;
    if (filters.course && q.course !== filters.course) return false;
    return true;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestions(paginatedQuestions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleSelectQuestion = (id) => {
    setSelectedQuestions(prev =>
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedQuestions.length} questions?`)) {
      setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
      setSelectedQuestions([]);
    }
  };

  const handleDuplicateQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: Date.now(),
      question: `${question.question} (Copy)`,
      timesUsed: 0,
      successRate: 0
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    const typeObj = questionTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : '?';
  };

  const stats = {
    total: questions.length,
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
    avgSuccessRate: Math.round(questions.reduce((sum, q) => sum + q.successRate, 0) / questions.length)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
            <p className="mt-1 text-gray-600">Manage exam questions across all courses</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Import
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">E</span>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.easy}</p>
                <p className="text-sm text-gray-600">Easy</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">M</span>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.medium}</p>
                <p className="text-sm text-gray-600">Medium</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">H</span>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.hard}</p>
                <p className="text-sm text-gray-600">Hard</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.avgSuccessRate}%</p>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select
              value={filters.course}
              onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedQuestions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
            <span className="text-blue-700">
              {selectedQuestions.length} question(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium"
              >
                Delete Selected
              </button>
              <button
                className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium"
              >
                Add to Exam
              </button>
            </div>
          </div>
        )}

        {/* Questions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.length === paginatedQuestions.length && paginatedQuestions.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedQuestions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => handleSelectQuestion(question.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-md">
                        <p className="text-sm text-gray-900 font-medium line-clamp-2">
                          {question.question}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {question.tags?.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                        <span className="mr-1.5">{getTypeIcon(question.type)}</span>
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{question.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{question.course}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">Used: {question.timesUsed}x</p>
                        <p className={`${question.successRate >= 70 ? 'text-green-600' : question.successRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          Success: {question.successRate}%
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedQuestion(question);
                            setIsPreviewModalOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Preview"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingQuestion(question);
                            setIsCreateModalOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateQuestion(question)}
                          className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
                          title="Duplicate"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this question?')) {
                              setQuestions(prev => prev.filter(q => q.id !== question.id));
                            }
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredQuestions.length)}</span> of{' '}
              <span className="font-medium">{filteredQuestions.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === idx + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Create/Edit Question Modal */}
        {isCreateModalOpen && (
          <QuestionEditorModal
            question={editingQuestion}
            onClose={() => {
              setIsCreateModalOpen(false);
              setEditingQuestion(null);
            }}
            onSave={(question) => {
              if (editingQuestion) {
                setQuestions(prev => prev.map(q => q.id === question.id ? question : q));
              } else {
                setQuestions(prev => [...prev, { ...question, id: Date.now() }]);
              }
              setIsCreateModalOpen(false);
              setEditingQuestion(null);
            }}
            categories={categories}
            courses={courses}
          />
        )}

        {/* Preview Modal */}
        {isPreviewModalOpen && selectedQuestion && (
          <QuestionPreviewModal
            question={selectedQuestion}
            onClose={() => {
              setIsPreviewModalOpen(false);
              setSelectedQuestion(null);
            }}
          />
        )}

        {/* Import Modal */}
        {isImportModalOpen && (
          <ImportQuestionsModal
            onClose={() => setIsImportModalOpen(false)}
            onImport={(importedQuestions) => {
              setQuestions(prev => [...prev, ...importedQuestions.map((q, idx) => ({
                ...q,
                id: Date.now() + idx,
                timesUsed: 0,
                successRate: 0
              }))]);
              setIsImportModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Question Editor Modal Component
const QuestionEditorModal = ({ question, onClose, onSave, categories, courses }) => {
  const [formData, setFormData] = useState(question || {
    question: '',
    type: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'easy',
    category: '',
    course: '',
    points: 1,
    tags: [],
    explanation: ''
  });
  const [tagInput, setTagInput] = useState('');

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer: prev.correctAnswer >= index ? Math.max(0, prev.correctAnswer - 1) : prev.correctAnswer
      }));
    }
  };

  const handleOptionChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {question ? 'Edit Question' : 'Add New Question'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text *
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your question here..."
                required
              />
            </div>

            {/* Question Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="fill_blank">Fill in the Blank</option>
                  <option value="matching">Matching</option>
                  <option value="ordering">Ordering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* MCQ Options */}
            {formData.type === 'mcq' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options *
                </label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-blue-600 text-sm hover:underline flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Option
                  </button>
                </div>
              </div>
            )}

            {/* True/False */}
            {formData.type === 'true_false' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tfAnswer"
                      checked={formData.correctAnswer === true}
                      onChange={() => setFormData(prev => ({ ...prev, correctAnswer: true }))}
                      className="mr-2 text-blue-600"
                    />
                    True
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tfAnswer"
                      checked={formData.correctAnswer === false}
                      onChange={() => setFormData(prev => ({ ...prev, correctAnswer: false }))}
                      className="mr-2 text-blue-600"
                    />
                    False
                  </label>
                </div>
              </div>
            )}

            {/* Fill in the Blank */}
            {formData.type === 'fill_blank' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer *
                </label>
                <input
                  type="text"
                  value={formData.correctAnswer || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the correct answer"
                />
              </div>
            )}

            {/* Category and Course */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                className="w-32 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 text-blue-500 hover:text-blue-700"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation (shown after answer)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain why this is the correct answer..."
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {question ? 'Update Question' : 'Add Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Question Preview Modal Component
const QuestionPreviewModal = ({ question, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Question Preview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Question Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {question.points} point{question.points > 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {question.category}
            </span>
          </div>

          {/* Question Text */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-lg font-medium text-gray-900">{question.question}</p>
          </div>

          {/* Answer Options */}
          {question.type === 'mcq' && (
            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    index === question.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      index === question.correctAnswer
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={index === question.correctAnswer ? 'font-medium text-green-800' : 'text-gray-700'}>
                      {option}
                    </span>
                    {index === question.correctAnswer && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {question.type === 'true_false' && (
            <div className="space-y-3 mb-6">
              <div className={`p-4 rounded-lg border-2 ${question.correctAnswer === true ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <CheckCircleIcon className={`h-6 w-6 mr-3 ${question.correctAnswer === true ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={question.correctAnswer === true ? 'font-medium text-green-800' : 'text-gray-700'}>True</span>
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 ${question.correctAnswer === false ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <XCircleIcon className={`h-6 w-6 mr-3 ${question.correctAnswer === false ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={question.correctAnswer === false ? 'font-medium text-green-800' : 'text-gray-700'}>False</span>
                </div>
              </div>
            </div>
          )}

          {question.type === 'fill_blank' && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Correct Answer:</p>
              <div className="p-4 rounded-lg border-2 border-green-500 bg-green-50">
                <p className="font-medium text-green-800">{question.correctAnswer}</p>
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Explanation</h4>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Question Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Times Used</p>
                <p className="text-2xl font-bold text-gray-900">{question.timesUsed}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className={`text-2xl font-bold ${
                  question.successRate >= 70 ? 'text-green-600' :
                  question.successRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {question.successRate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import Questions Modal Component
const ImportQuestionsModal = ({ onClose, onImport }) => {
  const [importMethod, setImportMethod] = useState('file');
  const [jsonText, setJsonText] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonText(event.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = () => {
    try {
      const questions = JSON.parse(jsonText);
      if (Array.isArray(questions)) {
        onImport(questions);
      } else {
        alert('Invalid format. Please provide an array of questions.');
      }
    } catch (error) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  const sampleFormat = `[
  {
    "question": "What is the IATA code for Delhi airport?",
    "type": "mcq",
    "options": ["DEL", "DLI", "NDL", "DEH"],
    "correctAnswer": 0,
    "difficulty": "easy",
    "category": "Geography",
    "course": "IATA Foundation",
    "points": 1,
    "tags": ["airports", "codes", "india"],
    "explanation": "DEL is the IATA code for Indira Gandhi International Airport."
  }
]`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Import Questions</h2>
          <p className="text-sm text-gray-600 mt-1">Import questions from a JSON file or paste JSON directly</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Import Method Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setImportMethod('file')}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                importMethod === 'file'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setImportMethod('paste')}
              className={`flex-1 py-2 px-4 rounded-lg border ${
                importMethod === 'paste'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Paste JSON
            </button>
          </div>

          {/* File Upload */}
          {importMethod === 'file' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select JSON File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {file ? file.name : 'Drop your file here, or click to browse'}
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
            </div>
          )}

          {/* JSON Paste */}
          {importMethod === 'paste' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste JSON Data
              </label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={10}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Paste your JSON array of questions here..."
              />
            </div>
          )}

          {/* Sample Format */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Format</h4>
            <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
              {sampleFormat}
            </pre>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!jsonText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
