export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    // Check if backend URL exists
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
    }

    const response = await fetch(`${backendUrl}/sitemap.xml`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Backend Sitemap returned status: ${response.status}`);
      return new Response("<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'></urlset>", {
        headers: { "Content-Type": "application/xml" },
      });
    }

    const sitemap = await response.text();

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Sitemap Error:", error);
    // Return a valid empty sitemap to avoid Search Console hard errors
    return new Response("<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'></urlset>", {
      headers: { "Content-Type": "application/xml" },
    });
  }
}