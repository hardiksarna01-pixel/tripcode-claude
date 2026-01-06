import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    PlayIcon,
    PauseIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleIcon,
    LockClosedIcon,
    PlayCircleIcon,
    DocumentTextIcon,
    QuestionMarkCircleIcon,
    BookOpenIcon,
    ClockIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowDownTrayIcon,
    ChatBubbleLeftRightIcon,
    FlagIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ArrowsPointingOutIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const CoursePlayer = () => {
    const { enrollmentId } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentLessonId, setCurrentLessonId] = useState(1);
    const [expandedModule, setExpandedModule] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(35);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState('');

    // Mock course data
    const course = {
        id: 1,
        title: 'IATA Foundation in Travel & Tourism',
        progress: 65,
        modules: [
            {
                id: 1,
                title: 'Introduction to Travel Industry',
                lessons: [
                    { id: 1, title: 'Welcome & Course Overview', duration: '10:00', type: 'video', completed: true },
                    { id: 2, title: 'History of Travel & Tourism', duration: '25:00', type: 'video', completed: true },
                    { id: 3, title: 'Travel Industry Stakeholders', duration: '30:00', type: 'video', completed: true },
                    { id: 4, title: 'Types of Travel', duration: '35:00', type: 'video', completed: false, current: true },
                    { id: 5, title: 'Career Opportunities', duration: '20:00', type: 'video', completed: false },
                    { id: 6, title: 'Module 1 Quiz', duration: '15:00', type: 'quiz', completed: false },
                ]
            },
            {
                id: 2,
                title: 'World Geography for Travel',
                lessons: [
                    { id: 7, title: 'Understanding Maps & Atlases', duration: '30:00', type: 'video', completed: false },
                    { id: 8, title: 'Continents & Major Countries', duration: '45:00', type: 'video', completed: false },
                    { id: 9, title: 'Capitals & Major Cities', duration: '40:00', type: 'video', completed: false },
                    { id: 10, title: 'Time Zones Explained', duration: '35:00', type: 'video', completed: false },
                    { id: 11, title: 'Geography Practice Test', duration: '30:00', type: 'quiz', completed: false },
                ]
            },
            {
                id: 3,
                title: 'Air Travel Fundamentals',
                lessons: [
                    { id: 12, title: 'Types of Airlines', duration: '30:00', type: 'video', completed: false },
                    { id: 13, title: 'Airline Alliances', duration: '25:00', type: 'video', completed: false },
                    { id: 14, title: 'Aircraft Types', duration: '40:00', type: 'video', completed: false },
                ]
            }
        ],
        resources: [
            { name: 'Travel Industry Overview PDF', size: '2.4 MB', type: 'pdf' },
            { name: 'World Map Reference', size: '5.1 MB', type: 'pdf' },
            { name: 'Airline Codes Cheatsheet', size: '1.2 MB', type: 'pdf' },
        ]
    };

    const currentLesson = course.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === currentLessonId);

    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);

    const goToNextLesson = () => {
        if (currentIndex < allLessons.length - 1) {
            setCurrentLessonId(allLessons[currentIndex + 1].id);
        }
    };

    const goToPrevLesson = () => {
        if (currentIndex > 0) {
            setCurrentLessonId(allLessons[currentIndex - 1].id);
        }
    };

    const markComplete = () => {
        // API call would go here
        goToNextLesson();
    };

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Top Bar */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/certification/my-courses" className="text-gray-400 hover:text-white">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-white font-medium truncate max-w-md">{course.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>{course.progress}% complete</span>
                            <div className="w-32 h-1.5 bg-gray-700 rounded-full">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-white p-2">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowNotes(!showNotes)}
                        className={`p-2 rounded ${showNotes ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <BookOpenIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-white p-2 lg:hidden"
                    >
                        {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Video Player */}
                    <div className="flex-1 bg-black flex items-center justify-center relative">
                        {currentLesson?.type === 'video' ? (
                            <>
                                {/* Video Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                    <div className="text-center">
                                        <PlayCircleIcon className="w-24 h-24 text-white/30 mx-auto mb-4" />
                                        <h2 className="text-white text-xl font-medium">{currentLesson.title}</h2>
                                        <p className="text-gray-400">{currentLesson.duration}</p>
                                    </div>
                                </div>

                                {/* Video Controls */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 text-white text-sm mb-2">
                                            <span>12:35</span>
                                            <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer">
                                                <div className="h-full bg-blue-500 rounded-full relative" style={{ width: `${progress}%` }}>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                                                </div>
                                            </div>
                                            <span>{currentLesson.duration}</span>
                                        </div>
                                    </div>

                                    {/* Control Buttons */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setIsPlaying(!isPlaying)}
                                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                                            >
                                                {isPlaying ? (
                                                    <PauseIcon className="w-5 h-5 text-gray-900" />
                                                ) : (
                                                    <PlayIcon className="w-5 h-5 text-gray-900 ml-0.5" />
                                                )}
                                            </button>

                                            <button onClick={goToPrevLesson} className="text-white hover:text-blue-400">
                                                <ChevronLeftIcon className="w-6 h-6" />
                                            </button>
                                            <button onClick={goToNextLesson} className="text-white hover:text-blue-400">
                                                <ChevronRightIcon className="w-6 h-6" />
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setIsMuted(!isMuted)}
                                                    className="text-white hover:text-blue-400"
                                                >
                                                    {isMuted ? (
                                                        <SpeakerXMarkIcon className="w-5 h-5" />
                                                    ) : (
                                                        <SpeakerWaveIcon className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={isMuted ? 0 : volume}
                                                    onChange={(e) => setVolume(e.target.value)}
                                                    className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <select
                                                value={playbackSpeed}
                                                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                                                className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                                            >
                                                <option value="0.5">0.5x</option>
                                                <option value="0.75">0.75x</option>
                                                <option value="1">1x</option>
                                                <option value="1.25">1.25x</option>
                                                <option value="1.5">1.5x</option>
                                                <option value="2">2x</option>
                                            </select>

                                            <button className="text-white hover:text-blue-400">
                                                <Cog6ToothIcon className="w-5 h-5" />
                                            </button>
                                            <button className="text-white hover:text-blue-400">
                                                <ArrowsPointingOutIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : currentLesson?.type === 'quiz' ? (
                            <div className="text-center p-8">
                                <QuestionMarkCircleIcon className="w-24 h-24 text-blue-500/50 mx-auto mb-4" />
                                <h2 className="text-white text-2xl font-bold mb-2">{currentLesson.title}</h2>
                                <p className="text-gray-400 mb-6">Test your knowledge with this quiz</p>
                                <Link
                                    to={`/certification/exam/${enrollmentId}`}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Start Quiz
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <DocumentTextIcon className="w-24 h-24 text-gray-500/50 mx-auto mb-4" />
                                <h2 className="text-white text-2xl font-bold mb-2">{currentLesson?.title}</h2>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={goToPrevLesson}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                                Previous
                            </button>
                        </div>

                        <button
                            onClick={markComplete}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            Mark Complete & Continue
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={goToNextLesson}
                                disabled={currentIndex === allLessons.length - 1}
                                className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-50"
                            >
                                Next
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes Panel */}
                {showNotes && (
                    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-white font-medium">My Notes</h3>
                        </div>
                        <div className="flex-1 p-4">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Take notes here..."
                                className="w-full h-full bg-gray-700 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div className="p-4 border-t border-gray-700">
                            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save Notes
                            </button>
                        </div>
                    </div>
                )}

                {/* Sidebar - Course Content */}
                <div className={`w-80 bg-gray-800 border-l border-gray-700 flex flex-col ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-medium">Course Content</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {course.modules.map((module, idx) => (
                            <div key={module.id}>
                                <button
                                    onClick={() => setExpandedModule(expandedModule === idx ? -1 : idx)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-700/50 text-left"
                                >
                                    <div>
                                        <p className="text-white font-medium text-sm">{module.title}</p>
                                        <p className="text-gray-500 text-xs">
                                            {module.lessons.filter(l => l.completed).length}/{module.lessons.length} completed
                                        </p>
                                    </div>
                                    <ChevronRightIcon className={`w-4 h-4 text-gray-400 transition-transform ${expandedModule === idx ? 'rotate-90' : ''}`} />
                                </button>

                                {expandedModule === idx && (
                                    <div className="bg-gray-900/50">
                                        {module.lessons.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => setCurrentLessonId(lesson.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700/50 ${
                                                    currentLessonId === lesson.id ? 'bg-gray-700' : ''
                                                }`}
                                            >
                                                <div className="flex-shrink-0">
                                                    {lesson.completed ? (
                                                        <CheckCircleSolid className="w-5 h-5 text-green-500" />
                                                    ) : lesson.type === 'video' ? (
                                                        <PlayCircleIcon className="w-5 h-5 text-gray-500" />
                                                    ) : (
                                                        <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm truncate ${currentLessonId === lesson.id ? 'text-white' : 'text-gray-300'}`}>
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{lesson.duration}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Resources */}
                    <div className="border-t border-gray-700">
                        <div className="p-4">
                            <h4 className="text-white font-medium text-sm mb-3">Resources</h4>
                            <div className="space-y-2">
                                {course.resources.map((resource, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-700 text-left"
                                    >
                                        <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-300 truncate">{resource.name}</span>
                                        <span className="text-xs text-gray-500">{resource.size}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
