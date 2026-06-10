export function isValidUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "http:" ||
      parsedUrl.protocol === "https:"
    );
  } catch {
    return false;
  }
}

export function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9-]{3,50}$/.test(slug);
}