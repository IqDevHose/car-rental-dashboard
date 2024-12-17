import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  CarFront,
  Edit,
  Fuel,
  GalleryHorizontal,
  Milestone,
  Palette,
  Plus,
  Ratio,
  Save,
  SquareLibrary,
  Trash,
  View,
  X,
  Zap,
} from "lucide-react";
import { z } from "zod";
import axiosInstance from "@/utils/AxiosInstance";
import { useMutation } from "@tanstack/react-query";

const carSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  fuel: z.string().min(1, "Fuel type is required"),
  category: z.string().optional(),
  color: z.string().optional(),
  engineDisplacement: z.string().optional(),
  power: z.string().optional(),
  mileage: z.string().optional(),
  seats: z.string().optional(),
  specification: z.string().optional(),
  isAvailable: z.boolean().optional(),
  year: z.string().optional(),
});

type CarSchemaType = z.infer<typeof carSchema>;

const Car = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [editable, setEditable] = useState<boolean | undefined>(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const [images, setImages] = useState<{ link: string }[]>([]);

  const [formState, setFormState] = useState<CarSchemaType>({
    name: "",
    description: "",
    fuel: "",
    category: "",
    color: "",
    engineDisplacement: "",
    power: "",
    mileage: "",
    year: "",
    seats: "",
    specification: "",
    isAvailable: false,
  });

  const {
    data: car,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/cars/${id}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await axiosInstance.patch(`/cars/${id}`, data);
    },
    onSuccess: () => {
      setEditable(false);
      queryClient.invalidateQueries({ queryKey: ["car", id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: any) => {
      return await axiosInstance.delete(`/cars/${id}`);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const toggleMostRentedMutation = useMutation({
    mutationFn: async (id: any) => {
      return await axiosInstance.patch(`/cars/most-rented/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["car"]);
    }
  });

  const handleToggleMostRented = (id: any) => {
    toggleMostRentedMutation.mutate(id);
  };

  useEffect(() => {
    if (car) {
      setFormState({
        name: car.name,
        description: car.description,
        fuel: car.fuel,
        category: car.category,
        color: car.color,
        engineDisplacement: car.engineDisplacement,
        power: car.power,
        year: car.year,
        mileage: car.mileage,
        seats: car.seats,
        specification: car.specification,
        isAvailable: car.isAvailable,
      });
      setIsAvailable(car.isAvailable);
      setImages(car.images);
    }
  }, [car]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file && id) {
      const formData = new FormData();
      formData.append("images", file);
      formData.append("carId", id);
      try {
        const response = await axiosInstance.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newImageUrl = response.data[0]; // Assuming backend returns the uploaded image URL
        setImages((prev) => {
          const updatedImages = [...prev];
          updatedImages[index] = newImageUrl;
          return updatedImages;
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleAddImage = () => {
    setImages((prev) => [...prev, { link: "" }]); // Add a placeholder object with empty link
  };

  const handleImageDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (car) {
      setImages(car.images || []);
    }
  }, [car]);

  const handleInputChange = (field: keyof CarSchemaType, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const onSubmit = () => {
    const updatedData = { ...formState, isAvailable };
    mutation.mutate(updatedData);
  };

  const onDelete = () => {
    deleteMutation.mutate(id);
  };

  const handleSwitchChange = () => {
    setIsAvailable((prev) => !prev);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="details px-4 py-2 mt-12 md:mt-0">
        <div className="header flex justify-between mb-4 items-center border-b pb-2 border-b-gray-300/75">
          <div className="flex items-center justify-center gap-x-4">
            <h1 className="text-xl font-bold">{car?.name}</h1>
            {!editable &&
              (car.isAvailable ? (
                <span className="bg-green-600 text-white font-bold py-1 px-2 rounded-full shadow-lg shadow-green-400">
                  Available
                </span>
              ) : (
                <span className="bg-red-600 text-white font-bold py-1 px-2 rounded-full shadow-lg shadow-red-400">
                  Rented
                </span>
              ))}
            {editable && (
              <div className="flex items-center gap-x-2">
                <p className="font-medium">
                  {isAvailable ? (
                    <span className="bg-green-600 text-white font-bold py-1 px-2 rounded-full shadow-lg shadow-green-400">
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-600 text-white font-bold py-1 px-2 rounded-full shadow-lg shadow-red-400">
                      Rented
                    </span>
                  )}
                </p>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            )}
          </div>
          <div className="flex gap-x-2">
            {/* {editable && (
              <Button
                className="rounded-full"
                variant="outline"
                onClick={() => setEditable(false)}
              >
                <X />
              </Button>
            )}
            {!editable && (
              <Button
                className="rounded-full"
                variant="outline"
                onClick={() => setEditable(true)}
              >
                <Edit />
              </Button>
            )} */}
            {/* {editable && (
              <Button
                className="rounded-full"
                variant="outline"
                onClick={onSubmit}
              >
                <Save />
              </Button>
            )}

            <Button onClick={onDelete} className="bg-red-600 rounded-full">
              <Trash />
            </Button> */}
          </div>
        </div>

        <div>
          <div className="pb-8">
            <p className="font-bold pb-1 border-b border-b-gray-100 mb-2">
              Description
            </p>
            <Input
              type="text"
              value={formState.description}
              placeholder="Description"
              className={!editable ? "border-transparent" : ""}
              disabled={!editable}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />

            <div className="flex gap-x-4 items-center mt-8">
              <h3>Is Most Rented</h3>

              <Switch
                checked={car.isMostRented}
                onCheckedChange={() => handleToggleMostRented(id)}
              />
            </div>

          </div>

          <div>
            <p className="font-bold pb-1 border-b border-b-gray-100 mb-2">
              Car Details
            </p>
            <InfoRow
              editable={editable}
              label1="Fuel"
              value1={formState.fuel}
              Icon1={Fuel}
              onChange1={(e) => handleInputChange("fuel", e.target.value)}
              label2="Category"
              value2={formState.category}
              Icon2={SquareLibrary}
              onChange2={(e) => handleInputChange("category", e.target.value)}
            />
            <InfoRow
              editable={editable}
              label1="Color"
              value1={formState.color}
              Icon1={Palette}
              onChange1={(e) => handleInputChange("color", e.target.value)}
              label2="Engine"
              value2={formState.engineDisplacement}
              Icon2={CarFront}
              onChange2={(e) =>
                handleInputChange("engineDisplacement", e.target.value)
              }
            />
            <InfoRow
              editable={editable}
              label1="Year"
              value1={formState.year}
              Icon1={Zap}
              onChange1={(e) => handleInputChange("year", e.target.value)}
              label2="Specification"
              value2={formState.specification}
              Icon2={Ratio}
              onChange2={(e) =>
                handleInputChange("specification", e.target.value)
              }
            />
            <InfoRow
              editable={editable}
              label1="Seats"
              value1={formState.seats}
              Icon1={GalleryHorizontal}
              onChange1={(e) => handleInputChange("seats", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="imgs flex flex-col mt-4 px-4 py-2">
        <p className="font-bold pb-1 border-b border-b-gray-100 mb-2">
          Car Gallery
        </p>
        <div className="flex gap-x-4 flex-wrap">
          {images.map((img, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div
                  className="relative rounded-md overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(img.link)}
                >
                  <div className="flex opacity-0 hover:opacity-100 transition ease-in-out justify-center items-center absolute top-0 left-0 w-full h-full hover:bg-black/25 bg-transparent">
                    <div className="flex gap-x-2">
                      <Button className="rounded-full" variant={"outline"}>
                        <View />
                      </Button>
                    </div>
                  </div>
                  <img
                    src={img.link}
                    alt="Car"
                    className="rounded-md object-cover h-[150px]"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <img
                  src={selectedImage}
                  alt="Car Large View"
                  className="rounded-lg object-cover w-full h-auto"
                />

                <label className="flex justify-between gap-x-2 mt-4">
                  <label htmlFor={`file-upload-${img.link}`}>
                    <p className="cursor-pointer rounded-full bg-black hover:bg-black/95 py-2 px-4 text-white">
                      Change
                    </p>
                    <input
                      type="file"
                      id={`file-upload-${img.link}`}
                      className="hidden"
                      onChange={(e) => handleImageChange(e, index)}
                      accept="image/*"
                    />
                  </label>

                  {/* Delete button */}
                  <Button
                    onClick={() => handleImageDelete(index)}
                    className="bg-red-600 rounded-full"
                  >
                    <Trash />
                  </Button>
                </label>
              </DialogContent>
            </Dialog>
          ))}

          {/* Add new image button */}
          {editable && (
            <label
              htmlFor="new"
              className="relative rounded-md overflow-hidden cursor-pointer border-dashed border border-gray-500 h-full w-[200px] flex justify-center items-center py-4 bg-gray-50/50 hover:bg-gray-50"
            >
              <div className="flex flex-col justify-center items-center">
                <p className="">Add New</p>
                <input
                  type="file"
                  id="new"
                  className="hidden"
                  accept="image/*"
                />
                <span
                  className="
                        cursor-pointer rounded-full bg-white border-gray-50/50 shadow-md shadow-gray-200/50 mt-2 text-black hover:bg-black/95 py-2 px-4
                            "
                >
                  <Plus />
                </span>
              </div>
            </label>
          )}
        </div>
      </div>
    </>
  );
};

type InfoRowType = {
  label1?: string;
  value1?: string;
  label2?: string;
  value2?: string;
  editable?: boolean;
  Icon1?: React.ElementType;
  Icon2?: React.ElementType;
  onChange1?: (arg: any) => void;
  onChange2?: (arg: any) => void;
};

const InfoRow = ({
  label1,
  onChange1,
  onChange2,
  value1,
  label2,
  value2,
  editable = false,
  Icon1,
  Icon2,
}: InfoRowType) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6`}>
      <label
        htmlFor={label1}
        className="w-full flex items-center justify-between bg-gray-50/50 my-2 p-2 rounded-md"
      >
        <p className="flex items-center gap-x-2 ">
          <span className="p-1 rounded-md">{Icon1 && <Icon1 />}</span>
          {label1}
        </p>

        {label1 !== "Color" && (
          <input
            type="text"
            id={label1}
            onChange={onChange1}
            name={label1}
            placeholder={value1}
            disabled={!editable}
            className={`placeholder:text-black border py-1 rounded-md px-2 outline-none focus:border-black transition ease-in-out ${editable
              ? "placeholder:font-normal border-gray-400"
              : "placeholder:font-bold border-transparent"
              } disabled:bg-transparent text-right bg-transparent`}
          />
        )}

        {label1 === "Color" && (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
              style={{
                backgroundColor: (value1 as string).toLowerCase(),
              }}
            />
          </div>
        )}
      </label>

      {label2 && (
        <label
          htmlFor={label2}
          className="w-full flex items-center justify-between bg-gray-50/50 my-2 p-2 rounded-md"
        >
          <p className="flex items-center gap-x-2">
            <span className="p-1 rounded-md">{Icon2 && <Icon2 />}</span>{" "}
            {label2}
          </p>

          <input
            type="text"
            id={label2}
            onChange={onChange2}
            name={label2}
            placeholder={value2}
            disabled={!editable}
            className={`placeholder:text-black border py-1 rounded-md px-2 outline-none focus:border-black transition ease-in-out ${editable
              ? "placeholder:font-normal border-gray-400"
              : "placeholder:font-bold border-transparent"
              } disabled:bg-transparent text-right bg-transparent`}
          />
        </label>
      )}
    </div>
  );
};

export default Car;
