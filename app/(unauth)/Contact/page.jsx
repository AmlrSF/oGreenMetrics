"use client";

import React from "react";
import { sendForm } from "@emailjs/browser";
import { Navbar, Footer } from "@/components/showcase";

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        e.target,
        process.env.NEXT_PUBLIC_USER_ID
      );
      alert("Message sent successfully!");
      e.target.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section id="contact" className="container ctct">
        <div
          className="row justify-content-center 
       "
        >
          <h2 className="text-center fs-1 fw-bold text-black mb-4">Contact</h2>
          <div className="col-lg-8">
            <div className="card shadow-md rounded-4 border-0">
              <div className="card-body p-3">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label">Email :</label>
                    <input
                      type="email"
                      className="form-control py-2"
                      placeholder="Tapez votre adresse e-mail"
                      required
                      name="email"
                    />
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Nom :</label>
                      <input
                        type="text"
                        className="form-control py-2"
                        placeholder="Tapez votre nom"
                        name="user_name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Prénom :</label>
                      <input
                        type="text"
                        className="form-control py-2"
                        placeholder="Tapez votre prénom"
                        name="user_firstname"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">
                      Quelle est la raison de votre contact aujourd'hui ?
                      <span className="text-danger">*</span>
                    </label>
                    <div className="text-muted small mb-2">
                      Merci de nous donner plus de détails sur votre demande
                    </div>
                    <textarea
                      className="form-control"
                      rows="5"
                      required
                      name="message"
                      placeholder="Tapez votre message"
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-success rounded-pill px-5 py-2"
                    >
                      Soumettez
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
