"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Song } from "@/types/Song";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  FORM_FIELDS,
  LEVEL_OPTIONS,
  MUSICAL_KEYS,
} from "../../../../../components/dashboard/forms/CONSTANTS";

const songSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().optional(),
  level: z.string().min(1, "Level is required"),
  key: z.string().optional(),
  chords: z.string().optional(),
  audio_files: z.string().nullable().optional(),
  ultimate_guitar_link: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Ultimate Guitar link is required"),
  short_title: z.string().optional(),
});

type SongFormData = z.infer<typeof songSchema>;

export interface SongFormProps {
  mode: "create" | "edit";
  songId?: string;
  song?: Song;
  loading: boolean;
  error: string | null;
  onSubmit: (formData: Partial<Song>) => void;
  onCancel: () => void;
}

export function SongForm({
  mode,
  song,
  loading,
  error,
  onSubmit,
  onCancel,
}: SongFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: song || {},
  });

  const handleSelectChange = (id: string, value: string) => {
    setValue(id as keyof SongFormData, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Handle file upload here

      // You might want to update the form state with the file URLs or IDs
    }
  };

  const getSelectOptions = (fieldId: string) => {
    switch (fieldId) {
      case "level":
        return LEVEL_OPTIONS;
      case "key":
        return MUSICAL_KEYS;
      default:
        return [];
    }
  };

  const onSubmitForm = (data: SongFormData) => {
    onSubmit(data as Partial<Song>);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {mode === "create" ? "Create New Song" : "Edit Song"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {mode === "create"
            ? "Fill in the details below to create a new song"
            : "Update the song details below"}
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FORM_FIELDS.map((field) => (
              <div
                key={field.id}
                className={cn("space-y-2", field.fullWidth && "md:col-span-2")}
              >
                <Label htmlFor={field.id} className="flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === "select" ? (
                  <div className="space-y-1">
                    <Select
                      value={watch(field.id as keyof SongFormData) || ""}
                      onValueChange={(value) =>
                        handleSelectChange(field.id, value)
                      }
                      autoComplete="off"
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          errors[field.id as keyof SongFormData] &&
                            "border-red-500",
                        )}
                      >
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {getSelectOptions(field.id).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[field.id as keyof SongFormData] && (
                      <p className="text-sm text-red-500">
                        {errors[field.id as keyof SongFormData]?.message}
                      </p>
                    )}
                  </div>
                ) : field.type === "textarea" ? (
                  <div className="space-y-1">
                    <Textarea
                      id={field.id}
                      {...register(field.id as keyof SongFormData)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={cn(
                        "min-h-[300px] resize-y",
                        errors[field.id as keyof SongFormData] &&
                          "border-red-500",
                      )}
                      autoComplete="off"
                    />
                    {errors[field.id as keyof SongFormData] && (
                      <p className="text-sm text-red-500">
                        {errors[field.id as keyof SongFormData]?.message}
                      </p>
                    )}
                  </div>
                ) : field.type === "file" ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input
                        id={field.id}
                        type="file"
                        accept={field.accept}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById(field.id)?.click()
                        }
                        className="w-full transition-all duration-200 hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Audio Files
                      </Button>
                    </div>
                    {errors[field.id as keyof SongFormData] && (
                      <p className="text-sm text-red-500">
                        {errors[field.id as keyof SongFormData]?.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Input
                      id={field.id}
                      {...register(field.id as keyof SongFormData)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={cn(
                        "focus:ring-2 focus:ring-primary/20",
                        errors[field.id as keyof SongFormData] &&
                          "border-red-500",
                      )}
                      autoComplete="off"
                    />
                    {errors[field.id as keyof SongFormData] && (
                      <p className="text-sm text-red-500">
                        {errors[field.id as keyof SongFormData]?.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-gray-100"
          >
            {mode === "create" ? "Back to Songs" : "Back to Song"}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px] bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Create Song"
                : "Update Song"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
