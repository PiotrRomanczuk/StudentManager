import { CollapsibleSection } from './CollapsibleSection';

interface ApiFunctionCallsProps {
  apiTest1: unknown;
  apiTest2: unknown;
}

export function ApiFunctionCalls({ apiTest1, apiTest2 }: ApiFunctionCallsProps) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Direct API Function Call - /api/auth/session/current-user" defaultExpanded={true}>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(apiTest1, null, 2)}
        </pre>
      </CollapsibleSection>

      <CollapsibleSection title="Direct API Function Call - /api/auth/admin/user-and-admin" defaultExpanded={true}>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(apiTest2, null, 2)}
        </pre>
      </CollapsibleSection>
    </div>
  );
} 