// app/api/proxy-profile-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

interface CacheEntry {
  data: Buffer;
  contentType: string;
}

// LRU cache configuration
const imageCache = new LRUCache<string, CacheEntry>({
  max: 100, // Maximum number of images to cache
  ttl: 1000 * 60 * 60 * 24, // 24 hours TTL
  maxSize: 50 * 1024 * 1024, // 50MB total cache size
  sizeCalculation: (value) => value.data.length, // Size based on buffer length
  updateAgeOnGet: true, // Reset TTL when accessed
  updateAgeOnHas: false, // Don't reset TTL on has() calls
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing 'url' parameter" },
        { status: 400 }
      );
    }

    // Validate that it's a Google profile image URL for security
    /**if (
      !imageUrl.includes("googleusercontent.com") &&
      !imageUrl.includes("googleapis.com")
    ) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }**/

    // Check cache first
    const cached = imageCache.get(imageUrl);
    if (cached) {
      return new NextResponse(new Uint8Array(cached.data), {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400", // 24 hours
          "X-Cache": "HIT",
          "X-Cache-Size": imageCache.size.toString(),
        },
      });
    }

    // Fetch from Google
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ProfileImageProxy/1.0)",
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        // If we hit rate limit, check if we have a stale entry
        const staleEntry = imageCache.get(imageUrl, { allowStale: true });
        if (staleEntry) {
          return new NextResponse(new Uint8Array(staleEntry.data), {
            status: 200,
            headers: {
              "Content-Type": staleEntry.contentType,
              "Cache-Control": "public, max-age=3600", // Shorter cache for stale data
              "X-Cache": "STALE",
            },
          });
        }

        return NextResponse.json(
          { error: "Rate limited by Google, please try again later" },
          { status: 429 }
        );
      }

      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Validate image size (optional - prevent extremely large images)
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    if (imageBuffer.length > maxImageSize) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    // Cache the image
    imageCache.set(imageUrl, {
      data: imageBuffer,
      contentType,
    });

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400", // 24 hours
        "X-Cache": "MISS",
        "X-Cache-Size": imageCache.size.toString(),
      },
    });
  } catch (error) {
    console.error("Error proxying profile image:", error);

    return NextResponse.json(
      { error: "Failed to fetch profile image" },
      { status: 500 }
    );
  }
}

// Optional: Add cache stats endpoint for debugging
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    return NextResponse.json({
      size: imageCache.size,
      maxSize: imageCache.max,
      calculatedSize: imageCache.calculatedSize,
      ttl: imageCache.ttl,
    });
  }

  if (action === "clear") {
    imageCache.clear();
    return NextResponse.json({ message: "Cache cleared" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
