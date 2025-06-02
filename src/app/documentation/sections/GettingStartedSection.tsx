import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const GettingStartedSection = () => (
  <section id="getting-started" className="mb-16">
    <Card>
      <CardHeader>
        <CardTitle>🚀 Getting Started</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>
            <b>Clone the repository:</b>
            <pre className="bg-gray-100 rounded p-2 mt-1 text-sm">
              git clone [repository-url] cd student-manager
            </pre>
          </li>
          <li>
            <b>Install dependencies:</b>
            <pre className="bg-gray-100 rounded p-2 mt-1 text-sm">
              npm install # or yarn install
            </pre>
          </li>
          <li>
            <b>Configure environment variables:</b>
            <pre className="bg-gray-100 rounded p-2 mt-1 text-sm overflow-x-auto whitespace-pre-wrap">
              NEXTAUTH_URL=http://localhost:3000
              NEXTAUTH_SECRET=your-nextauth-secret
              GOOGLE_ID=your-google-client-id
              GOOGLE_SECRET=your-google-client-secret
              SUPABASE_URL=your-supabase-url
              SUPABASE_ANON_KEY=your-supabase-anon-key
            </pre>
          </li>
          <li>
            <b>Run the development server:</b>
            <pre className="bg-gray-100 rounded p-2 mt-1 text-sm">
              npm run dev # or yarn dev
            </pre>
          </li>
          <li>
            <b>
              Open{" "}
              <a
                href="http://localhost:3000"
                className="text-indigo-600 underline"
              >
                http://localhost:3000
              </a>{" "}
              in your browser
            </b>
          </li>
        </ol>
      </CardContent>
    </Card>
  </section>
);

export default GettingStartedSection;
