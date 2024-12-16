import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]),
  birthDay: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Invalid date format. Please use YYYY-MM-DD."
    ),
  image: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const AddUser = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "MALE", // default gender
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await axiosInstance.post("/users", data);
    },
    onSuccess: () => {
      navigate("/users");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Add User" />
      {mutation.error && (
        <div className="text-red-500">{(mutation.error as Error).message}</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                type="text"
                disabled={mutation.isPending}
                className={`${errors.name ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                type="email"
                disabled={mutation.isPending}
                className={`${errors.email ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phone">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="phone"
                type="tel"
                disabled={mutation.isPending}
                className={`${errors.phone ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Birthday Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="birthday">Birthday</label>
          <Controller
            name="birthDay"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="birthday"
                type="date"
                disabled={mutation.isPending}
                className={`${errors.birthDay ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.birthDay && (
            <p className="text-red-500">{errors.birthDay.message}</p>
          )}
        </div>

        {/* Gender Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="gender">Gender</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-red-500">{errors.gender.message}</p>
          )}
        </div>

        {/* Profile Image Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="image">Profile Image</label>
          <Input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded"
            accept="image/*"
            disabled={mutation.isPending}
          />
          {imagePreview && (
            <Avatar className="w-24 h-24">
              <AvatarImage src={imagePreview} alt="Preview" />
              <AvatarFallback>Preview</AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Add User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
