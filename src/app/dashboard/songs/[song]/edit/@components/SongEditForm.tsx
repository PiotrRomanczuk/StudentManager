"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Song } from "@/types/Song"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { SongFormProps } from "@/components/dashboard/forms/ISongForm"
import { normalizeSongData } from "@/utils/normalizeSongData"
import { Controller } from "react-hook-form"

export function SongEditForm({ mode, song, loading, error, onSubmit, onCancel }: SongFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Partial<Song>>({
    defaultValues: song || {},
  })

  const onSubmitForm = (data: Partial<Song>) => {
    if (!song) return
    const normalizedData = normalizeSongData(data, song)
    onSubmit(normalizedData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create New Song" : "Edit Song"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Title"
              id="title"
              register={register}
              required
              error={errors.title ? "Title is required" : undefined}
            />
            <FormInput label="Author" id="author" register={register} />

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Controller
                name="level"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="level" className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.level && <p className="text-sm text-destructive mt-1">Level is required</p>}
            </div>

            <FormInput label="Chords" id="chords" register={register} />
            <FormInput label="Audio Files" id="audioFiles" register={register} />
            <FormInput
              label="Created At"
              id="createdAt"
              register={register}
              // required
              error={errors.createdAt ? "Created At is required" : undefined}
            />
            <FormInput label="Ultimate Guitar Link" id="ultimateGuitarLink" register={register} />
            <FormInput label="Short Title" id="shortTitle" register={register} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            {mode === "create" ? "Back to Songs" : "Back to Song"}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : mode === "create" ? "Create Song" : "Update Song"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// Reusable Input Component
type FormInputProps = {
  label: string
  id: keyof Song
  register: any
  required?: boolean
  className?: string
  error?: string
}

const FormInput = ({ label, id, register, required, className, error }: FormInputProps) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...register(id, { required })} />
    {error && <p className="text-sm text-destructive mt-1">{error}</p>}
  </div>
)

