import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define your enums
export enum StatusEnum {
  EXPIRED="expired",
  IN_PROGRESS="in_progress"
}

export enum PaymentMethodEnum {
  QI = 'qi_card',
  CASH = 'cash',
  ZAIN_CASH = 'zain_cash',
  BAGHDAD_BRANCH = 'baghdad_branch',
}

// Define your form data schema with zod
const schema = z.object({
  domainName: z.string().min(1, "Domain Name is required"),
  clientName: z.string().min(1, "Client Name is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  documentsLink: z.string(),
  submissionDate: z.string().min(1, "Submission Date is required"),
  activationDate: z.string().min(1, "Activation Date is required"),
  expiryDate: z.string().min(1, "Expiry Date is required"),
  price: z.string().min(1, "Price Sold is required"),
  status: z.string().min(1, "Status is required"),
  paymentMethod: z.string().min(1, "Payment Method is required"),
});

// Define form data type
type FormData = {
  domainName: string;
  clientName: string;
  phoneNumber: string;
  documentsLink: string;
  submissionDate: string;
  activationDate: string;
  expiryDate: string;
  price: string;
  status: string;
  paymentMethod: string;
};

export default function SubscriptionForm() {
  const navigate = useNavigate();

  // Initialize the form with react-hook-form and zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Mutation to create subscription
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      return await axiosInstance.post("/subscriptions", formData);
    },
    onSuccess: () => {
      navigate("/subscriptions");
    },
    onError: (error) => {
      console.error("Error during form submission:", error);
    },
  });

  // Form submit handler
  const onSubmit = (data: any) => {
    const formattedData = { ...data, price: Number(data.price) };
    console.log(formattedData)
    mutation.mutate(formattedData);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Add Subscription</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        
        {/* Domain Name */}
        <div className="form-group">
          <label htmlFor="domainName" className="block font-medium mb-2">Domain Name</label>
          <Controller
            name="domainName"
            control={control}
            render={({ field }) => <Input {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />}
          />
          {errors.domainName && (
            <p className="text-red-500 text-sm mt-1">{errors.domainName.message}</p>
          )}
        </div>

        {/* Client Name */}
        <div className="form-group">
          <label htmlFor="clientName" className="block font-medium mb-2">Client Name</label>
          <Controller
            name="clientName"
            control={control}
            render={({ field }) => <Input {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />}
          />
          {errors.clientName && (
            <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="phoneNumber" className="block font-medium mb-2">Phone Number</label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => <Input {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Document Link */}
        <div className="form-group">
          <label htmlFor="documentsLink" className="block font-medium mb-2">Document Link</label>
          <Controller
            name="documentsLink"
            control={control}
            render={({ field }) => <Input {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />}
          />
          {errors.documentsLink && (
            <p className="text-red-500 text-sm mt-1">{errors.documentsLink.message}</p>
          )}
        </div>

        {/* Submission Date */}
        <div className="form-group">
          <label htmlFor="submissionDate" className="block font-medium mb-2">Submission Date</label>
          <Controller
            name="submissionDate"
            control={control}
            render={({ field }) => <Input type="date" {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />}
          />
          {errors.submissionDate && (
            <p className="text-red-500 text-sm mt-1">{errors.submissionDate.message}</p>
          )}
        </div>

        {/* Activation Date */}
        <div className="form-group">
          <label htmlFor="activationDate" className="block font-medium mb-2">Activation Date</label>
          <Controller
            name="activationDate"
            control={control}
            render={({ field }) => <Input type="date" {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />}
          />
          {errors.activationDate && (
            <p className="text-red-500 text-sm mt-1">{errors.activationDate.message}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="form-group">
          <label htmlFor="expiryDate" className="block font-medium mb-2">Expiry Date</label>
          <Controller
            name="expiryDate"
            control={control}
            render={({ field }) => <Input type="date" {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
          )}
        </div>

        {/* Price Sold */}
        <div className="form-group">
          <label htmlFor="price" className="block font-medium mb-2">Price Sold</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => <Input {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status" className="block font-medium mb-2">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                {Object.values(StatusEnum).map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label htmlFor="paymentMethod" className="block font-medium mb-2">Payment Method</label>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                {Object.values(PaymentMethodEnum).map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Submit
        </Button>
      </form>
    </>
  );
}
