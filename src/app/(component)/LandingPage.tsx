import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RewardLoader } from './RewardLoader';
import { Gift, User, LogOut, Settings } from 'lucide-react';
import { apiClient } from '../(utils)/api';

interface User {
    id: string;
    phone: string;
    name?: string;
    createdAt?: string;
    lastLogin?: string;
}

interface UserStats {
    totalRewards: number;
    lastRewardClaim?: string | null;
    joinDate: string;
    lastLogin: string;
}

interface LandingPageProps {
    user: User;
    onLogout: () => void;
}

export function LandingPage({ user, onLogout }: LandingPageProps) {
    const [isCollecting, setIsCollecting] = useState(false);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user stats on component mount
    useEffect(() => {
        const loadUserStats = async () => {
            try {
                setIsLoadingStats(true);
                const response = await apiClient.getUserStats(user.phone);
                if (response.success) {
                    setUserStats(response.stats);
                }
            } catch (error) {
                console.error('Error loading user stats:', error);
                setError('Failed to load user stats');
            } finally {
                setIsLoadingStats(false);
            }
        };

        loadUserStats();
    }, [user.phone]);

    const handleCollectReward = async () => {
        if (!userStats) return;

        const today = new Date().toISOString().split('T')[0];

        // Check if already claimed today
        if (userStats.lastRewardClaim === today) {
            alert('You have already collected your reward today! Come back tomorrow.');
            return;
        }

        setIsCollecting(true);
    };

    const handleRewardCollected = async () => {
        try {
            const response = await apiClient.collectReward(user.phone);

            if (response.success) {
                // Update local stats
                setUserStats(prev => prev ? {
                    ...prev,
                    totalRewards: response.totalRewards,
                    lastRewardClaim: response.lastClaimed
                } : null);

                setIsCollecting(false);
            } else {
                throw new Error('Failed to collect reward');
            }
        } catch (error) {
            console.error('Error collecting reward:', error);
            // setError('Failed to collect reward. Please try again.');
            setIsCollecting(false);
        }
    };

    const canClaimToday = () => {
        if (!userStats) return false;
        const today = new Date().toISOString().split('T')[0];
        return userStats.lastRewardClaim !== today;
    };

    if (isCollecting) {
        return <RewardLoader onComplete={handleRewardCollected} />;
    }

    if (isLoadingStats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your stats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-4">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-medium">{user.name || 'User'}</h2>
                            <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onLogout}>
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
                {error && (
                    <div className="w-full max-w-md p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setError(null)}
                            className="p-0 h-auto text-xs"
                        >
                            Dismiss
                        </Button>
                    </div>
                )}
                <Card className="w-full max-w-md bg-[#fff8d2]">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Gift className="w-10 h-10 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Daily Rewards</CardTitle>
                        <p className="text-gray-600">Collect your daily reward and earn points!</p>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-3xl mb-1">{userStats?.totalRewards || 0}</div>
                            <div className="text-sm text-gray-600">Total Rewards Collected</div>
                        </div>

                        {userStats?.lastRewardClaim && (
                            <div className="text-sm text-gray-500">
                                Last claimed: {new Date(userStats.lastRewardClaim).toLocaleDateString()}
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                                {canClaimToday() ? 'Ready to claim!' : 'Come back tomorrow for your next reward'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <Card className='bg-[#fff8d2]'>
                        <CardContent className="text-center p-4">
                            <div className="text-2xl mb-1">{userStats?.totalRewards || 0}</div>
                            <div className="text-sm text-gray-600">Day Streak</div>
                        </CardContent>
                    </Card>
                    <Card className='bg-[#fff8d2]'>
                        <CardContent className="text-center p-4">
                            <div className="text-2xl mb-1">{(userStats?.totalRewards || 0) * 50}</div>
                            <div className="text-sm text-gray-600">Total Points</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-4 border-t">
                <div className="max-w-md mx-auto">
                    <Button
                        onClick={handleCollectReward}
                        disabled={!canClaimToday()}
                        className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400"
                    >
                        {canClaimToday() ? (
                            <>
                                <Gift className="w-5 h-5 mr-2" />
                                Collect Reward
                            </>
                        ) : (
                            'Claimed Today ✓'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}