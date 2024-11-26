import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"; // Example component imports, adjust as per actual shadcn components
import axiosInstance from "@/utils/AxiosInstance";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

function Otp() {
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const phone = location.state?.phone;

  // Mutation for verifying OTP
  const mutation = useMutation({
    mutationFn: async (otpCode) => {
      const response = await axiosInstance.post("/auth/verify", {
        code: otpCode,
        phone: phone,
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/");
    },
    onError: (error) => {
      alert("OTP verification failed");
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(otp);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-center text-2xl font-bold">OTP Verification</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* OTP Input Group */}
          <div className="flex justify-center">
            <InputOTP
              onChange={(val) => setOtp(val)}
              maxLength={4}
              className="flex space-x-2"
            >
              <InputOTPGroup className="gap-4">
                <InputOTPSlot
                  index={0}
                  className="w-12 h-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <InputOTPSlot
                  index={1}
                  className="w-12 h-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <InputOTPSlot
                  index={2}
                  className="w-12 h-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <InputOTPSlot
                  index={3}
                  className="w-12 h-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Otp;
