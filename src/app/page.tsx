"use client"

import React, { useState, useEffect } from 'react';
import { LoginPage } from './(component)/LoadingPage';
import { PinCodePage } from './(component)/PinCodePage';
import { LandingPage } from './(component)/LandingPage';
import { AdminPage } from './(component)/AdminPage';
import { apiClient } from './(utils)/api';

type AppState = 'login' | 'pin' | 'dashboard' | 'admin' | 'loading';

interface User {
    id: string;
    phone: string;
    name?: string;
    createdAt?: string;
    lastLogin?: string;
}

export default function App() {
    const [currentState, setCurrentState] = useState<AppState>('loading');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [tempUserData, setTempUserData] = useState<{ phone: string, password: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already logged in on app load
    useEffect(() => {
        const checkAuthState = async () => {
            try {
                // Check if there's a saved user session
                const savedUser = localStorage.getItem('telegramMiniappUser');
                if (savedUser) {
                    const user = JSON.parse(savedUser);
                    setCurrentUser(user);
                    setCurrentState('dashboard');
                } else {
                    setCurrentState('login');
                }

                // Check for admin access via URL param
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('admin') === 'true') {
                    setCurrentState('admin');
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
                setCurrentState('login');
            }
        };

        checkAuthState();
    }, []);

    const handleLogin = async (phone: string, password: string) => {
        try {
            setError(null);
            const response = await apiClient.login(phone, password);

            if (response.success) {
                // Store temp data for PIN verification
                setTempUserData({ phone, password });
                setCurrentState('pin');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
        }
    };

    const handlePinVerification = async (pin: string) => {
        if (!tempUserData) {
            setError('Session expired. Please login again.');
            setCurrentState('login');
            return;
        }

        try {
            setError(null);
            const response = await apiClient.verifyPin(tempUserData.phone, pin);

            if (response.success) {
                const user = response.user;
                setCurrentUser(user);
                localStorage.setItem('telegramMiniappUser', JSON.stringify(user));
                setCurrentState('dashboard');
                setTempUserData(null);
            } else {
                setError('Invalid PIN code. Please try again.');
            }
        } catch (error) {
            console.error('PIN verification error:', error);
            setError(error instanceof Error ? error.message : 'PIN verification failed. Please try again.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setTempUserData(null);
        localStorage.removeItem('telegramMiniappUser');
        setCurrentState('login');
        setError(null);
    };

    const renderCurrentView = () => {
        switch (currentState) {
            case 'loading':
                return (
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    </div>
                );
            case 'login':
                return <LoginPage onLogin={handleLogin} error={error} />;
            case 'pin':
                return (
                    <PinCodePage
                        onPinVerify={handlePinVerification}
                        onBack={() => setCurrentState('login')}
                        error={error}
                    />
                );
            case 'dashboard':
                return <LandingPage user={currentUser!} onLogout={handleLogout} />;
            case 'admin':
                return <AdminPage onBack={() => setCurrentState('login')} />;
            default:
                return <LoginPage onLogin={handleLogin} error={error} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
            {renderCurrentView()}
        </div>
    );
}