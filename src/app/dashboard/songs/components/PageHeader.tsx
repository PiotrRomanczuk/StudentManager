interface PageHeaderProps {
  title?: string;
}

export function PageHeader({ title = "Songs" }: PageHeaderProps) {
  return (
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
  );
} 