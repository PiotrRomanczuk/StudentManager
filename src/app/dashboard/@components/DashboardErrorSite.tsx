"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  HelpCircle, 
  XCircle,
  Wifi,
  Shield,
  Database,
  UserX,
  Settings,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface DashboardErrorProps {
  error: string | Error;
  errorType?: 'auth' | 'network' | 'permission' | 'data' | 'server' | 'unknown';
  statusCode?: number;
  retryAction?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  backUrl?: string;
  additionalInfo?: string;
  errorId?: string;
}

type ActionConfig = 
  | { label: string; href: string; variant: "default" | "outline" }
  | { label: string; action: string; variant: "default" | "outline" };

const errorTypeConfig = {
  auth: {
    title: "Authentication Error",
    description: "You need to sign in to access this page",
    icon: UserX,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    actions: [
      { label: "Sign In", href: "/auth/signin", variant: "default" as const },
      { label: "Sign Up", href: "/auth/signup", variant: "outline" as const }
    ] as ActionConfig[]
  },
  network: {
    title: "Network Error",
    description: "Unable to connect to the server. Please check your internet connection",
    icon: Wifi,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    actions: [
      { label: "Try Again", action: "retry", variant: "default" as const },
      { label: "Check Connection", action: "checkNetwork", variant: "outline" as const }
    ] as ActionConfig[]
  },
  permission: {
    title: "Access Denied",
    description: "You don't have permission to access this resource",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    actions: [
      { label: "Go Home", href: "/dashboard", variant: "default" as const },
      { label: "Contact Admin", action: "contactAdmin", variant: "outline" as const }
    ] as ActionConfig[]
  },
  data: {
    title: "Data Error",
    description: "Unable to load or process the requested data",
    icon: Database,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    actions: [
      { label: "Try Again", action: "retry", variant: "default" as const },
      { label: "Refresh Page", action: "refresh", variant: "outline" as const }
    ] as ActionConfig[]
  },
  server: {
    title: "Server Error",
    description: "Something went wrong on our end. We're working to fix it",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    actions: [
      { label: "Try Again", action: "retry", variant: "default" as const },
      { label: "Go Home", href: "/dashboard", variant: "outline" as const }
    ] as ActionConfig[]
  },
  unknown: {
    title: "Something Went Wrong",
    description: "An unexpected error occurred",
    icon: XCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    actions: [
      { label: "Try Again", action: "retry", variant: "default" as const },
      { label: "Go Home", href: "/dashboard", variant: "outline" as const }
    ] as ActionConfig[]
  }
};

export function DashboardErrorSite({
  error,
  errorType = 'unknown',
  statusCode,
  retryAction,
  showHomeButton = true,
  showBackButton = false,
  backUrl = "/dashboard",
  additionalInfo,
  errorId
}: DashboardErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const config = errorTypeConfig[errorType];
  const IconComponent = config.icon;

  const handleRetry = async () => {
    if (retryAction) {
      setIsRetrying(true);
      try {
        await retryAction();
        toast.success("Operation completed successfully");
      } catch {
        toast.error("Failed to retry operation");
      } finally {
        setIsRetrying(false);
      }
    } else {
      window.location.reload();
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'retry':
        handleRetry();
        break;
      case 'refresh':
        window.location.reload();
        break;
      case 'checkNetwork':
        toast.info("Please check your internet connection and try again");
        break;
      case 'contactAdmin':
        toast.info("Please contact your administrator for access");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className={`${config.bgColor} ${config.borderColor} border-2 shadow-lg`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${config.bgColor} ${config.borderColor} border-2`}>
                <IconComponent className={`w-8 h-8 ${config.color}`} />
              </div>
            </div>
            <CardTitle className={`text-2xl font-bold ${config.color}`}>
              {config.title}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {config.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="font-mono text-sm">
                {typeof error === 'string' ? error : error.message || 'An error occurred'}
              </AlertDescription>
            </Alert>

            {/* Status Code */}
            {statusCode && (
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="text-sm">
                  Status: {statusCode}
                </Badge>
              </div>
            )}

            {/* Error ID for debugging */}
            {errorId && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Error ID: {errorId}
                </p>
              </div>
            )}

            {/* Additional Information */}
            {additionalInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900">Additional Information</h4>
                    <p className="text-sm text-blue-700 mt-1">{additionalInfo}</p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {config.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={() => {
                    if ('action' in action && action.action) {
                      handleAction(action.action);
                    }
                  }}
                  disabled={isRetrying && 'action' in action && action.action === 'retry'}
                  className="flex-1 sm:flex-none"
                  asChild={'href' in action}
                >
                  {'href' in action ? (
                    <Link href={action.href}>
                      {action.label}
                    </Link>
                  ) : (
                    <>
                      {isRetrying && 'action' in action && action.action === 'retry' && (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {action.label}
                    </>
                  )}
                </Button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {showBackButton && (
                <Button variant="ghost" asChild>
                  <Link href={backUrl} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </Link>
                </Button>
              )}
              
              {showHomeButton && (
                <Button variant="ghost" asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Dashboard Home
                  </Link>
                </Button>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <FileText className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">Need Help?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    If this problem persists, please contact support with the error details above.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 