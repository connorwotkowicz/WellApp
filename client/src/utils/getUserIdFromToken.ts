export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));  // Decoding JWT token to get payload
    return decoded.userId || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
