import React, { useState, useEffect } from 'react';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [destination, setDestination] = useState('');
    const [style, setStyle] = useState('photorealistic');
    const [category, setCategory] = useState('destination');
    const [generating, setGenerating] = useState(false);
    const [config, setConfig] = useState(null);
    const [usage, setUsage] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        fetchConfig();
        fetchUsage();
        fetchHistory();
    }, []);

    const fetchConfig = async () => {
        // Mock config data
        setConfig({
            styles: [
                { id: 'photorealistic', name: 'Photorealistic', description: 'Realistic travel photography style' },
                { id: 'artistic', name: 'Artistic', description: 'Artistic and painterly style' },
                { id: 'minimalist', name: 'Minimalist', description: 'Clean and minimal design' },
                { id: 'vintage', name: 'Vintage', description: 'Retro travel poster style' },
                { id: 'watercolor', name: 'Watercolor', description: 'Soft watercolor painting style' },
                { id: 'digital-art', name: 'Digital Art', description: 'Modern digital illustration' }
            ],
            categories: [
                { id: 'destination', name: 'Destination' },
                { id: 'hotel', name: 'Hotels & Resorts' },
                { id: 'adventure', name: 'Adventure' },
                { id: 'culture', name: 'Culture & Heritage' },
                { id: 'food', name: 'Food & Cuisine' },
                { id: 'beach', name: 'Beach & Islands' }
            ]
        });
    };

    const fetchUsage = async () => {
        // Mock usage data
        setUsage({
            plan: 'FREE',
            images: { used: 1, limit: 2, remaining: 1 },
            resetAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
        });
    };

    const fetchHistory = async () => {
        // Mock history
        setHistory([
            {
                id: 'img_001',
                destination: 'Goa Beach Sunset',
                style: 'photorealistic',
                imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'img_002',
                destination: 'Jaipur Hawa Mahal',
                style: 'vintage',
                imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400',
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            }
        ]);
    };

    const handleGenerate = async () => {
        if (!prompt && !destination) {
            alert('Please enter a prompt or destination');
            return;
        }

        if (usage?.images.remaining <= 0) {
            setShowUpgradeModal(true);
            return;
        }

        setGenerating(true);

        // Simulate generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newImage = {
            id: `img_${Date.now()}`,
            destination: destination || prompt,
            style,
            imageUrl: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
                'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
            ][Math.floor(Math.random() * 4)],
            createdAt: new Date().toISOString()
        };

        setHistory([newImage, ...history]);
        setSelectedImage(newImage);
        setUsage(prev => ({
            ...prev,
            images: {
                ...prev.images,
                used: prev.images.used + 1,
                remaining: prev.images.remaining - 1
            }
        }));
        setGenerating(false);
        setPrompt('');
        setDestination('');
    };

    const handleUpgrade = () => {
        // Simulate upgrade
        setUsage({
            plan: 'PRO',
            images: { used: 0, limit: 10, remaining: 10 },
            resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        setShowUpgradeModal(false);
        alert('Upgraded to Pro plan! You now have 10 images per day.');
    };

    const formatTimeRemaining = (resetAt) => {
        const diff = new Date(resetAt) - Date.now();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">AI Image Generator</h1>
                    <p className="text-gray-500">Generate stunning travel images for your marketing materials</p>
                </div>

                {/* Usage Banner */}
                {usage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
                        usage.plan === 'PRO' ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : 'bg-white border'
                    }`}>
                        <div className="flex items-center gap-4">
                            <div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    usage.plan === 'PRO' ? 'bg-white/20' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {usage.plan} PLAN
                                </span>
                            </div>
                            <div>
                                <p className={`text-sm ${usage.plan === 'PRO' ? 'text-white/80' : 'text-gray-600'}`}>
                                    {usage.images.remaining} of {usage.images.limit} images remaining today
                                </p>
                                <p className={`text-xs ${usage.plan === 'PRO' ? 'text-white/60' : 'text-gray-400'}`}>
                                    Resets in {formatTimeRemaining(usage.resetAt)}
                                </p>
                            </div>
                        </div>
                        {usage.plan === 'FREE' && (
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700"
                            >
                                Upgrade to Pro - ₹299/mo
                            </button>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Generator Form */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Create New Image</h2>

                        <div className="space-y-4">
                            {/* Destination Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="e.g., Goa Beach, Jaipur Palace, Kerala Backwaters"
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Custom Prompt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Prompt <span className="text-gray-400">(optional)</span>
                                </label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the image you want to generate..."
                                    rows={3}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Style Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {config?.styles.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setStyle(s.id)}
                                            className={`p-3 border rounded-lg text-sm text-left ${
                                                style === s.id
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <p className="font-medium">{s.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {config?.categories.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setCategory(c.id)}
                                            className={`px-4 py-2 rounded-full text-sm ${
                                                category === c.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={generating || (!prompt && !destination)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Generate Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Preview & History */}
                    <div className="space-y-6">
                        {/* Current/Selected Image */}
                        {selectedImage && (
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <h3 className="font-medium mb-3">Generated Image</h3>
                                <img
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.destination}
                                    className="w-full rounded-lg mb-3"
                                />
                                <p className="text-sm text-gray-600 mb-3">{selectedImage.destination}</p>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm">
                                        Download
                                    </button>
                                    <button className="flex-1 py-2 border rounded-lg text-sm hover:bg-gray-50">
                                        Share
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* History */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h3 className="font-medium mb-3">Recent Images</h3>
                            <div className="space-y-3">
                                {history.map(img => (
                                    <div
                                        key={img.id}
                                        onClick={() => setSelectedImage(img)}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                                            selectedImage?.id === img.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <img
                                            src={img.imageUrl}
                                            alt={img.destination}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{img.destination}</p>
                                            <p className="text-xs text-gray-500 capitalize">{img.style}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
                            <p className="text-gray-600">Get 10 images per day and unlock premium features</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>10 images per day (vs 2 on Free)</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>High resolution (1024x1024)</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Priority generation queue</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>10 itineraries per day</span>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <span className="text-4xl font-bold">₹299</span>
                            <span className="text-gray-500">/month</span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpgrade}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;
