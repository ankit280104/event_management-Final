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

export function EventForm({ initialData, clubId }) {
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
      availableSeats: initialData?.availableSeats || "",
      price: initialData?.price || "",
      instructors: initialData?.instructors || [],
      date: initialData?.date || "",
      timeSlots: initialData?.timeSlots || [{ startTime: "", endTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeSlots",
  });

  const handleInstructorSelect = (instructorId) => {
    const instructor = instructors.find((i) => i._id === instructorId);
    if (instructor) {
      const isSelected = selectedInstructors.some(
        (i) => i._id === instructorId
      );
      if (isSelected) {
        setSelectedInstructors(
          selectedInstructors.filter((i) => i._id !== instructorId)
        );
      } else {
        setSelectedInstructors([...selectedInstructors, instructor]);
      }
    }
    // Update the form value
    form.setValue("instructors", selectedInstructors);
  };
  // const handleImageChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/events/${clubId}`,
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

      navigate(`/admin/events/${clubId}`);
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

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Seats</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of seats"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructors"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel>Instructors</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedInstructors.map((instructor) => (
                      <div
                        key={instructor._id}
                        className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                      >
                        <span>{instructor.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => handleInstructorSelect(instructor._id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Select onValueChange={handleInstructorSelect}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select instructors" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem
                          key={instructor._id}
                          value={instructor._id}
                          disabled={selectedInstructors.some(
                            (i) => i._id === instructor._id
                          )}
                        >
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <FormLabel>Time Slots</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ startTime: "", endTime: "" })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Time Slot
                </Button>
              </div>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`timeSlots.${index}.startTime`}
                      render={({ field }) => (
                        <FormControl>
                          <Input type="time" {...field} className="flex-1" />
                        </FormControl>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`timeSlots.${index}.endTime`}
                      render={({ field }) => (
                        <FormControl>
                          <Input type="time" {...field} className="flex-1" />
                        </FormControl>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              {initialData ? "Update Event" : "Create Event"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/events")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
