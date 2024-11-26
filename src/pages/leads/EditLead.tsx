import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

enum ServiceRequiredEnum {
  domain_registration = "domain_registration",
  domain_registration_with_hosting = "domain_registration_with_hosting",
  ecommerce_website = "ecommerce_website",
  portfolio_website = "portfolio_website",
  other = "other",
}

enum LeadStatusEnum {
  cold_lead = "cold_lead",
  hot_lead = "hot_lead",
  unsure = "unsure",
}

const schema = z.object({
  leadName: z.string().min(1, "Lead name is required"),
  company: z.string().min(1, "Company name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  serviceRequired: z.nativeEnum(ServiceRequiredEnum, {
    errorMap: () => ({ message: "Service required is invalid" }),
  }),
  leadStatus: z.nativeEnum(LeadStatusEnum, {
    errorMap: () => ({ message: "Lead status is invalid" }),
  }),
  notes: z.string().optional(),
  date: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const EditLead = () => {
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
      leadName: "",
      company: "",
      phoneNumber: "",
      serviceRequired: ServiceRequiredEnum.other,
      leadStatus: LeadStatusEnum.unsure,
      notes: "",
      date: "",
    },
  });

  useEffect(() => {
    if (location.state?.lead) {
      reset(location.state.lead);
      setLoading(false);
    } else {
      axiosInstance
        .get(`/sales/${id}`)
        .then((res) => {
          reset(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load lead data");
          setLoading(false);
        });
    }
  }, [id, location.state, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => axiosInstance.put(`/sales/${id}`, data),
    onSuccess: () => {
      navigate("/sales");
    },
    onError: () => {
      setError("Failed to update the lead");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Edit Sale" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Lead Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="leadName">Lead Name</label>
          <Controller
            name="leadName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="leadName"
                disabled={mutation.isPending}
                className={errors.leadName ? "border-red-500" : ""}
              />
            )}
          />
          {errors.leadName && (
            <p className="text-red-500">{errors.leadName.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="flex flex-col gap-2">
          <label htmlFor="company">Company</label>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="company"
                disabled={mutation.isPending}
                className={errors.company ? "border-red-500" : ""}
              />
            )}
          />
          {errors.company && (
            <p className="text-red-500">{errors.company.message}</p>
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
                disabled={mutation.isPending}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Service Required */}
        <div className="flex flex-col gap-2">
          <label>Service Required</label>
          <Controller
            name="serviceRequired"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ServiceRequiredEnum).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.serviceRequired && (
            <p className="text-red-500">{errors.serviceRequired.message}</p>
          )}
        </div>

        {/* Lead Status */}
        <div className="flex flex-col gap-2">
          <label>Lead Status</label>
          <Controller
            name="leadStatus"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={mutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LeadStatusEnum).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.leadStatus && (
            <p className="text-red-500">{errors.leadStatus.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="date">Select Date</label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="date"
                type="date"
                disabled={mutation.isPending}
                className={`${errors.date ? "border-red-500" : ""}`}
              />
            )}
          />
          {errors.date && <p className="text-red-500">{errors.date.message}</p>}
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label htmlFor="notes">Notes</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="notes"
                disabled={mutation.isPending}
                rows={4}
                className={`border border-gray-300 rounded-md p-2 ${
                  errors.notes ? "border-red-500" : ""
                }`}
                placeholder="Enter your notes here..."
              />
            )}
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>

        {mutation.error && (
          <div className="text-red-500">
            {(mutation.error as Error).message}
          </div>
        )}
        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditLead;
