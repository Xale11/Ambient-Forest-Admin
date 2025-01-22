export const signOutRedirect = () => {
  const redirectUrl = import.meta.env.PROD ? "https://ambient-forest-admin.vercel.app/hub" : "http://localhost:5173/hub"
  const clientId = import.meta.env.VITE_AWS_CLIENT_ID
  const logoutUri = redirectUrl
  const cognitoDomain = "https://eu-west-2l3nnt1ayr.auth.eu-west-2.amazoncognito.com"
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};