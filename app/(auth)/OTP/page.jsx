"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

const OTPVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Function to show alerts
  const showAlert = (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Remove alert after 3 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  };

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
          showAlert("OTP sent, check your mailbox", "success");

          setTimer(60);
          setCanResend(false);
        } else {
          showAlert(data?.message || "Error resending OTP", "danger");
        }
      } catch (error) {
        console.error("Error during OTP resend:", error);
        showAlert("An error occurred while resending OTP.", "danger");
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (!otpCode || otpCode.length < 4) {
      return showAlert("Please enter the OTP code correctly", "danger");
    }

    if (!/^\d+$/.test(otpCode)) {
      return showAlert("OTP code must contain digits only", "danger");
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
        showAlert(data.message, "success");
        localStorage.setItem("resetToken", data?.token);
        router.push("/ResetPassword");
      } else {
        showAlert(data?.message, "danger");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      showAlert("An error occurred while verifying OTP.", "danger");
    } finally {
      setLoading(false);
    }
  };

  if (!isSuccess) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-center bg-light">
      {/* Alerts container */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert alert-${alert.type} alert-dismissible`}
            role="alert"
          >
            {alert.type === "success" ? (
              <IconCheck className="alert-icon" />
            ) : (
              <IconAlertCircle className="alert-icon" />
            )}
            <div>{alert.message}</div>
            <a
              className="btn-close"
              onClick={() =>
                setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
              }
            ></a>
          </div>
        ))}
      </div>

      {/* Background shapes */}
      <div className="position-absolute bottom-0 start-0">
        <Image
          src="/Auth illustrations/shape1.png"
          width={250}
          height={420}
          alt="Shape 1"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
      <div className="position-absolute top-0 end-0">
        <Image
          src="/Auth illustrations/shape2.png"
          width={250}
          height={420}
          alt="Shape 2"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      <div className="container-lg py-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <div className="row align-items-center g-4">
              <div className="col-12 col-md-6">
                <div className="text-center mb-4">
                  <Image
                    src="/logo.png"
                    width={150}
                    height={60}
                    alt="GreenMetric"
                  />
                </div>

                <div className="mb-4">
                  <h1 className="h3 mb-1">Verification</h1>
                  <p className="text-muted small">
                    Veuillez vérifier le code de vérification dans votre boîte
                    de réception{" "}
                    <span className="text-decoration-underline fw-semibold">
                      {email}
                    </span>{" "}
                  </p>
                </div>

                <div className="d-flex justify-content-center justify-content-md-start gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="form-control text-center fw-semibold fs-3"
                      style={{ width: "3rem", height: "3rem" }}
                    />
                  ))}
                </div>

                <div className="mb-4 small d-flex flex-column align-items-center align-items-md-start">
                  <span className="text-muted">
                    You didn't receive the code?{" "}
                  </span>
                  <div>
                    <button
                      onClick={handleResend}
                      disabled={!canResend}
                      className={`btn btn-link p-0 text-primary ${
                        !canResend && "opacity-50 disabled"
                      }`}
                    >
                      Resend code
                    </button>
                    {!canResend && (
                      <span className="text-muted ms-1">
                        in 00:{timer.toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Vérification en cours...
                    </>
                  ) : (
                    "Vérifier le compte"
                  )}
                </button>
              </div>

              <div className="col-12 col-md-6 d-none d-md-block text-center mt-4 mt-md-0">
                <div className="text-center">
                  <img
                    src="/Auth illustrations/otp.png"
                    alt="Verification illustration"
                    className="img-fluid"
                    style={{ maxHeight: "320px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
