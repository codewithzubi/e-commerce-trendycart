export function normalizeProductImages(images: unknown): string[] {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images.filter((image): image is string => typeof image === "string" && image.length > 0);
  }

  if (typeof images === "string") {
    const trimmed = images.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return [trimmed];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((image): image is string => typeof image === "string" && image.length > 0);
      }
    } catch {
      return [];
    }
  }

  return [];
}

export function getPrimaryProductImage(images: unknown, fallback = "/placeholder-product.jpg") {
  return normalizeProductImages(images)[0] || fallback;
}
