"use client";
import React, { useState, useEffect } from "react";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [LoadingText, setLoadingText] = useState(false);

  const [formData, setFormData] = useState({
    personal: {
      prenom: "",
      nom: "",
      email: "",
      photo_de_profil: "",
    },
    company: {
      nom_entreprise: "",
      matricule_fiscale: "",
      email: "",
      num_tel: "",
      adresse: "",
      date_fondation: "",
      industrie: "",
    },
    password: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [originalData, setOriginalData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const industries = ["Agriculture", "Automobile", "Banking"];
  const locations = [
    "Tunis",
    "Kairouan",
    "Bizerte",
    "Monastir",
    "Ben Arous",
    "Mahdia",
    "Kébili",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const UserResponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const UserData = await UserResponse.json();

        if (UserData?.user) {
          setUser(UserData.user);
          const personalData = {
            prenom: UserData.user.prenom || "",
            nom: UserData.user.nom || "",
            email: UserData.user.email || "",
            photo_de_profil: UserData.user.photo_de_profil || "",
          };

          setLoading(false);

          setFormData((prev) => ({
            ...prev,
            personal: personalData,
          }));

       
          
          setOriginalData({
            personal: personalData,
            company: "",
            password: {
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            },
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [name]: value },
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      password: { ...prev.password, [name]: value },
    }));
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData.password;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const passwordResponse = await fetch(
        `http://localhost:4000/users/changePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: user._id,
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!passwordResponse.ok) {
        const errorData = await passwordResponse.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      setFormData((prev) => ({
        ...prev,
        password: { currentPassword: "", newPassword: "", confirmPassword: "" },
      }));
      setShowPasswordModal(false);
      alert("Password updated successfully!");
    } catch (error) {
      alert(`Error updating password: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingText(true);
    try {
      const personalResponse = await fetch(
        `http://localhost:4000/users/${user?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData.personal),
        }
      );

     
      const updatedUserData = await personalResponse.json();
      setUser(updatedUserData.data);
      setLoadingText(false)
      setOriginalData({
        ...formData,
        password: { currentPassword: "", newPassword: "", confirmPassword: "" },
      });

      
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          personal: { ...prev.personal, photo_de_profil: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  if (loading) {
    return (
      <div
        className="container-xl py-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl py-4">
      <form onSubmit={handleSubmit}>
        <div className="card ">
          <div className="card-body">
            <h1 className=" text-center mb-4">Personal Information</h1>
            <div className="row align-items-center mb-4">
              <div className="col-auto">
                {formData.personal.photo_de_profil ? (
                  <img
                    src={formData.personal.photo_de_profil}
                    alt="Profile"
                    className="avatar avatar-xl rounded-circle"
                  />
                ) : (
                  <span className="avatar avatar-xl rounded-circle bg-blue-lt">
                    {formData.personal.prenom?.charAt(0) || ""}
                    {formData.personal.nom?.charAt(0) || ""}
                  </span>
                )}
              </div>
              <div className="col">
                <div className="btn-list">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleUploadClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-camera"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
                      <path d="M12 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                    </svg>
                    Change avatar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, photo_de_profil: "" },
                      }));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-trash"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M4 7l16 0"></path>
                      <path d="M10 11l0 6"></path>
                      <path d="M14 11l0 6"></path>
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                    </svg>
                    Delete avatar
                  </button>
                </div>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  name="nom"
                  value={formData.personal.nom}
                  onChange={handlePersonalChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prénom</label>
                <input
                  type="text"
                  className="form-control"
                  name="prenom"
                  value={formData.personal.prenom}
                  onChange={handlePersonalChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <div className="row g-2">
                <div className="col-md-8">
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                        <path d="M3 7l9 6l9 -6"></path>
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.personal.email}
                      onChange={handlePersonalChange}
                      required
                    />
                  </div>
                  <small className="form-hint text-muted">
                    This contact will be shown to others publicly, so choose it
                    carefully.
                  </small>
                </div>
              </div>
            </div>

            {/* Password Reset Button */}
            <div className="mb-4 d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-danger mt-2"
                onClick={() => setShowPasswordModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-key"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l6.558 -6.558l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z"></path>
                  <path d="M15 9h.01"></path>
                </svg>
                Reset Password
              </button>
              <button type="submit" className="btn btn-primary mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                  <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                  <path d="M16 5l3 3" />
                </svg>{" "}
                {LoadingText ? "Saving..." : "Save Info"} 
              </button>
            </div>
             
          </div>
        </div>
      </form>

      {/* Password Reset Modal */}
      <div
        className={`modal fade ${showPasswordModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{
          backgroundColor: showPasswordModal
            ? "rgba(0,0,0,0.5)"
            : "transparent",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reset Password</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowPasswordModal(false);
                  setFormData((prev) => ({
                    ...prev,
                    password: {
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    },
                  }));
                }}
              ></button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    value={formData.password.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={formData.password.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.password.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  {formData.password.newPassword !==
                    formData.password.confirmPassword &&
                    formData.password.confirmPassword && (
                      <div className="text-danger mt-1">
                        Passwords do not match
                      </div>
                    )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setFormData((prev) => ({
                      ...prev,
                      password: {
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      },
                    }));
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
