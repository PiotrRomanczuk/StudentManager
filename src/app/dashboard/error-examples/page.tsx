"use client";

import { DashboardErrorSite } from "../@components/DashboardErrorSite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function ErrorExamplesPage() {
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'auth' | 'network' | 'permission' | 'data' | 'server' | 'unknown'>('unknown');

  const errorExamples = [
    {
      type: 'auth' as const,
      title: 'Authentication Error',
      description: 'User needs to sign in',
      error: 'Please sign in to view your dashboard',
      statusCode: 401
    },
    {
      type: 'network' as const,
      title: 'Network Error',
      description: 'Connection issues',
      error: 'Failed to fetch data from server. Please check your internet connection.',
      statusCode: 503
    },
    {
      type: 'permission' as const,
      title: 'Access Denied',
      description: 'User lacks permissions',
      error: 'You are not authorized to access this resource. Admin privileges required.',
      statusCode: 403
    },
    {
      type: 'data' as const,
      title: 'Data Error',
      description: 'Data loading issues',
      error: 'Unable to load songs data. The requested resource could not be found.',
      statusCode: 404
    },
    {
      type: 'server' as const,
      title: 'Server Error',
      description: 'Internal server issues',
      error: 'Internal server error. Our team has been notified and is working to resolve this issue.',
      statusCode: 500
    },
    {
      type: 'unknown' as const,
      title: 'Unknown Error',
      description: 'Generic error handling',
      error: 'An unexpected error occurred while processing your request.',
      statusCode: 500
    }
  ];

  const handleRetry = async () => {
    // Simulate a retry action
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentError(null);
  };

  if (currentError) {
    return (
      <DashboardErrorSite
        error={currentError}
        errorType={errorType}
        statusCode={errorExamples.find(ex => ex.type === errorType)?.statusCode}
        retryAction={handleRetry}
        showHomeButton={true}
        showBackButton={true}
        backUrl="/dashboard/error-examples"
        additionalInfo="This is an example error page. In a real application, this would contain helpful information for debugging."
        errorId="EXAMPLE-ERROR-123"
      />
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Error Examples</h1>
        <p className="text-gray-600">
          This page demonstrates different types of error scenarios in the dashboard.
          Click on any error type to see how it would be displayed to users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {errorExamples.map((example) => (
          <Card key={example.type} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  example.type === 'auth' ? 'bg-orange-500' :
                  example.type === 'network' ? 'bg-blue-500' :
                  example.type === 'permission' ? 'bg-red-500' :
                  example.type === 'data' ? 'bg-purple-500' :
                  example.type === 'server' ? 'bg-gray-500' :
                  'bg-gray-400'
                }`} />
                {example.title}
              </CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{example.error}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status: {example.statusCode}</span>
                <Button
                  onClick={() => {
                    setCurrentError(example.error);
                    setErrorType(example.type);
                  }}
                  size="sm"
                >
                  View Error
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">About Error Handling</h3>
        <p className="text-blue-700 text-sm">
          The DashboardErrorSite component provides a consistent and user-friendly way to display errors across the dashboard. 
          It includes different error types with appropriate styling, helpful actions, and clear navigation options.
        </p>
      </div>
    </div>
  );
} 