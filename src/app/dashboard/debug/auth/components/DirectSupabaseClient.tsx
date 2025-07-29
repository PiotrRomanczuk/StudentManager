import { CollapsibleSection } from './CollapsibleSection';

interface DirectSupabaseClientProps {
  supabaseUser: unknown;
  supabaseError: unknown;
}

export function DirectSupabaseClient({ supabaseUser, supabaseError }: DirectSupabaseClientProps) {
  return (
    <CollapsibleSection title="Direct Supabase Client" defaultExpanded={true}>
      <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
        {JSON.stringify({ 
          user: supabaseUser, 
          error: supabaseError 
        }, null, 2)}
      </pre>
    </CollapsibleSection>
  );
} 