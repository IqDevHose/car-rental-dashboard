import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/AxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UploadResponse = string[];

const COLOR_PALETTE = [
  "#FF6B6B", // Coral Red
  "#E74C3C", // Vibrant Red
  "#ffffff", // Turquoise
  "#000000", // Sky Blue
  "#F39C12", // Orange
  "#FF8ED4", // Pink
  "#2ECC71", // Emerald Green
  "#3498DB", // Bright Blue
  "#9B59B6", // Lavender
];

enum CarFuelType {
  gasoline = "Gasoline",
  diesel = "Diesel",
  electric_ = "Electric Batteries",
  hybrid = "Hybrid",
}

enum CategoryType {
  sedan = "Sedan",
  wagon = "Wagon",
  hatchback = "Hatchback",
  sport = "Sport",
  suv = "SUV",
  convertibles = "Convertibles",
  coupes = "Coupes",
  pickup_truck = "Pickup Truck",
  crossovers = "Crossovers",
}

enum SeatsType {
  two = 2,
  four = 4,
  five = 5,
  seven = 7,
}

enum SpecificationType {
  economy = "Economy",
  luxury = "Luxury",
  sports = "Sports",
}

type CreateCarDto = {
  name: string;
  category: string;
  fuel: string;
  mileage?: number;
  specification: string;
  color: string;
  year?: string;
  power?: number;
  engineDisplacement: number;
  price: number;
  seats: number;
  description: string;
  images: string[];
};

const CreateCar = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [fuel, setFuel] = useState("");
  const [mileage, setMileage] = useState("");
  const [specification, setSpecification] = useState("");
  const [color, setColor] = useState("");
  const [year, setYear] = useState("");
  const [power, setPower] = useState("");
  const [engineDisplacement, setEngineDisplacement] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const navigate = useNavigate();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      const response = await axiosInstance.post<UploadResponse>(
        "/upload/minio-many",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });

  const createCarMutation = useMutation({
    mutationFn: async (data: CreateCarDto) => {
      await axiosInstance.post("/cars", data);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 6) {
      alert("You can only upload up to 6 images");
      return;
    }

    setSelectedImages(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const uploadedImages = await uploadMutation.mutateAsync(selectedImages);

      await createCarMutation.mutateAsync({
        name,
        category,
        fuel,
        mileage: Number(mileage),
        specification,
        color,
        power: Number(power),
        engineDisplacement: Number(engineDisplacement),
        price: Number(price),
        seats: Number(seats),
        description,
        year,
        images: uploadedImages,
      });
    } catch (error) {
      console.error("Error creating car:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12 md:mt-0">
      <h1 className="text-2xl font-bold mb-6">Create New Car</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            type="text"
            placeholder="Car name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>

          <Select value={year} onValueChange={(value) => setYear(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: 35 },
                (_, i) => new Date().getFullYear() - i
              ).map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>

          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CategoryType).map((value) => (
                <SelectItem key={value} value={value}>
                  {value.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fuel Type</label>

          <Select value={fuel} onValueChange={(value) => setFuel(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Fuel" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CarFuelType).map((value) => (
                <SelectItem key={value} value={value}>
                  {value.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Color
          </label>

          {/* Color Palette */}
          <div className="flex flex-wrap gap-2 mb-3">
            {COLOR_PALETTE.map((paletteColor) => (
              <button
                type="button"
                key={paletteColor}
                onClick={() => setColor(paletteColor)}
                className="w-8 h-8 border rounded-md shadow-sm hover:scale-110 transition-all 
            focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                style={{
                  backgroundColor: paletteColor,
                  transform: color === paletteColor ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {/* Color Inputs */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 w-16 h-10 opacity-0 cursor-pointer peer"
              />
              <div
                className="w-16 h-10 rounded-md border border-gray-300 shadow-sm 
            peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:border-blue-500"
                style={{ backgroundColor: color }}
              />
            </div>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Color code or name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          text-sm transition-all duration-200 ease-in-out"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Engine (cc)</label>
          <Input
            type="number"
            placeholder="Engine displacement"
            value={engineDisplacement}
            onChange={(e) => setEngineDisplacement(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input
            type="number"
            placeholder="Price per day"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Seats</label>

          <Select value={seats} onValueChange={(value) => setSeats(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Seats" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SeatsType)
                .filter((value) => typeof value === "number")
                .map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Specification</label>

          <Select
            value={specification}
            onValueChange={(value) => setSpecification(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Specification" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SpecificationType).map((value) => (
                <SelectItem key={value} value={value}>
                  {value.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Car Images & Videos (Up to 10)
          </label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-video">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
            placeholder="Detailed description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={uploadMutation.isPending || createCarMutation.isPending}
        >
          {uploadMutation.isPending || createCarMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Car"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateCar;
