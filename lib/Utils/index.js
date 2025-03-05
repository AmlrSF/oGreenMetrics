export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getInitials = (firstName, lastName) => {
  
  if (!firstName || !lastName) {
    return ''; 
  }
  return `${firstName[0]}${lastName.charAt(0)}`.toUpperCase();
};
