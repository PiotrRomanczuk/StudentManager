"use client";

import { DashboardErrorProps, DashboardErrorSite } from "./@components/DashboardErrorSite";

export default function Error({ error, errorType, statusCode, retryAction, showHomeButton, showBackButton, backUrl, additionalInfo, errorId }: DashboardErrorProps) {
  return <DashboardErrorSite
    error={error}
    errorType={errorType}
    statusCode={statusCode}
    retryAction={retryAction}
    showHomeButton={showHomeButton}
    showBackButton={showBackButton}
    backUrl={backUrl}
    additionalInfo={additionalInfo}
    errorId={errorId} />;
}