export const signOutRedirect = () => {
  const clientId = import.meta.env.VITE_AWS_CLIENT_ID
  const logoutUri = "http://localhost:5173";
  const cognitoDomain = "https://eu-west-2g9hrpnzqd.auth.eu-west-2.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};