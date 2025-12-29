import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    PlayIcon,
    ClockIcon,
    UserGroupIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    AcademicCapIcon,
    GlobeAltIcon,
    DevicePhoneMobileIcon,
    TrophyIcon,
    StarIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    LockClosedIcon,
    PlayCircleIcon,
    DocumentIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const CourseDetails = () => {
    const { id } = useParams();
    const [expandedModule, setExpandedModule] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Mock course data
    const course = {
        id: 1,
        title: 'IATA Foundation in Travel & Tourism',
        subtitle: 'Complete preparation for IATA Foundation certification with hands-on practice',
        body: 'IATA',
        bodyLogo: '✈️',
        category: 'IATA Certification',
        level: 'Foundation',
        language: 'English, Hindi',
        price: 32999,
        originalPrice: 38999,
        duration: 60,
        lectures: 85,
        rating: 4.8,
        reviews: 1250,
        enrolled: 5420,
        lastUpdated: 'December 2024',
        thumbnail: 'iata-foundation',
        instructor: {
            name: 'Capt. Rajesh Kumar',
            title: 'Senior IATA Certified Trainer',
            image: '/instructors/rajesh.jpg',
            rating: 4.9,
            students: 12500,
            courses: 8,
            bio: '20+ years in aviation industry. Former airline manager and certified IATA instructor since 2010.'
        },
        description: `
            This comprehensive IATA Foundation course is designed to give you a solid understanding of the travel and tourism industry. Whether you're starting your career or looking to formalize your knowledge, this certification will set you apart.

            The course covers everything from world geography and airline operations to fare basics and customer service. By the end, you'll be ready to take the official IATA Foundation exam with confidence.
        `,
        whatYouLearn: [
            'Understand the global travel and tourism industry structure',
            'Master world geography, time zones, and tourist destinations',
            'Learn airline operations, classes, and fare types',
            'Understand ticket components and booking procedures',
            'Handle travel documentation (passports, visas, health requirements)',
            'Develop customer service and communication skills',
            'Navigate airport layouts and procedures',
            'Calculate basic fares and understand pricing'
        ],
        requirements: [
            'Basic computer literacy',
            '12th pass or equivalent',
            'Good English communication skills',
            'Interest in travel and tourism industry'
        ],
        targetAudience: [
            'Aspiring travel agents and consultants',
            'Travel agency staff seeking certification',
            'Airline ground staff',
            'Tourism graduates',
            'Career changers entering travel industry'
        ],
        features: [
            { icon: PlayCircleIcon, text: '85 video lectures' },
            { icon: DocumentIcon, text: '45 downloadable resources' },
            { icon: QuestionMarkCircleIcon, text: '10 practice quizzes' },
            { icon: TrophyIcon, text: 'Certificate of completion' },
            { icon: ClockIcon, text: '60 hours of content' },
            { icon: DevicePhoneMobileIcon, text: 'Mobile access' },
            { icon: GlobeAltIcon, text: 'Lifetime access' },
            { icon: ShieldCheckIcon, text: 'IATA recognized' }
        ],
        modules: [
            {
                id: 1,
                title: 'Introduction to Travel Industry',
                duration: '4 hours',
                lessons: [
                    { id: 1, title: 'Welcome & Course Overview', duration: '10:00', type: 'video', preview: true },
                    { id: 2, title: 'History of Travel & Tourism', duration: '25:00', type: 'video', preview: true },
                    { id: 3, title: 'Travel Industry Stakeholders', duration: '30:00', type: 'video', preview: false },
                    { id: 4, title: 'Types of Travel', duration: '35:00', type: 'video', preview: false },
                    { id: 5, title: 'Career Opportunities', duration: '20:00', type: 'video', preview: false },
                    { id: 6, title: 'Module 1 Quiz', duration: '15:00', type: 'quiz', preview: false },
                ]
            },
            {
                id: 2,
                title: 'World Geography for Travel',
                duration: '10 hours',
                lessons: [
                    { id: 7, title: 'Understanding Maps & Atlases', duration: '30:00', type: 'video', preview: false },
                    { id: 8, title: 'Continents & Major Countries', duration: '45:00', type: 'video', preview: false },
                    { id: 9, title: 'Capitals & Major Cities', duration: '40:00', type: 'video', preview: false },
                    { id: 10, title: 'Time Zones Explained', duration: '35:00', type: 'video', preview: false },
                    { id: 11, title: 'Climate & Travel Seasons', duration: '30:00', type: 'video', preview: false },
                    { id: 12, title: 'Airport & City Codes', duration: '45:00', type: 'video', preview: false },
                    { id: 13, title: 'Geography Practice Test', duration: '30:00', type: 'quiz', preview: false },
                ]
            },
            {
                id: 3,
                title: 'Air Travel Fundamentals',
                duration: '12 hours',
                lessons: [
                    { id: 14, title: 'Types of Airlines', duration: '30:00', type: 'video', preview: false },
                    { id: 15, title: 'Airline Alliances', duration: '25:00', type: 'video', preview: false },
                    { id: 16, title: 'Aircraft Types & Configurations', duration: '40:00', type: 'video', preview: false },
                    { id: 17, title: 'Understanding Flight Schedules', duration: '35:00', type: 'video', preview: false },
                    { id: 18, title: 'Airline Classes & Fare Brands', duration: '45:00', type: 'video', preview: false },
                    { id: 19, title: 'Baggage Rules', duration: '30:00', type: 'video', preview: false },
                    { id: 20, title: 'Frequent Flyer Programs', duration: '25:00', type: 'video', preview: false },
                ]
            },
            {
                id: 4,
                title: 'Fare Basics',
                duration: '10 hours',
                lessons: [
                    { id: 21, title: 'Published vs Negotiated Fares', duration: '35:00', type: 'video', preview: false },
                    { id: 22, title: 'Journey Types', duration: '30:00', type: 'video', preview: false },
                    { id: 23, title: 'Fare Rules & Restrictions', duration: '45:00', type: 'video', preview: false },
                    { id: 24, title: 'Taxes & Surcharges', duration: '40:00', type: 'video', preview: false },
                    { id: 25, title: 'Currency & Exchange', duration: '30:00', type: 'video', preview: false },
                ]
            },
            {
                id: 5,
                title: 'Ticketing Fundamentals',
                duration: '10 hours',
                lessons: [
                    { id: 26, title: 'E-Ticket Components', duration: '40:00', type: 'video', preview: false },
                    { id: 27, title: 'PNR Structure', duration: '45:00', type: 'video', preview: false },
                    { id: 28, title: 'Ticket Status Codes', duration: '30:00', type: 'video', preview: false },
                    { id: 29, title: 'Reissue & Refund Basics', duration: '35:00', type: 'video', preview: false },
                ]
            },
            {
                id: 6,
                title: 'Travel Documentation',
                duration: '5 hours',
                lessons: [
                    { id: 30, title: 'Passports & Types', duration: '25:00', type: 'video', preview: false },
                    { id: 31, title: 'Visa Categories', duration: '35:00', type: 'video', preview: false },
                    { id: 32, title: 'Health Requirements', duration: '20:00', type: 'video', preview: false },
                    { id: 33, title: 'Travel Insurance', duration: '25:00', type: 'video', preview: false },
                    { id: 34, title: 'Using IATA Timatic', duration: '30:00', type: 'video', preview: false },
                ]
            },
            {
                id: 7,
                title: 'Customer Service Excellence',
                duration: '5 hours',
                lessons: [
                    { id: 35, title: 'Understanding Customer Needs', duration: '30:00', type: 'video', preview: false },
                    { id: 36, title: 'Communication Skills', duration: '35:00', type: 'video', preview: false },
                    { id: 37, title: 'Handling Complaints', duration: '30:00', type: 'video', preview: false },
                    { id: 38, title: 'Building Relationships', duration: '25:00', type: 'video', preview: false },
                ]
            },
            {
                id: 8,
                title: 'Final Exam Preparation',
                duration: '4 hours',
                lessons: [
                    { id: 39, title: 'Exam Tips & Strategy', duration: '20:00', type: 'video', preview: false },
                    { id: 40, title: 'Practice Test 1', duration: '60:00', type: 'quiz', preview: false },
                    { id: 41, title: 'Practice Test 2', duration: '60:00', type: 'quiz', preview: false },
                    { id: 42, title: 'Final Exam', duration: '120:00', type: 'exam', preview: false },
                ]
            }
        ],
        reviews: [
            { id: 1, name: 'Priya Sharma', rating: 5, date: '2 weeks ago', comment: 'Excellent course! Very comprehensive and the instructor explains everything clearly. Passed my IATA exam on first attempt.', helpful: 45 },
            { id: 2, name: 'Amit Patel', rating: 5, date: '1 month ago', comment: 'Best investment for my travel career. The course content is up-to-date and practice tests were very helpful.', helpful: 38 },
            { id: 3, name: 'Sneha Reddy', rating: 4, date: '1 month ago', comment: 'Good content overall. Would have liked more practice questions for the geography section.', helpful: 22 },
            { id: 4, name: 'Rahul Verma', rating: 5, date: '2 months ago', comment: 'Cleared my IATA Foundation with 92%! This course covers everything you need to know.', helpful: 56 },
        ],
        ratingBreakdown: {
            5: 856,
            4: 298,
            3: 72,
            2: 18,
            1: 6
        }
    };

    const totalRatings = Object.values(course.ratingBreakdown).reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-2 text-gray-400 mb-4 text-sm">
                        <Link to="/certification" className="hover:text-white">Certification Hub</Link>
                        <span>/</span>
                        <Link to="/certification/courses" className="hover:text-white">Courses</Link>
                        <span>/</span>
                        <span className="text-gray-300">{course.category}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded">
                                    {course.body}
                                </span>
                                <span className="px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded">
                                    Bestseller
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
                            <p className="text-gray-300 text-lg mb-4">{course.subtitle}</p>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-amber-400 font-bold">{course.rating}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <StarSolid key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-amber-400' : 'text-gray-500'}`} />
                                        ))}
                                    </div>
                                    <span className="text-gray-400">({course.reviews.toLocaleString()} reviews)</span>
                                </div>
                                <span className="text-gray-400">{course.enrolled.toLocaleString()} students</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                                <span>Created by <span className="text-blue-400">{course.instructor.name}</span></span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="w-4 h-4" />
                                    Last updated {course.lastUpdated}
                                </span>
                                <span className="flex items-center gap-1">
                                    <GlobeAltIcon className="w-4 h-4" />
                                    {course.language}
                                </span>
                            </div>
                        </div>

                        {/* Price Card - Mobile hidden, shown on right for desktop */}
                        <div className="hidden lg:block">
                            <div className="bg-white rounded-xl shadow-lg p-6 text-gray-900 sticky top-4">
                                <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                                    <PlayIcon className="w-16 h-16 text-white" />
                                </div>

                                <div className="mb-4">
                                    <span className="text-3xl font-bold">₹{course.price.toLocaleString()}</span>
                                    <span className="text-lg text-gray-400 line-through ml-2">₹{course.originalPrice.toLocaleString()}</span>
                                    <span className="text-green-600 ml-2 font-medium">
                                        {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                                    </span>
                                </div>

                                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 mb-3">
                                    Enroll Now
                                </button>
                                <button className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 mb-4">
                                    Add to Wishlist
                                </button>

                                <p className="text-center text-sm text-gray-500 mb-4">30-day money-back guarantee</p>

                                <div className="space-y-3 text-sm">
                                    <h4 className="font-semibold">This course includes:</h4>
                                    {course.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-gray-600">
                                            <feature.icon className="w-5 h-5 text-gray-400" />
                                            {feature.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Price Card */}
            <div className="lg:hidden sticky top-0 z-10 bg-white border-b shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold">₹{course.price.toLocaleString()}</span>
                        <span className="text-gray-400 line-through ml-2">₹{course.originalPrice.toLocaleString()}</span>
                    </div>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                        Enroll Now
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {course.whatYouLearn.map((item, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-600">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                                <span className="text-sm text-gray-500">
                                    {course.modules.length} modules • {course.lectures} lectures • {course.duration} hours
                                </span>
                            </div>

                            <div className="space-y-2">
                                {course.modules.map((module, idx) => (
                                    <div key={module.id} className="border rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setExpandedModule(expandedModule === idx ? -1 : idx)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                {expandedModule === idx ? (
                                                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                                )}
                                                <span className="font-medium text-gray-900">{module.title}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {module.lessons.length} lessons • {module.duration}
                                            </span>
                                        </button>

                                        {expandedModule === idx && (
                                            <div className="border-t">
                                                {module.lessons.map((lesson) => (
                                                    <div key={lesson.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            {lesson.type === 'video' && <PlayCircleIcon className="w-5 h-5 text-gray-400" />}
                                                            {lesson.type === 'quiz' && <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />}
                                                            {lesson.type === 'exam' && <DocumentTextIcon className="w-5 h-5 text-gray-400" />}
                                                            <span className="text-gray-700">{lesson.title}</span>
                                                            {lesson.preview && (
                                                                <span className="text-xs text-blue-600 font-medium">Preview</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                                                            {!lesson.preview && <LockClosedIcon className="w-4 h-4 text-gray-400" />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                            <ul className="space-y-2">
                                {course.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            <div className="text-gray-600 whitespace-pre-line">
                                {course.description}
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Instructor</h2>
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {course.instructor.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{course.instructor.name}</h3>
                                    <p className="text-gray-500 mb-2">{course.instructor.title}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <span className="flex items-center gap-1">
                                            <StarSolid className="w-4 h-4 text-amber-400" />
                                            {course.instructor.rating} rating
                                        </span>
                                        <span>{course.instructor.students.toLocaleString()} students</span>
                                        <span>{course.instructor.courses} courses</span>
                                    </div>
                                    <p className="text-gray-600">{course.instructor.bio}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h2>

                            <div className="flex gap-8 mb-6">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-gray-900">{course.rating}</div>
                                    <div className="flex justify-center my-2">
                                        {[...Array(5)].map((_, i) => (
                                            <StarSolid key={i} className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-amber-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-500">Course Rating</div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 w-12">
                                                <span className="text-sm">{star}</span>
                                                <StarSolid className="w-4 h-4 text-amber-400" />
                                            </div>
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400"
                                                    style={{ width: `${(course.ratingBreakdown[star] / totalRatings) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-500 w-12">{course.ratingBreakdown[star]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {course.reviews.slice(0, showAllReviews ? undefined : 3).map((review) => (
                                    <div key={review.id} className="border-t pt-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900">{review.name}</span>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarSolid key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                                                <p className="text-gray-600">{review.comment}</p>
                                                <button className="text-sm text-gray-500 mt-2 hover:text-gray-700">
                                                    Helpful ({review.helpful})
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {course.reviews.length > 3 && (
                                <button
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                    className="mt-4 text-blue-600 hover:underline"
                                >
                                    {showAllReviews ? 'Show less' : `Show all ${course.reviews.length} reviews`}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar placeholder for desktop - actual card is sticky positioned above */}
                    <div className="hidden lg:block">
                        <div className="h-[600px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
