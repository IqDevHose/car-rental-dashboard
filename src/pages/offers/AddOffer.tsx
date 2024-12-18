import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import { Camera } from "lucide-react";

interface Offer {
  title: string;
  description: string;
  imageFile?: File;
  image: string;
  amount: string;
}

const AddOffer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Offer>({
    title: "",
    description: "",
    image: "",
    amount: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const submitData = new FormData();

      // Append all form fields
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("amount", formData.amount);

      // Append image file if available
      if (formData.imageFile) {
        submitData.append("image", formData.imageFile);
      }

      await axiosInstance.post(`/offers`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/offers");
    } catch (error) {
      setError("Failed to create offer");
    }
  };

  return (
    <div className="min-h-screen mt-12 md:mt-0 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add Offer</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          {/* Image upload area with hover effect */}
          <div
            onClick={handleImageClick}
            className="relative w-full h-64 rounded-lg overflow-hidden cursor-pointer group"
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Offer preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white" />
                  <span className="text-white ml-2">Change Image</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                  <span className="text-gray-500">Upload Image</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Amount
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="e.g., 15%"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Offer
            </button>
            <button
              type="button"
              onClick={() => navigate("/offers")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOffer;
