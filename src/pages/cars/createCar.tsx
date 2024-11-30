import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/AxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"

type UploadResponse =string[];

type CreateCarDto = {
    name: string;
    category: string;
    fuel: string;
    mileage: number;
    specification: string;
    color: string;
    power: number;
    engineDisplacement: number;
    price: number;
    seats: number;
    description: string;
    images: string[];
}

const CreateCar = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [fuel, setFuel] = useState("");
    const [mileage, setMileage] = useState("");
    const [specification, setSpecification] = useState("");
    const [color, setColor] = useState("");
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
                formData.append('images', file);
            });
            const response = await axiosInstance.post<UploadResponse>("/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
    });

    const createCarMutation = useMutation({
        mutationFn: async (data: CreateCarDto) => {
            await axiosInstance.post("/cars", data);
        },
        onSuccess: () => {
            navigate("/");
        }
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
                images: uploadedImages,
            });
        } catch (error) {
            console.error("Error creating car:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
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
                    <label className="text-sm font-medium">Category</label>
                    <Input
                        type="text"
                        placeholder="e.g., SUV, Sedan"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fuel Type</label>
                    <Input
                        type="text"
                        placeholder="e.g., Petrol, Diesel"
                        value={fuel}
                        onChange={(e) => setFuel(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Mileage</label>
                    <Input
                        type="number"
                        placeholder="Mileage in km/l"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-16 h-10 p-1"
                        />
                        <Input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="Color code or name"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Power (HP)</label>
                    <Input
                        type="number"
                        placeholder="Engine power"
                        value={power}
                        onChange={(e) => setPower(e.target.value)}
                    />
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
                    <Input
                        type="number"
                        placeholder="Number of seats"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Specification</label>
                    <Input
                        type="text"
                        placeholder="Car specifications"
                        value={specification}
                        onChange={(e) => setSpecification(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Car Images (Up to 6)</label>
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
                    {(uploadMutation.isPending || createCarMutation.isPending) ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Car'
                    )}
                </Button>
            </form>
        </div>
    );
};

export default CreateCar;