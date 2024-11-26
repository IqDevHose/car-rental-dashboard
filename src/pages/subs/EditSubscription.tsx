import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";

// Enums for select options
export enum StatusEnum {
  EXPIRED = "expired",
  IN_PROGRESS = "in_progress",
}

export enum PaymentMethodEnum {
  QI = "qi_card",
  CASH = "cash",
  ZAIN_CASH = "zain_cash",
  BAGHDAD_BRANCH = "baghdad_branch",
}

// Zod schema for validation
const schema = z.object({
  domainName: z.string().min(1, "Domain Name is required"),
  clientName: z.string().min(1, "Client Name is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  documentsLink: z.string().optional(),
  submissionDate: z.string().min(1, "Submission Date is required"),
  activationDate: z.string().min(1, "Activation Date is required"),
  expiryDate: z.string().min(1, "Expiry Date is required"),
  price: z.string(),
  status: z.nativeEnum(StatusEnum),
  paymentMethod: z.nativeEnum(PaymentMethodEnum),
});

type FormData = z.infer<typeof schema>;

const EditSubscription = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      domainName: "",
      clientName: "",
      phoneNumber: "",
      documentsLink: "",
      submissionDate: "",
      activationDate: "",
      expiryDate: "",
      price: "",
      status: StatusEnum.IN_PROGRESS,
      paymentMethod: PaymentMethodEnum.CASH,
    },
  });

  useEffect(() => {
    if (location.state?.subscription) {
      reset(location.state.subscription);
      setLoading(false);
    } else {
      axiosInstance
        .get(`/subscriptions/${id}`)
        .then((res) => {
          reset(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load subscription data");
          setLoading(false);
        });
    }
  }, [id, location.state, reset]);

  const onSubmit = (data: FormData) => {
    const formattedData = { ...data, price: Number(data.price) };
    axiosInstance
      .put(`/subscriptions/${id}`, formattedData)
      .then(() => {
        navigate("/subscriptions");
      })
      .catch(() => {
        setError("Failed to update subscription");
      });
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <h1 className="text-2xl font-bold">Edit Subscription</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Domain Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="domainName">Domain Name</label>
          <Controller
            name="domainName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="domainName"
                className={errors.domainName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.domainName && (
            <p className="text-red-500">{errors.domainName.message}</p>
          )}
        </div>

        {/* Client Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="clientName">Client Name</label>
          <Controller
            name="clientName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="clientName"
                className={errors.clientName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.clientName && (
            <p className="text-red-500">{errors.clientName.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber">Phone Number</label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="phoneNumber"
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Submission Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="submissionDate">Submission Date</label>
          <Controller
            name="submissionDate"
            control={control}
            render={({ field }) => (
              <Input {...field} type="date" id="submissionDate" />
            )}
          />
          {errors.submissionDate && (
            <p className="text-red-500">{errors.submissionDate.message}</p>
          )}
        </div>

        {/* Activation Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="activationDate">Activation Date</label>
          <Controller
            name="activationDate"
            control={control}
            render={({ field }) => (
              <Input {...field} type="date" id="activationDate" />
            )}
          />
          {errors.activationDate && (
            <p className="text-red-500">{errors.activationDate.message}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="expiryDate">Expiry Date</label>
          <Controller
            name="expiryDate"
            control={control}
            render={({ field }) => (
              <Input {...field} type="date" id="expiryDate" />
            )}
          />
          {errors.expiryDate && (
            <p className="text-red-500">{errors.expiryDate.message}</p>
          )}
        </div>

        {/* Price Sold */}
        <div className="flex flex-col gap-2">
          <label htmlFor="price">Price Sold</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input {...field} id="price" />
            )}
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label>Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} className="p-3 border rounded-md">
                {Object.values(StatusEnum).map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.status && <p className="text-red-500">{errors.status.message}</p>}
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-2">
          <label>Payment Method</label>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <select {...field} className="p-3 border rounded-md">
                {Object.values(PaymentMethodEnum).map((method) => (
                  <option key={method} value={method}>
                    {method.replace("_", " ")}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.paymentMethod && (
            <p className="text-red-500">{errors.paymentMethod.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="default">
          Update
        </Button>
      </form>
    </div>
  );
};

export default EditSubscription;
