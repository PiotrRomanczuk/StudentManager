import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Song } from "@/types/Song";

interface RenderInputProps {
  id: keyof Song;
  label: string;
  required?: boolean;
  value: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; // Add this line
}

const RenderInput: React.FC<RenderInputProps> = ({
  id,
  label,
  required = false,
  value,
  handleInputChange,
  type = "text",
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>
      {label}
      {required && " *"}
    </Label>
    <Input
      type={type} // Modify this line
      id={id}
      value={value || ""}
      onChange={handleInputChange}
      required={required}
    />
  </div>
);

export default RenderInput;
