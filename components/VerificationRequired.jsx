import { IconAlertCircle } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function VerificationRequired({ naviagteToLoginPage }) {
  return (
    <div className="page page-center mt-5 bg-white h-[100vh]">
      <div className="container container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card card-lg shadow-sm border"
        >
          <div className="card-body text-center">
            <div className="avatar avatar-lg bg-lime-100 text-lime-600 mb-3">
              <IconAlertCircle className="icon-lg" />
            </div>

            <h1 className="h2">Verification Required</h1>
            <p className="text-muted">
              Your account needs to be verified before you can access the dashboard.
            </p>

            {/* New Message */}
            <p className="text-muted mt-2">
              Your registration has been submitted. We will review it within the next 48 hours.
              You will receive an email with our response. Thank you for your patience.
            </p>

            {/* Return Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => naviagteToLoginPage()}
              className="btn btn-lime w-100 mt-3"
            >
              Return to Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
