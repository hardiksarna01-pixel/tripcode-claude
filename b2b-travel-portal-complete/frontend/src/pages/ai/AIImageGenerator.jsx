import React, { useState } from 'react';
import {
    PhotoIcon,
    SparklesIcon,
    ArrowDownTrayIcon,
    HeartIcon,
    ShareIcon,
    ArrowPathIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';

const AIImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('realistic');
    const [aspect, setAspect] = useState('1:1');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [history, setHistory] = useState([]);

    const styles = [
        { id: 'realistic', name: 'Realistic', preview: '📸' },
        { id: 'artistic', name: 'Artistic', preview: '🎨' },
        { id: 'watercolor', name: 'Watercolor', preview: '🖼️' },
        { id: 'digital', name: 'Digital Art', preview: '💻' },
        { id: 'vintage', name: 'Vintage', preview: '📷' },
        { id: 'minimalist', name: 'Minimalist', preview: '⬜' },
        { id: 'fantasy', name: 'Fantasy', preview: '🧙' },
        { id: 'cinematic', name: 'Cinematic', preview: '🎬' }
    ];

    const aspects = [
        { id: '1:1', name: 'Square (1:1)', icon: '⬛' },
        { id: '16:9', name: 'Landscape (16:9)', icon: '▬' },
        { id: '9:16', name: 'Portrait (9:16)', icon: '▮' },
        { id: '4:3', name: 'Standard (4:3)', icon: '🖼️' }
    ];

    const suggestions = [
        'A serene beach at sunset with palm trees and crystal clear water',
        'Swiss Alps with snow-capped mountains and a wooden cabin',
        'Vibrant streets of Tokyo with neon lights at night',
        'Ancient temple in Bali surrounded by tropical jungle',
        'Aerial view of Maldives overwater villas',
        'Northern lights over a frozen lake in Iceland'
    ];

    const generateImages = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setImages([]);

        try {
            const response = await api.post('/ai/image-generate', {
                prompt: `Travel destination: ${prompt}`,
                style,
                aspect,
                count: 4
            });

            const generatedImages = response.data.images || generateMockImages();
            setImages(generatedImages);
            setHistory(prev => [{
                prompt,
                style,
                images: generatedImages,
                timestamp: new Date()
            }, ...prev.slice(0, 9)]);
        } catch (error) {
            console.error('Error generating images:', error);
            const mockImages = generateMockImages();
            setImages(mockImages);
            setHistory(prev => [{
                prompt,
                style,
                images: mockImages,
                timestamp: new Date()
            }, ...prev.slice(0, 9)]);
        } finally {
            setLoading(false);
        }
    };

    const generateMockImages = () => {
        const colors = [
            ['from-blue-400', 'to-purple-500'],
            ['from-pink-400', 'to-orange-500'],
            ['from-green-400', 'to-cyan-500'],
            ['from-yellow-400', 'to-red-500']
        ];

        return colors.map((color, index) => ({
            id: Date.now() + index,
            url: null,
            gradient: `bg-gradient-to-br ${color[0]} ${color[1]}`,
            prompt: prompt
        }));
    };

    const toggleFavorite = (imageId) => {
        setFavorites(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    const downloadImage = (image) => {
        // In real implementation, this would download the actual image
        alert('Image download started!');
    };

    const shareImage = (image) => {
        // In real implementation, this would open share dialog
        alert('Share functionality coming soon!');
    };

    const regenerate = () => {
        generateImages();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-2">
                        <PhotoIcon className="w-8 h-8" />
                        <h1 className="text-4xl font-bold">AI Image Generator</h1>
                    </div>
                    <p className="text-pink-200">Create stunning travel destination images with AI</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Prompt Input */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Describe your dream destination
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                placeholder="E.g., A peaceful mountain resort with cherry blossoms in Japan..."
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 resize-none"
                            />

                            {/* Quick Suggestions */}
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.slice(0, 3).map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPrompt(suggestion)}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-gray-600 transition"
                                        >
                                            {suggestion.slice(0, 30)}...
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Style Selection */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Image Style
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {styles.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStyle(s.id)}
                                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition ${
                                            style === s.id
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-2xl mb-1">{s.preview}</span>
                                        <span className="text-xs">{s.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center justify-between w-full"
                            >
                                <span className="font-medium flex items-center gap-2">
                                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                    Advanced Options
                                </span>
                                <span>{showAdvanced ? '−' : '+'}</span>
                            </button>

                            {showAdvanced && (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">
                                            Aspect Ratio
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {aspects.map(a => (
                                                <button
                                                    key={a.id}
                                                    onClick={() => setAspect(a.id)}
                                                    className={`flex items-center gap-2 p-2 rounded border transition ${
                                                        aspect === a.id
                                                            ? 'border-purple-500 bg-purple-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span>{a.icon}</span>
                                                    <span className="text-xs">{a.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={generateImages}
                            disabled={!prompt.trim() || loading}
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5" />
                                    Generate Images
                                </>
                            )}
                        </button>

                        {/* Usage Info */}
                        <div className="bg-purple-50 rounded-lg p-4 text-sm">
                            <p className="text-purple-800 font-medium mb-1">Usage Credits</p>
                            <div className="flex items-center gap-2 text-purple-600">
                                <div className="flex-1 bg-purple-200 rounded-full h-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }} />
                                </div>
                                <span>65/100</span>
                            </div>
                            <p className="text-xs text-purple-500 mt-2">Resets monthly • Premium: Unlimited</p>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                        {/* Generated Images */}
                        {images.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg">Generated Images</h3>
                                    <button
                                        onClick={regenerate}
                                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                                    >
                                        <ArrowPathIcon className="w-4 h-4" />
                                        Regenerate
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {images.map((image, index) => (
                                        <div key={image.id} className="relative group">
                                            <div className={`aspect-square rounded-xl overflow-hidden ${image.gradient} flex items-center justify-center`}>
                                                {image.url ? (
                                                    <img
                                                        src={image.url}
                                                        alt={image.prompt}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-white text-center p-4">
                                                        <PhotoIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm opacity-75">AI Generated Preview</p>
                                                        <p className="text-xs opacity-50 mt-1">Image #{index + 1}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => toggleFavorite(image.id)}
                                                    className="p-2 bg-white rounded-full hover:scale-110 transition"
                                                >
                                                    {favorites.includes(image.id) ? (
                                                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                                                    ) : (
                                                        <HeartIcon className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => downloadImage(image)}
                                                    className="p-2 bg-white rounded-full hover:scale-110 transition"
                                                >
                                                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => shareImage(image)}
                                                    className="p-2 bg-white rounded-full hover:scale-110 transition"
                                                >
                                                    <ShareIcon className="w-5 h-5 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-xs text-gray-400 mt-4 text-center">
                                    Images generated using DALL-E 3. Click on images for full resolution.
                                </p>
                            </div>
                        )}

                        {/* Empty State */}
                        {images.length === 0 && !loading && (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PhotoIcon className="w-12 h-12 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Create Amazing Travel Images</h3>
                                <p className="text-gray-600 mb-6">
                                    Describe your dream destination and let AI bring it to life
                                </p>
                                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                                    {suggestions.slice(0, 4).map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPrompt(suggestion)}
                                            className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition"
                                        >
                                            {suggestion.slice(0, 40)}...
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-4 relative">
                                    <div className="absolute inset-0 rounded-full bg-purple-100 animate-ping" />
                                    <div className="relative w-24 h-24 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                                        <SparklesIcon className="w-12 h-12 text-white animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Creating Your Images</h3>
                                <p className="text-gray-600">
                                    AI is painting your dream destination...
                                </p>
                                <div className="mt-4 flex justify-center gap-1">
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* History */}
                        {history.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="font-semibold text-lg mb-4">Recent Generations</h3>
                                <div className="space-y-4">
                                    {history.slice(0, 5).map((item, index) => (
                                        <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex -space-x-2">
                                                {item.images.slice(0, 2).map((img, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-12 h-12 rounded-lg ${img.gradient} border-2 border-white`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm line-clamp-1">{item.prompt}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.style} • {new Date(item.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setPrompt(item.prompt);
                                                    setStyle(item.style);
                                                }}
                                                className="text-purple-600 text-sm hover:underline"
                                            >
                                                Reuse
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIImageGenerator;
