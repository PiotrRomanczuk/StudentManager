import { DashboardErrorProps } from "./DashboardErrorSite";

export interface ErrorInfo {
  message: string;
  type: DashboardErrorProps['errorType'];
  statusCode?: number;
  additionalInfo?: string;
  errorId?: string;
}

/**
 * Determines the error type based on error message and status code
 */
export function determineErrorType(
  error: string | Error,
  statusCode?: number
): DashboardErrorProps['errorType'] {
  const message = typeof error === 'string' ? error : error.message;
  const lowerMessage = message.toLowerCase();

  // Check for authentication errors
  if (
    lowerMessage.includes('sign in') ||
    lowerMessage.includes('authentication') ||
    lowerMessage.includes('unauthorized') ||
    lowerMessage.includes('login') ||
    statusCode === 401
  ) {
    return 'auth';
  }

  // Check for permission errors
  if (
    lowerMessage.includes('permission') ||
    lowerMessage.includes('access denied') ||
    lowerMessage.includes('not authorized') ||
    lowerMessage.includes('admin') ||
    statusCode === 403
  ) {
    return 'permission';
  }

  // Check for network errors
  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('timeout') ||
    statusCode === 503 ||
    statusCode === 504
  ) {
    return 'network';
  }

  // Check for data errors
  if (
    lowerMessage.includes('not found') ||
    lowerMessage.includes('data') ||
    lowerMessage.includes('load') ||
    statusCode === 404
  ) {
    return 'data';
  }

  // Check for server errors
  if (
    lowerMessage.includes('server') ||
    lowerMessage.includes('internal') ||
    statusCode === 500 ||
    statusCode === 502
  ) {
    return 'server';
  }

  return 'unknown';
}

/**
 * Generates a unique error ID for tracking
 */
export function generateErrorId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `ERR-${timestamp}-${random}`.toUpperCase();
}

/**
 * Extracts additional information based on error type
 */
export function getAdditionalInfo(
  errorType: DashboardErrorProps['errorType'],
  error: string | Error
): string {
  const message = typeof error === 'string' ? error : error.message;

  switch (errorType) {
    case 'auth':
      return "Please ensure you're signed in with the correct account. If the problem persists, try signing out and signing back in.";
    
    case 'network':
      return "Check your internet connection and try again. If the problem continues, the server might be temporarily unavailable.";
    
    case 'permission':
      return "This action requires specific permissions. Contact your administrator if you believe you should have access.";
    
    case 'data':
      return "The requested data could not be found or loaded. This might be due to a temporary issue or the data may have been moved.";
    
    case 'server':
      return "We're experiencing technical difficulties. Our team has been notified and is working to resolve this issue.";
    
    default:
      return "An unexpected error occurred. Please try again, and if the problem persists, contact support.";
  }
}

/**
 * Creates a complete error configuration for the DashboardErrorSite component
 */
export function createErrorConfig(
  error: string | Error,
  statusCode?: number,
  customErrorId?: string
): DashboardErrorProps {
  const message = typeof error === 'string' ? error : error.message;
  const errorType = determineErrorType(error, statusCode);
  const additionalInfo = getAdditionalInfo(errorType, error);

  return {
    error: message,
    errorType,
    statusCode,
    additionalInfo,
    errorId: customErrorId || generateErrorId(),
    showHomeButton: true,
    showBackButton: true
  };
}

/**
 * Handles common error scenarios and returns appropriate error configuration
 */
export function handleCommonErrors(
  error: unknown,
  context?: string
): DashboardErrorProps {
  let errorMessage = "An unexpected error occurred";
  let statusCode: number | undefined;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'status' in error) {
    statusCode = (error as any).status;
    errorMessage = (error as any).message || errorMessage;
  }

  // Add context to error message if provided
  if (context) {
    errorMessage = `${context}: ${errorMessage}`;
  }

  return createErrorConfig(errorMessage, statusCode);
} 