"use client";

import { useEffect, useState, useRef } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OTPVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (!savedEmail) {
      router.push("/login");
    } else {
      setEmail(savedEmail);
      setIsSuccess(true);
    }

    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(0, 1);
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleResend = async () => {
    if (canResend) {
      try {
        const response = await fetch("http://localhost:4000/forgetPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data?.CreatedpasswordResetOTP) {
          toast.success("OTP sent, check your mailbox");

          setTimer(60);
          setCanResend(false);
        } else {
          toast.error(data?.message || "Error resending OTP");
        }
      } catch (error) {
        console.error("Error during OTP resend:", error);
        toast.error("An error occurred while resending OTP.");
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (!otpCode || otpCode.length < 4)
      return toast.error("Please enter the OTP code correctly");

    if (!/^\d+$/.test(otpCode)) {
      return toast.error("OTP code must contain digits only");
    }

    setLoading(true);
    let obj = {
      email,
      opt: otpCode,
    };
    console.log(obj);

    try {
      const response = await fetch("http://localhost:4000/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      console.log(data);

      if (data?.success) {
        toast.success(data.message);
        localStorage.setItem("resetToken", data?.token);
        router.push("/ResetPassword");
        setLoading(false);
      } else {
        toast.error(data?.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
      toast.error("An error occurred while resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSuccess) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <Image
        src="/Auth illustrations/shape1.png"
        width={250}
        height={420}
        alt="Shape 1"
        className="absolute bottom-0 left-0"
        style={{ width: "auto", height: "auto" }}
      />
      <Image
        src="/Auth illustrations/shape2.png"
        width={250}
        height={420}
        alt="Shape 2"
        className="absolute top-0 right-0"
        style={{ width: "auto", height: "auto" }}
      />
      <div className="z-10 bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <div className="flex items-center w-full justify-start  mb-8">
          <Image
            src="/logo.png"
            width={150}
            height={150}
            alt="logo"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <div className="flex items-center justify-center gap-12">
          <div className="w-full max-w-sm md:text-left text-center">
            <h2 className="text-xl font-semibold mb-2">Verification</h2>
            <p className="text-gray-600 mb-6">
              Veuillez vérifier le code de vérification dans votre boîte de
              réception <span className="underline font-semibold">{email}</span>
            </p>

            <div className="flex items-center justify-center gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12  h-12 border-2 rounded-md text-center text-xl font-semibold focus:border-green-500 focus:outline-none"
                />
              ))}
            </div>

            <div className="mb-6 text-sm flex flex-col items-center">
              <span className="text-gray-600">
                You didn't receive the code?{" "}
              </span>
              <div>
                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`primary-clr ${
                    !canResend && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Resend code
                </button>
                {!canResend && (
                  <span className="text-gray-600 ml-1">
                    in 00:{timer.toString().padStart(2, "0")}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleVerify}
              className="w-full primary-clr-bg font-medium 
              cursor-pointer text-white py-3 rounded-md  transition-colors"
            >
              {loading ? "Vérification en cours..." : "Vérifier le compte"}
            </button>
          </div>
          <div className="hidden md:block flex-1">
            <div className="relative w-full h-80">
              <img
                src="/Auth illustrations/otp.png"
                alt="Verification illustration"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
