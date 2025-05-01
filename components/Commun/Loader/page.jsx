import React from "react";
import { motion } from "framer-motion";
import { IconLoader } from "@tabler/icons-react";  

const LoaderPage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="position-relative">
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 2, repeat: Infinity, ease: "linear" },
          }}
          className="w-100 h-100 d-flex align-items-center justify-content-center"
        >
          <IconLoader className="text-success" size={80} />  
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.3, 0.6, 0.3],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="position-absolute top-0 start-0 w-100 h-100 bg-success rounded-circle opacity-25 blur"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <h2 className="fs-4 fw-semibold text-dark">Loading your dashboard</h2>
        <p className="mt-2 text-secondary">Please wait while we verify your access</p>
      </motion.div>
    </div>
  );
};

export default LoaderPage;
