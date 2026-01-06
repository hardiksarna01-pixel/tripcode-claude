import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FlagIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    QuestionMarkCircleIcon,
    ArrowPathIcon,
    XMarkIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const ExamPortal = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [examResult, setExamResult] = useState(null);

    // Mock exam data
    const exam = {
        id: 1,
        title: 'IATA Foundation Final Exam',
        totalQuestions: 100,
        duration: 120, // minutes
        passingScore: 70,
        questions: [
            {
                id: 1,
                text: 'Which of the following is NOT one of the three major airline alliances?',
                options: [
                    { id: 'a', text: 'Star Alliance' },
                    { id: 'b', text: 'Oneworld' },
                    { id: 'c', text: 'SkyTeam' },
                    { id: 'd', text: 'Wings Alliance' }
                ],
                correctAnswer: 'd'
            },
            {
                id: 2,
                text: 'What does the airport code "DEL" represent?',
                options: [
                    { id: 'a', text: 'Delhi, India' },
                    { id: 'b', text: 'Delaware, USA' },
                    { id: 'c', text: 'Deli, Indonesia' },
                    { id: 'd', text: 'Delft, Netherlands' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 3,
                text: 'Which document issued by IATA contains information about travel requirements?',
                options: [
                    { id: 'a', text: 'BSP Manual' },
                    { id: 'b', text: 'Timatic' },
                    { id: 'c', text: 'ARC Guide' },
                    { id: 'd', text: 'Travel Manual' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 4,
                text: 'What is the IATA code for British Airways?',
                options: [
                    { id: 'a', text: 'BA' },
                    { id: 'b', text: 'BW' },
                    { id: 'c', text: 'BR' },
                    { id: 'd', text: 'BY' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 5,
                text: 'Which class of service is typically the most expensive on a flight?',
                options: [
                    { id: 'a', text: 'Economy Class' },
                    { id: 'b', text: 'Premium Economy' },
                    { id: 'c', text: 'Business Class' },
                    { id: 'd', text: 'First Class' }
                ],
                correctAnswer: 'd'
            },
            // Add more questions...
            {
                id: 6,
                text: 'What is a PNR in airline terminology?',
                options: [
                    { id: 'a', text: 'Passenger Name Record' },
                    { id: 'b', text: 'Personal Navigation Report' },
                    { id: 'c', text: 'Pilot Notice Required' },
                    { id: 'd', text: 'Payment Notice Receipt' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 7,
                text: 'Which country uses the currency code "THB"?',
                options: [
                    { id: 'a', text: 'Taiwan' },
                    { id: 'b', text: 'Thailand' },
                    { id: 'c', text: 'Turkey' },
                    { id: 'd', text: 'Tunisia' }
                ],
                correctAnswer: 'b'
            },
            {
                id: 8,
                text: 'What does MICE stand for in tourism?',
                options: [
                    { id: 'a', text: 'Meetings, Incentives, Conferences, Exhibitions' },
                    { id: 'b', text: 'Marketing, Integration, Coordination, Events' },
                    { id: 'c', text: 'Management, Innovation, Culture, Experience' },
                    { id: 'd', text: 'Media, Information, Communication, Entertainment' }
                ],
                correctAnswer: 'a'
            },
            {
                id: 9,
                text: 'What is the time difference between IST (Indian Standard Time) and GMT?',
                options: [
                    { id: 'a', text: '+4:30 hours' },
                    { id: 'b', text: '+5:00 hours' },
                    { id: 'c', text: '+5:30 hours' },
                    { id: 'd', text: '+6:00 hours' }
                ],
                correctAnswer: 'c'
            },
            {
                id: 10,
                text: 'Which document is required for international travel as proof of identity and citizenship?',
                options: [
                    { id: 'a', text: 'Driver\'s License' },
                    { id: 'b', text: 'Passport' },
                    { id: 'c', text: 'Aadhaar Card' },
                    { id: 'd', text: 'PAN Card' }
                ],
                correctAnswer: 'b'
            }
        ]
    };

    // Timer effect
    useEffect(() => {
        if (isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (optionId) => {
        setAnswers({ ...answers, [currentQuestion]: optionId });
    };

    const toggleMarkForReview = () => {
        const newMarked = new Set(markedForReview);
        if (newMarked.has(currentQuestion)) {
            newMarked.delete(currentQuestion);
        } else {
            newMarked.add(currentQuestion);
        }
        setMarkedForReview(newMarked);
    };

    const goToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    const handleSubmit = () => {
        // Calculate result
        let correct = 0;
        exam.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correct++;
            }
        });

        const percentage = (correct / exam.questions.length) * 100;
        const passed = percentage >= exam.passingScore;

        setExamResult({
            correct,
            total: exam.questions.length,
            percentage: percentage.toFixed(1),
            passed,
            grade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'F'
        });

        setIsSubmitted(true);
        setShowSubmitModal(false);
    };

    const question = exam.questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = exam.questions.length - answeredCount;

    if (isSubmitted && examResult) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
                    <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                        examResult.passed ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                        {examResult.passed ? (
                            <TrophyIcon className="w-12 h-12 text-green-600" />
                        ) : (
                            <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {examResult.passed ? 'Congratulations! 🎉' : 'Keep Trying!'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {examResult.passed
                            ? 'You have successfully passed the exam.'
                            : `You need ${exam.passingScore}% to pass. Don't give up!`}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{examResult.correct}</p>
                                <p className="text-sm text-gray-500">Correct</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{examResult.percentage}%</p>
                                <p className="text-sm text-gray-500">Score</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{examResult.grade}</p>
                                <p className="text-sm text-gray-500">Grade</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            to="/certification/my-courses"
                            className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                        >
                            Back to Courses
                        </Link>
                        {examResult.passed ? (
                            <Link
                                to="/certification/certificates"
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                            >
                                View Certificate
                            </Link>
                        ) : (
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                            >
                                Retry Exam
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-semibold text-gray-900">{exam.title}</h1>
                            <p className="text-sm text-gray-500">
                                Question {currentQuestion + 1} of {exam.questions.length}
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                timeLeft < 600 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                                <ClockIcon className="w-5 h-5" />
                                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                            </div>

                            <button
                                onClick={() => setShowSubmitModal(true)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                            >
                                Submit Exam
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            {/* Question */}
                            <div className="mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                                        Question {currentQuestion + 1}
                                    </span>
                                    <button
                                        onClick={toggleMarkForReview}
                                        className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                                            markedForReview.has(currentQuestion)
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <FlagIcon className="w-4 h-4" />
                                        {markedForReview.has(currentQuestion) ? 'Marked' : 'Mark for Review'}
                                    </button>
                                </div>

                                <h2 className="text-lg font-medium text-gray-900 mb-6">{question.text}</h2>

                                {/* Options */}
                                <div className="space-y-3">
                                    {question.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleAnswerSelect(option.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-colors ${
                                                answers[currentQuestion] === option.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                                answers[currentQuestion] === option.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {option.id.toUpperCase()}
                                            </span>
                                            <span className="text-gray-700">{option.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-6 border-t">
                                <button
                                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                    disabled={currentQuestion === 0}
                                    className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                    Previous
                                </button>

                                <button
                                    onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}
                                    disabled={currentQuestion === exam.questions.length - 1}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
                                >
                                    Next
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Question Navigator */}
                    <div className="w-72">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                            <h3 className="font-medium text-gray-900 mb-4">Question Navigator</h3>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 mb-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                    <span>Unanswered</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-amber-400 rounded"></div>
                                    <span>Review</span>
                                </div>
                            </div>

                            {/* Question Grid */}
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {exam.questions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => goToQuestion(idx)}
                                        className={`w-10 h-10 rounded-lg font-medium text-sm flex items-center justify-center ${
                                            currentQuestion === idx
                                                ? 'ring-2 ring-blue-500 ring-offset-2'
                                                : ''
                                        } ${
                                            markedForReview.has(idx)
                                                ? 'bg-amber-400 text-white'
                                                : answers[idx]
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Answered</span>
                                    <span className="font-medium text-green-600">{answeredCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Unanswered</span>
                                    <span className="font-medium text-gray-600">{unansweredCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Marked for Review</span>
                                    <span className="font-medium text-amber-600">{markedForReview.size}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Submit Exam?</h3>
                            <button onClick={() => setShowSubmitModal(false)}>
                                <XMarkIcon className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                                    <p className="text-sm text-gray-500">Answered</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-600">{unansweredCount}</p>
                                    <p className="text-sm text-gray-500">Unanswered</p>
                                </div>
                            </div>
                        </div>

                        {unansweredCount > 0 && (
                            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg mb-4">
                                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-700">
                                    You have {unansweredCount} unanswered questions. Are you sure you want to submit?
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                            >
                                Review Answers
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                            >
                                Submit Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamPortal;
