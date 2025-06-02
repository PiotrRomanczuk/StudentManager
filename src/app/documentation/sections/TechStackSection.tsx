import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TechStackSection = () => (
  <section id="tech-stack" className="mb-16">
    <Card>
      <CardHeader>
        <CardTitle>🛠️ Tech Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            <b>Frontend Framework:</b> Next.js
          </li>
          <li>
            <b>Database:</b> Supabase
          </li>
          <li>
            <b>Authentication:</b> Supabase Auth, Google OAuth
          </li>
          <li>
            <b>Data Validation:</b> Zod
          </li>
          <li>
            <b>Styling:</b> Tailwind CSS
          </li>
          <li>
            <b>API:</b> RESTful endpoints with Next.js API routes
          </li>
        </ul>
      </CardContent>
    </Card>
  </section>
);

export default TechStackSection;
