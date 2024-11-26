import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";

type LoginData = {
  phone: string;
};

export default function LoginPage() {
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: LoginData) => {
      // API call to log in
      const response = await axiosInstance.post("/auth/login", data, {timeout: 10000});
      return response.data;
    },
    onSuccess: (data) => {
      // Save token to localStorage if login is successful
      console.log(data);
      const formattedPhone = phone.startsWith("0") ? phone.substring(1) : phone;
      navigate("/otp", {
        state: { phone: `964${formattedPhone}` },
      });
    },
    onError: () => {
      console.log("Error");
      setError("Invalid email or password.");
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedPhone = phone.startsWith("0") ? phone.substring(1) : phone;
    mutation.mutate({
      phone: `964${formattedPhone}`,
    });
    console.log(formattedPhone);
  };

  // Add these new functions to clear the error
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setError(null); // Clear error when email is changed
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null); // Clear error when password is changed
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-center text-2xl font-bold">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="flex items-center justify-center gap-2 border-black/10 border rounded">
            {/* <label
htmlFor="email"
className="block text-sm font-medium text-gray-700"
>
Phone Number
</label> */}
            <div className="pl-2">+964</div>
            <input
              id="email"
              type="tel"
              value={phone}
              onChange={handleEmailChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none border-none focus:ring-2 focus:ring-indigo-500"
              placeholder="phone number"
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Spinner size="sm" /> : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}