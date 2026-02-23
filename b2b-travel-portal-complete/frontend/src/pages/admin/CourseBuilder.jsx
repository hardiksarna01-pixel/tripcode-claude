import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    PlusIcon,
    TrashIcon,
    PencilIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    PlayCircleIcon,
    DocumentTextIcon,
    QuestionMarkCircleIcon,
    PhotoIcon,
    VideoCameraIcon,
    ArrowUpTrayIcon,
    EyeIcon,
    Cog6ToothIcon,
    Bars3Icon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const CourseBuilder = () => {
    const [activeTab, setActiveTab] = useState('content');
    const [course, setCourse] = useState({
        title: '',
        subtitle: '',
        description: '',
        category: '',
        level: 'foundation',
        language: 'English',
        price: '',
        originalPrice: '',
        thumbnail: null,
        previewVideo: '',
        modules: [
            {
                id: 1,
                title: 'Module 1: Introduction',
                lessons: [
                    { id: 1, title: 'Welcome to the Course', type: 'video', duration: '10:00' },
                    { id: 2, title: 'Course Overview', type: 'video', duration: '15:00' },
                ]
            }
        ]
    });

    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const addModule = () => {
        const newModule = {
            id: course.modules.length + 1,
            title: `Module ${course.modules.length + 1}: Untitled`,
            lessons: []
        };
        setCourse({ ...course, modules: [...course.modules, newModule] });
    };

    const addLesson = (moduleId) => {
        const updatedModules = course.modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: [...m.lessons, {
                        id: m.lessons.length + 1,
                        title: 'Untitled Lesson',
                        type: 'video',
                        duration: '0:00'
                    }]
                };
            }
            return m;
        });
        setCourse({ ...course, modules: updatedModules });
    };

    const tabs = [
        { id: 'content', name: 'Content', icon: Bars3Icon },
        { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
        { id: 'pricing', name: 'Pricing', icon: DocumentTextIcon },
    ];

    const lessonTypes = [
        { id: 'video', name: 'Video', icon: VideoCameraIcon },
        { id: 'document', name: 'Document', icon: DocumentTextIcon },
        { id: 'quiz', name: 'Quiz', icon: QuestionMarkCircleIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/certifications" className="text-gray-400 hover:text-gray-600">
                                ← Back
                            </Link>
                            <div>
                                <input
                                    type="text"
                                    value={course.title}
                                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                    placeholder="Course Title"
                                    className="text-xl font-semibold bg-transparent border-none focus:ring-0 p-0"
                                />
                                <p className="text-sm text-gray-500">Draft • Last saved 2 mins ago</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                <EyeIcon className="w-4 h-4" />
                                Preview
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Publish Course
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 mt-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-3 border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'content' && (
                    <div className="flex gap-6">
                        {/* Curriculum */}
                        <div className="w-96 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-900">Curriculum</h2>
                                    <button
                                        onClick={addModule}
                                        className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Module
                                    </button>
                                </div>

                                <div className="p-4 space-y-4">
                                    {course.modules.map((module, mIdx) => (
                                        <div key={module.id} className="border rounded-lg">
                                            <div className="p-3 bg-gray-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Bars3Icon className="w-4 h-4 text-gray-400 cursor-move" />
                                                    <input
                                                        type="text"
                                                        value={module.title}
                                                        onChange={(e) => {
                                                            const updated = [...course.modules];
                                                            updated[mIdx].title = e.target.value;
                                                            setCourse({ ...course, modules: updated });
                                                        }}
                                                        className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button className="p-1 hover:bg-gray-200 rounded">
                                                        <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-200 rounded">
                                                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-200 rounded">
                                                        <TrashIcon className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-2 space-y-1">
                                                {module.lessons.map((lesson, lIdx) => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => {
                                                            setSelectedModule(mIdx);
                                                            setSelectedLesson(lIdx);
                                                        }}
                                                        className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm ${
                                                            selectedModule === mIdx && selectedLesson === lIdx
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : 'hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {lesson.type === 'video' && <PlayCircleIcon className="w-4 h-4 text-gray-400" />}
                                                        {lesson.type === 'document' && <DocumentTextIcon className="w-4 h-4 text-gray-400" />}
                                                        {lesson.type === 'quiz' && <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400" />}
                                                        <span className="flex-1 truncate">{lesson.title}</span>
                                                        <span className="text-xs text-gray-400">{lesson.duration}</span>
                                                    </button>
                                                ))}

                                                <button
                                                    onClick={() => addLesson(module.id)}
                                                    className="w-full flex items-center gap-2 p-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                    Add Lesson
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Lesson Editor */}
                        <div className="flex-1">
                            {selectedModule !== null && selectedLesson !== null ? (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                                        <input
                                            type="text"
                                            value={course.modules[selectedModule]?.lessons[selectedLesson]?.title || ''}
                                            onChange={(e) => {
                                                const updated = [...course.modules];
                                                updated[selectedModule].lessons[selectedLesson].title = e.target.value;
                                                setCourse({ ...course, modules: updated });
                                            }}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                                        <div className="flex gap-4">
                                            {lessonTypes.map((type) => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => {
                                                        const updated = [...course.modules];
                                                        updated[selectedModule].lessons[selectedLesson].type = type.id;
                                                        setCourse({ ...course, modules: updated });
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                                        course.modules[selectedModule]?.lessons[selectedLesson]?.type === type.id
                                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                            : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <type.icon className="w-5 h-5" />
                                                    {type.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {course.modules[selectedModule]?.lessons[selectedLesson]?.type === 'video' && (
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Video Content</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                                <VideoCameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-2">Upload video or enter URL</p>
                                                <div className="flex gap-4 justify-center">
                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                                                        <ArrowUpTrayIcon className="w-4 h-4" />
                                                        Upload Video
                                                    </button>
                                                    <button className="px-4 py-2 border border-gray-300 rounded-lg">
                                                        Enter URL
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Describe what this lesson covers..."
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            Cancel
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Save Lesson
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Lesson</h3>
                                    <p className="text-gray-500">Click on a lesson from the curriculum to edit its content</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Course Settings</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">Upload course thumbnail</p>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                        Choose Image
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Subtitle</label>
                                <input
                                    type="text"
                                    value={course.subtitle}
                                    onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="A brief subtitle for your course"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    value={course.description}
                                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe your course in detail..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={course.category}
                                        onChange={(e) => setCourse({ ...course, category: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select category</option>
                                        <option value="iata">IATA Certifications</option>
                                        <option value="gds">GDS Training</option>
                                        <option value="destination">Destination Specialist</option>
                                        <option value="business">Business & Startup</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                                    <select
                                        value={course.level}
                                        onChange={(e) => setCourse({ ...course, level: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="foundation">Foundation</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save Settings
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'pricing' && (
                    <div className="max-w-2xl">
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹)</label>
                                    <input
                                        type="number"
                                        value={course.price}
                                        onChange={(e) => setCourse({ ...course, price: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 12999"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        value={course.originalPrice}
                                        onChange={(e) => setCourse({ ...course, originalPrice: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 17999"
                                    />
                                </div>
                            </div>

                            {course.price && course.originalPrice && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-green-700">
                                        Discount: {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                                    </p>
                                </div>
                            )}

                            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save Pricing
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseBuilder;
