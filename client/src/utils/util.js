export function redirectToLogout() {
  window.location = `${window.location.origin}/api/auth/logout`;
}

export function redirectToLogin() {
  const query = new URLSearchParams({ return_url: encodeURI(window.location.href) }).toString();
  window.location = `${window.location.origin}/api/auth/login?${query}`;
}

export function addressToTextBlock(address = {}) {
  const { street1, street2, city, state, zipCode } = address;
  const streetInfo = street2 ? `${street1}\n${street2}` : street1;
  return `${streetInfo}\n${city}, ${state} ${zipCode}`;
}

export function toCapitalizedCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function isEmptyPhoneNumber(phoneNumber) {
  return !phoneNumber || phoneNumber === '+';
}

export function isOwnerRole(roleName) {
  // Should match the Role "name" field, i.e. "app:invotasticb2b:owner"
  return /^app:.*:owner$/.test(roleName);
}
