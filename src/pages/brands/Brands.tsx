import axiosInstance from "@/utils/AxiosInstance";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Brand {
  image: string | undefined;
  id: number;
  name: string;
  // description: string;
}

const BrandPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get("/cars/brands/all");
        setBrands(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load brands");
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleAddBrandClick = () => {
    navigate("/add-brand");
  };

  const handleEditBrandClick = (brandId: number) => {
    navigate(`/edit-brand/${brandId}`);
  };

  const handleDeleteClick = (brandId: number) => {
    setBrandToDelete(brandId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    try {
      await axiosInstance.delete(`/cars/brand/${brandToDelete}`);
      setBrands(brands.filter((brand) => brand.id !== brandToDelete));
      setIsDeleteDialogOpen(false);
      setBrandToDelete(null);
    } catch (error) {
      setError("Failed to delete brand");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen mt-12 md:mt-0">
      <header className="p-4">
        <h1 className="text-3xl font-bold">Car Brands</h1>
      </header>
      <main className="p-6">
        <button
          onClick={handleAddBrandClick}
          className="mb-6 py-2 px-4 bg-black hover:bg-black/75 text-white rounded-lg shadow-md focus:outline-none focus:ring-2"
        >
          Add New Brand
        </button>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
              >
                {brand.image && (
                  <img
                    className="w-20 h-20 object-contain mb-4"
                    src={brand.image}
                    alt={brand.name}
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{brand.name}</h2>
                {/* <p className="text-gray-600 mb-4">{brand.description}</p> */}
                <div className="mt-auto flex justify-around w-full">
                  <button
                    onClick={() => handleEditBrandClick(brand.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(brand.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No brands available.</p>
          )}
        </section>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                brand.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default BrandPage;
