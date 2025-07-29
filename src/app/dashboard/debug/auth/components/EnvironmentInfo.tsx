import { CollapsibleSection } from './CollapsibleSection';

export function EnvironmentInfo() {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Environment Variables" defaultExpanded={false}>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify({
            NODE_ENV: process.env.NODE_ENV,
            BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
            SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not Set",
            SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not Set"
          }, null, 2)}
        </pre>
      </CollapsibleSection>

      <CollapsibleSection title="Request Info" defaultExpanded={false}>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify({
            host: process.env.HOSTNAME || 'localhost',
            port: process.env.PORT || '3000',
            baseUrl: process.env.NODE_ENV === 'development' 
              ? "http://localhost:3000"
              : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
          }, null, 2)}
        </pre>
      </CollapsibleSection>
    </div>
  );
} 