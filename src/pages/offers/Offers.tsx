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

interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  amount: string;
}

const Offers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axiosInstance.get("/offers");
        setOffers(response.data);
        setLoading(false);
        console.log(offers);
      } catch (error) {
        setError("Failed to load offers");
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleAddOfferClick = () => {
    navigate("/add-offer");
  };

  const handleEditOfferClick = (offerId: string) => {
    navigate(`/edit-offer/${offerId}`);
  };

  const handleDeleteClick = (offerId: string) => {
    setOfferToDelete(offerId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;

    try {
      await axiosInstance.delete(`/offers/${offerToDelete}`);
      setOffers(offers.filter((offer) => offer.id !== offerToDelete));
      setIsDeleteDialogOpen(false);
      setOfferToDelete(null);
    } catch (error) {
      setError("Failed to delete offer");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen mt-12 md:mt-0">
      <header className="p-4">
        <h1 className="text-3xl font-bold">Special Offers</h1>
      </header>
      <main className="p-6">
        <button
          onClick={handleAddOfferClick}
          className="mb-6 py-2 px-4 bg-black hover:bg-black/75 text-white rounded-lg shadow-md focus:outline-none focus:ring-2"
        >
          Add New Offer
        </button>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col"
              >
                {offer.image && (
                  <img
                    className="w-full h-48 object-cover rounded-md mb-4"
                    src={offer.image}
                    alt={offer.title}
                  />
                )}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{offer.title}</h2>
                  <div className="bg-red-100 text-red-600 px-2 py-1 text-nowrap rounded-full text-sm">
                    - {offer.amount}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="mt-auto">
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleEditOfferClick(offer.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(offer.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No offers available.</p>
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
                offer.
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

export default Offers;
