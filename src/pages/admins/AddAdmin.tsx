import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  role: z.string().default("admin")
})

type FormData = z.infer<typeof schema>;

const AddAdmin = () => {
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await axiosInstance.post("/users", data);
    },
    onSuccess: () => {
      navigate("/admins");
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-10 flex flex-col gap-5 w-full">
      <PageTitle title="Add Admin" />
      {mutation.error && <div className="text-red-500">{(mutation.error as Error).message}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} id="name" type="text" disabled={mutation.isPending} className={`${errors.name ? 'border-red-500' : ''}`} />
            )}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input {...field} id="phone" type="tel" disabled={mutation.isPending} className={`${errors.phone ? 'border-red-500' : ''}`} />
            )}
          />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>


        <div className="flex justify-between items-center">
          <Button type="submit" variant="default" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner size="sm" /> : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
