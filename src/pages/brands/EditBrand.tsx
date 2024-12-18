import axiosInstance from "@/utils/AxiosInstance";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Brand {
  image: File | null;
  name: string;
}

const EditBrandPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<Brand>({ name: "", image: null });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axiosInstance.get(`/cars/brand/${brandId}`);
        setBrand({ name: response.data.name, image: null });
        setPreviewImage(response.data.image);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch brand");
        setLoading(false);
      }
    };
    fetchBrand();
  }, [brandId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBrand({ ...brand, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", brand.name);
      if (brand.image) formData.append("image", brand.image);
      await axiosInstance.patch(`/cars/brand/${brandId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      // navigate("/brands");
    } catch (err) {
      setError("Failed to update brand. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen mt-12 md:mt-0">
      <header className="p-4">
        <h1 className="text-3xl font-bold">Edit Brand</h1>
      </header>

      <main className="p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
              Brand updated successfully!
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
            {loading ? "Updating Brand..." : "Update Brand"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditBrandPage;
