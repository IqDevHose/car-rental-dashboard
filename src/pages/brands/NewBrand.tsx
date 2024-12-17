import axiosInstance from "@/utils/AxiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the type for the brand
interface Brand {
  name: string;
  description: string;
  image: File | null; // Image field added
}

const AddBrandPage: React.FC = () => {
  // State to store the form input
  const [brand, setBrand] = useState<Brand>({
    name: "",
    description: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for image preview

  // State to handle the form submission status
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrand({
      ...brand,
      [name]: value,
    });
  };

  // Handle image input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBrand({
        ...brand,
        image: file,
      });
      setPreviewImage(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Check if an image is selected
    if (!brand.image) {
      setError("Please upload an image.");
      setLoading(false);
      return;
    }

    try {
      // Create a new FormData object to send both the name and image
      const formData = new FormData();
      formData.append("name", brand.name);
      // formData.append("description", brand.description);
      formData.append("image", brand.image); // Append the image file

      // POST request to add a new brand
      const response = await axiosInstance.post("/cars/brand", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure the content type is multipart
        },
      });

      setSuccess(true);
      setBrand({ name: "", description: "", image: null }); // Reset the form
      setPreviewImage(null);
      navigate("/brand")
    } catch (err) {
      setError("Failed to add brand. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-12 md:mt-0">
      <header className="  p-4">
        <h1 className="text-3xl font-bold">Add New Car Brand</h1>
      </header>

      <main className="p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
              Brand added successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Brand Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={brand.name}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={brand.description}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-700"
            >
              Brand Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              required
              accept="image/*"
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {previewImage && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">Image Preview:</p>
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto rounded-md border"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-black hover:bg-black/75 text-white font-semibold rounded-lg"
            disabled={loading}
          >
            {loading ? "Adding Brand..." : "Add Brand"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddBrandPage;
