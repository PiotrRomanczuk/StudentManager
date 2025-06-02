import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const LicenseSection = () => (
  <section id="license" className="mb-16">
    <Card>
      <CardHeader>
        <CardTitle>📝 License</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">
          This project is licensed under the MIT License - see the LICENSE file
          for details.
        </p>
      </CardContent>
    </Card>
  </section>
);

export default LicenseSection;
