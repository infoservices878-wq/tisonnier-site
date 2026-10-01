export function versionedImageUrl(url) {
  if (!url || !url.startsWith("/")) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${__ASSET_VERSION__}`;
}
