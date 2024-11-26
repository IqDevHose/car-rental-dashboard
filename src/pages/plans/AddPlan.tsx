import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

const planSchema = z.object({
  title: z.object({
    en: z.string().min(2, "Name in English must be at least 2 characters"),
    ar: z.string().min(2, "Name in Arabic must be at least 2 characters"),
  }),
  description: z.object({
    en: z.string().min(10, "Description in English must be at least 10 characters"),
    ar: z.string().min(10, "Description in Arabic must be at least 10 characters"),
  }),
  isActive: z.boolean(),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "Price must be a valid number"),
    advantages: z
    .array(
      z.object({
        name: z.object({
          en: z.string().min(1, "Advantage in English is required"),
          ar: z.string().min(1, "Advantage in Arabic is required"),
        }),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof planSchema>;

const AddPlan: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [advantages, setAdvantages] = useState<{ name: { en: string; ar: string } }[]>([]);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      price: 0,
      isActive: false
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => axiosInstance.post(`/products`, data),
    onError: () => setError("Failed to add Plan"),
    onSuccess: () => {
      navigate("/products");
      reset();
      setAdvantages([]); // Clear advantages
    },
  });

  const onSubmit = (data: FormData) => {
    setError(null);

    // Ensure title and description are not empty
    if (!data.title.en || !data.title.ar || !data.description.en || !data.description.ar) {
      setError("Please fill in both English and Arabic title and description fields.");
      return;
    }
  
    // Filter out advantages with empty `en` or `ar` values
    const filteredAdvantages = advantages.filter(
      (advantage) => advantage.name.en.trim() && advantage.name.ar.trim()
    );
  
    if (filteredAdvantages.length < advantages.length) {
      setError("Please fill in all advantage fields.");
      return;
    }
  
    // Log the advantages data for debugging
    console.log("Formatted Advantages: ", filteredAdvantages);
  
    const formattedData = { ...data, price: Number(data.price), advantages: filteredAdvantages };

    mutation.mutate({
      title: formattedData.title,
      description: formattedData.description,
      price: formattedData.price,
      isActive: formattedData.isActive,
    });
  };

  const addAdvantage = () => {
    setAdvantages([...advantages, { name: { en: "", ar: "" } }]);
  };

  const handleAdvantageChange = (index: number, language: "en" | "ar", value: string) => {
    const updatedAdvantages = [...advantages];
    updatedAdvantages[index].name[language] = value;
    setAdvantages(updatedAdvantages);
  };

  const deleteAdvantage = (index: number) => {
    const updatedAdvantages = advantages.filter((_, i) => i !== index);
    setAdvantages(updatedAdvantages);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Add Product" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* English Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nameEn">Product Name (English)</label>
          <Controller
            name="title.en"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`border rounded p-2 ${errors.title?.en ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.title?.en && <p className="text-red-500">{errors.title.en.message}</p>}
        </div>

        {/* Arabic Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nameAr">Product Name (Arabic)</label>
          <Controller
            name="title.ar"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`border rounded p-2 ${errors.title?.ar ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.title?.ar && <p className="text-red-500">{errors.title.ar.message}</p>}
        </div>

        {/* English Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="descriptionEn">Description (English)</label>
          <Controller
            name="description.en"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={`border rounded p-2 ${errors.description?.en ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.description?.en && <p className="text-red-500">{errors.description.en.message}</p>}
        </div>

        {/* Arabic Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="descriptionAr">Description (Arabic)</label>
          <Controller
            name="description.ar"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className={`border rounded p-2 ${errors.description?.ar ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.description?.ar && <p className="text-red-500">{errors.description.ar.message}</p>}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label htmlFor="price">Price</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                className={`border rounded p-2 ${errors.price ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        {/* IsActive Checkbox */}
        <div className="flex items-center gap-2 py-2 px-2 bg-blue-50">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="checkbox"
                id="isActive"
                className="w-4 h-4"
              />
            )}
          />
          <label htmlFor="isActive" className="">Activate after creation</label>
        </div>

        {/* Advantages Section */}
        <div className="flex flex-col gap-2">
          <label>Advantages</label>
          {advantages.map((advantage, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Advantage (English)"
                value={advantage.name.en}
                onChange={(e) => handleAdvantageChange(index, "en", e.target.value)}
                className="border rounded p-2 w-full"
              />
              <input
                type="text"
                placeholder="Advantage (Arabic)"
                value={advantage.name.ar}
                onChange={(e) => handleAdvantageChange(index, "ar", e.target.value)}
                className="border rounded p-2 w-full"
              />
              <Button variant="outline" onClick={() => deleteAdvantage(index)} type="button">
                Delete
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addAdvantage} type="button">
            + Add Another Advantage
          </Button>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Submit Button */}
        <div className="flex justify-start gap-2">
          <Button type="submit" className="flex items-center gap-1" variant="default" disabled={mutation.isPending}>
            <PlusIcon className="w-4 h-4" />
            {mutation.isPending ? <Spinner size="sm" /> : "Add Product"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AddPlan;
