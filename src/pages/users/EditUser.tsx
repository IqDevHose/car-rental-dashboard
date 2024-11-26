import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  birthDay: z.string().optional(), // Birthday is optional for flexibility
  gender: z.enum(["Male", "Female"]),

  image: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (location.state?.user) {
      const user = location.state.user;
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        birthDay: user.birthDay || "",
        gender: user.gender || "Male",
      });
      setImagePreview(user.image || null);
    }
  }, [location.state, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await axiosInstance.put(`/auth/users/${id}`, data);
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
    // mutation.mutate(data);
    console.log(data);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit User" />
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
          <label htmlFor="birthDay">Birthday</label>
          <Controller
            name="birthDay"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="birthDay"
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
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
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
          {imagePreview && (
            <Avatar className="w-24 h-24">
              <AvatarImage src={imagePreview} alt="Preview" />
              <AvatarFallback>Preview</AvatarFallback>
            </Avatar>
          )}
          <label htmlFor="image">Profile Image</label>
          <Input
            id="image"
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded"
            accept="image/*"
            disabled={mutation.isPending}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => navigate("/users")}>
            Cancel
          </Button>
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
