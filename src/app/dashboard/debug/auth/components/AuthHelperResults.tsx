import { CollapsibleSection } from './CollapsibleSection';

interface AuthHelperResultsProps {
  user: unknown;
  isAdmin: boolean;
  currentUser: unknown;
}

export function AuthHelperResults({ user, isAdmin, currentUser }: AuthHelperResultsProps) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="getUserAndAdminStatus Result" defaultExpanded={true}>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify({ user, isAdmin }, null, 2)}
        </pre>
      </CollapsibleSection>

      <CollapsibleSection title="getCurrentUser Result" defaultExpanded={true}>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify({ currentUser }, null, 2)}
        </pre>
      </CollapsibleSection>
    </div>
  );
} 