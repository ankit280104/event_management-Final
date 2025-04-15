import { useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { instructorAtom } from "@/atom/userAtoms";
import { useAtom } from "jotai";

export function ClubForm({ initialData }) {
  const navigate = useNavigate();
  const [instructors] = useAtom(instructorAtom);
  const [selectedInstructors, setSelectedInstructors] = useState(
    initialData?.instructors || []
  );

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      image:
        initialData?.image ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUCcIrUlVL6ByLcv1E3n_6bI34cPZDX1KW9w&s",
      description: initialData?.description || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeSlots",
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/clubs/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      navigate("/admin/clubs");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-8">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
              >
                {form.watch("image") ? (
                  <img
                    src={form.watch("image")}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      Click to upload event image
                    </p>
                  </div>
                )}
                {/* <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                /> */}
              </label>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Preview Image Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter event preview image link"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              {initialData ? "Update Club" : "Create Club"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/club")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
