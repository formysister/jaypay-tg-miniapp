import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

interface PinCodePageProps {
    onPinVerify: (pin: string) => void;
    onBack: () => void;
    error?: string | null;
}

export function PinCodePage({ onPinVerify, onBack, error }: PinCodePageProps) {
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus on first input when component mounts
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handlePinChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace') {
            if (!pin[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newPin = [...pin];
                newPin[index] = '';
                setPin(newPin);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pinString = pin.join('');

        if (pinString.length !== 6) {
            alert('Please enter a complete 6-digit PIN');
            return;
        }

        setIsLoading(true);

        try {
            await onPinVerify(pinString);
        } catch (error) {
            console.error('PIN verification error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData.length === 6) {
            const newPin = pastedData.split('');
            setPin(newPin);
            inputRefs.current[5]?.focus();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="absolute left-4 top-4 p-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Enter PIN Code</CardTitle>
                    <p className="text-gray-600">Please enter the 6-digit verification PIN</p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2" onPaste={handlePaste}>
                            {pin.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el: any) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center border-2 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || pin.join('').length !== 6}
                        >
                            {isLoading ? 'Verifying...' : 'Verify PIN'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 mb-2">Enter your 6-digit PIN</p>
                        <p className="text-xs text-gray-400">This will be your secure PIN for future logins</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}