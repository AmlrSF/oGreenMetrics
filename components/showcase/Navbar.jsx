"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconMenu2, IconUser, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "Accueil" },
    { href: "/Services", label: "Services" },
    { href: "/About", label: "À propos" },
    { href: "/Contact", label: "Contact" },
    { href: "/Testimonials", label: "Testimonials" },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="position-relative bg-white
     shadow
     ">
      <nav className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link href="/" className="position-relative z-index-5">
            <Image
              src="/logo.png"
              alt="Green Metric"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="d-none d-md-flex">
            <ul className="list-unstyled m-0 d-flex align-items-center gap-5">
              {menuItems.map((item) => (
                <li key={item.href}  className="navlinks nav-item position-relative">
                  <Link
                    href={item.href}
                    className="nav-link text-muted hover-primary fw-medium"
                  >
                    {item.label} 
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-md-flex align-items-center justify-content-center gap-2">
            <IconUser width={35} height={35} />
            <div className="d-flex flex-column align-items-start">
                <p className="m-0 small fw-medium">Bonjour</p>
                <p className="m-0 small">Contactez-vous</p>
              </div>
            </div>
            <Link
              href="/login"
              className="d-none d-md-flex btn btn-primary fw-bold"
              style={{ borderColor: "#8EBE21" }}
            >
              Commencez
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="d-md-none position-relative z-index-5 btn btn-link p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
           {isOpen ? (
  <IconX className="icon text-white" size={24} />
) : (
  <IconMenu2 className="icon text-muted" size={24} />
)}

          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="position-fixed top-0 end-0 bottom-0 start-0 z-index-4 d-md-none"
            style={{ backgroundColor: "#8EBE21" }}
          >
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <ul className="list-unstyled text-center">
                {menuItems.map((item) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4"
                  >
                    <Link
                      href={item.href}
                      className="text-white fs-1 fw-medium text-decoration-none"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="/login"
                    className="btn btn-light rounded-3 px-4 py-2 fs-5 fw-medium"
                    style={{ color: "#8EBE21" }}
                    onClick={() => setIsOpen(false)}
                  >
                    Commencez
                  </Link>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;