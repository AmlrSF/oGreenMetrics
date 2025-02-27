"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const Page = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(0, 1); // Limit to 1 character
    setOtp(updatedOtp);

    // Automatically move to next input field if a digit is entered
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

  const handleResend = () => {
    if (canResend) {
      setTimer(30); // Reset the timer
      setCanResend(false); // Disable the resend button
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    console.log("Verifying OTP:", otpCode);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Image
        src="/Auth illustrations/shape1.png"
        width={250}
        height={420}
        alt="Shape 1"
        className="absolute bottom-0 left-0"
      />
      <Image
        src="/Auth illustrations/shape2.png"
        width={250}
        height={420}
        alt="shape 2"
        className="absolute top-0 right-0"
      />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.png" width={150} height={150} alt="logo" />
        </div>

        <div className="flex items-start justify-between gap-12">
          <div className="w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-2">Verification</h2>
            <p className="text-gray-600 mb-6">
              Veuillez vérifier le code de vérification dans votre boîte de
              réception
            </p>

            <div className="flex gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 border-2 rounded-md text-center text-xl font-semibold focus:border-green-500 focus:outline-none"
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
              className="w-full primary-clr-bg text-white py-3 rounded-md  transition-colors"
            >
              Vérifier le compte
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

export default Page;
