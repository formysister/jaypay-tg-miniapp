import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Gift, Sparkles, Star } from 'lucide-react';

interface RewardLoaderProps {
    onComplete: () => void;
}

export function RewardLoader({ onComplete }: RewardLoaderProps) {
    const [progress, setProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const duration = 5000; // 5 seconds
        const interval = 50; // Update every 50ms
        const increment = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + increment;
                if (newProgress >= 100) {
                    clearInterval(timer);
                    setShowSuccess(true);
                    // Complete after showing success animation
                    setTimeout(() => {
                        onComplete();
                    }, 1000);
                    return 100;
                }
                return newProgress;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    const getLoadingText = () => {
        if (progress < 25) return 'Preparing your reward...';
        if (progress < 50) return 'Calculating bonus points...';
        if (progress < 75) return 'Verifying account...';
        if (progress < 95) return 'Almost ready...';
        return 'Success!';
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center p-8">
                        <div className="relative mb-6">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                                <Gift className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
                            </div>
                            <div className="absolute -bottom-2 -left-2">
                                <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
                            </div>
                        </div>

                        <h2 className="text-2xl mb-2 text-green-600">Reward Collected!</h2>
                        <p className="text-gray-600">999 RS added to your account</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-100">
            <Card className="w-full max-w-md">
                <CardContent className="text-center p-8">
                    <div className="relative mb-8">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <Gift className="w-12 h-12 text-white animate-pulse" />
                        </div>

                        {/* Floating particles */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        </div>
                        <div className="absolute top-4 right-4">
                            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                        </div>
                        <div className="absolute top-4 left-4">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                        </div>
                    </div>

                    <h2 className="text-xl mb-6 text-gray-700">{getLoadingText()}</h2>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="text-sm text-gray-500">
                        {Math.round(progress)}% complete
                    </div>

                    {/* Animated dots */}
                    <div className="flex justify-center space-x-2 mt-6">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}