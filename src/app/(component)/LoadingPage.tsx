import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Phone, Lock, Send } from 'lucide-react';

interface LoginPageProps {
    onLogin: (phone: string, password: string) => void;
    error?: string | null;
}

export function LoginPage({ onLogin, error }: LoginPageProps) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (!/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ''))) {
            alert('Please enter a valid phone number');
            return;
        }

        setIsLoading(true);

        try {
            await onLogin(phone, password);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 flex-col gap-2">
            <img alt='Top-Banner' src={'/banner.png'} className='flex w-full rounded-lg' />
            <Card className="w-full max-w-md bg-[#fff8d2]">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                        {/* <Send className="w-8 h-8 text-white" /> */}
                        <img src={"/logo.jpg"} className='flex w-full rounded-md' />
                    </div>
                    <CardTitle className="text-3xl text-white font-bold text-outline-black">
                        Welcome to JayPay
                    </CardTitle>
                    <p className="text-gray-600">Sign in to collect your daily rewards</p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4" />
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                placeholder="+1 234 567 8900"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-10"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                                <Lock className="w-4 h-4" />
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-semibold shadow-sm hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Enter any 6-digit PIN to set up your account</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}