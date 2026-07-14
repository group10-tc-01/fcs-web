export const API_CONFIG = {
  bffBaseUrl: isLocalHost()
    ? `${globalThis.location.protocol}//${globalThis.location.hostname}:5004`
    : "https://fcs-bff.flaviojcf.com.br",
} as const;

function isLocalHost(): boolean {
  return (
    globalThis.location.hostname === "localhost" || globalThis.location.hostname === "127.0.0.1"
  );
}
