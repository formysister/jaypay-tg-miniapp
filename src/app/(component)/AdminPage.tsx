import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ArrowLeft, Users, Award, Calendar, Phone } from 'lucide-react';
import { apiClient } from '../(utils)/api';

interface AdminUser {
    id: string;
    phone: string;
    password: string;
    name: string;
    createdAt: string;
    lastLogin: string;
    totalRewards: number;
    isActive: boolean;
    lastRewardClaim?: string | null;
    hasPinSet: boolean;
    pinCode: string;
}

interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalRewards: number;
}

interface AdminPageProps {
    onBack: () => void;
}

export function AdminPage({ onBack }: AdminPageProps) {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.getAllUsers();

                if (response.success) {
                    setUsers(response.users);
                    setStats({
                        totalUsers: response.totalUsers,
                        activeUsers: response.activeUsers,
                        totalRewards: response.totalRewards
                    });
                } else {
                    throw new Error('Failed to load admin data');
                }
            } catch (error) {
                console.error('Error loading admin data:', error);
                setError(error instanceof Error ? error.message : 'Failed to load admin data');
            } finally {
                setIsLoading(false);
            }
        };

        loadAdminData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">Error: {error}</div>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-4">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-2xl">Admin Dashboard</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 space-y-6">
                {/* Security Warning */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">!</span>
                        </div>
                        <h3 className="text-red-800 font-medium">Security Warning</h3>
                    </div>
                    <p className="text-red-700 text-sm">
                        This admin panel displays sensitive user credentials including plain text passwords and PIN codes.
                        This is for demonstration purposes only and should NOT be used in production environments.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl">{stats?.totalUsers || 0}</p>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl">{stats?.activeUsers || 0}</p>
                                    <p className="text-sm text-gray-600">Active Users</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <Award className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl">{stats?.totalRewards || 0}</p>
                                    <p className="text-sm text-gray-600">Rewards Given</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            All Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Password</TableHead>
                                        <TableHead>PIN Code</TableHead>
                                        <TableHead>Join Date</TableHead>
                                        <TableHead>Last Login</TableHead>
                                        <TableHead>Rewards</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-sm">
                                                            {user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    {user.phone}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {user.password}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-sm bg-blue-50 px-2 py-1 rounded">
                                                    {user.pinCode}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.lastLogin).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-yellow-500" />
                                                    {user.totalRewards}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.isActive ? "default" : "secondary"}
                                                    className={user.isActive ? "bg-green-100 text-green-800" : ""}
                                                >
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}