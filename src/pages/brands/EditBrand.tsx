import axiosInstance from "@/utils/AxiosInstance";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams for dynamic routing

interface Brand {
  image: string | undefined;
  name: string;
  description: string;
}

const EditBrandPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>(); // Get the brandId from URL params
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        //   const response = await axiosInstance.get(`/cars/brand/${brandId}`);
          console.log(brandId);
          setBrand(data);
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
    if (brand) {
      setBrand({
        ...brand,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;

    try {
      await axiosInstance.put(`/cars/brand/${brandId}`, brand); // PUT request to update the brand
      navigate("/brands"); // Redirect to the brands page after successful update
    } catch (error) {
      setError("Failed to update brand");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">Edit Brand</h1>
      </header>

      <main className="p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
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
              value={brand?.name || ""}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
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
              value={brand?.description || ""}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg"
          >
            Update Brand
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditBrandPage;
