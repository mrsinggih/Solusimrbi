import { PsychologyArticle } from "../types";

/**
 * Simulated Supabase Storage upload.
 * Uploads a file (or returns a high-quality preset URL) to the 'covers' or 'avatars' bucket.
 */
export async function uploadToSupabaseStorage(
  file: File,
  bucket: "covers" | "avatars" = "covers",
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Return a realistic Unsplash image based on name, or a local ObjectURL
        let resolvedUrl = "";
        const nameLower = file.name.toLowerCase();
        
        if (nameLower.includes("wedding") || nameLower.includes("nikah")) {
          resolvedUrl = "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5c?auto=format&fit=crop&q=80&w=800";
        } else if (nameLower.includes("couple") || nameLower.includes("pasangan") || nameLower.includes("cinta")) {
          resolvedUrl = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800";
        } else if (nameLower.includes("self") || nameLower.includes("batin") || nameLower.includes("tenang")) {
          resolvedUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800";
        } else {
          // Fallback to local Object URL for actual custom images so the preview is 100% real
          try {
            resolvedUrl = URL.createObjectURL(file);
          } catch (e) {
            resolvedUrl = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800";
          }
        }
        
        if (onProgress) onProgress(100);
        resolve(resolvedUrl);
      } else {
        if (onProgress) onProgress(progress);
      }
    }, 120);
  });
}

/**
 * Simulated Server Action: Create Article
 */
export async function createArticleServerAction(
  articleData: Omit<PsychologyArticle, "id">,
  onStateUpdate: (article: Omit<PsychologyArticle, "id">) => void
): Promise<{ success: boolean; message: string; data?: any }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Perform validation
  if (!articleData.title.trim()) {
    return { success: false, message: "Server Action Validation Error: Judul artikel tidak boleh kosong." };
  }
  if (!articleData.content.trim()) {
    return { success: false, message: "Server Action Validation Error: Konten artikel tidak boleh kosong." };
  }

  // Calculate read time
  const wordCount = articleData.content.split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));
  const readTime = `${readTimeMin} Menit`;

  // Autogenerate slug if missing
  const slug = articleData.slug || articleData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const enrichedData = {
    ...articleData,
    readTime,
    slug,
    publishedAt: articleData.status === "published" ? new Date().toISOString().split("T")[0] : "",
  };

  try {
    // Commit to state
    onStateUpdate(enrichedData);
    return {
      success: true,
      message: `Server Action Success: Artikel '${enrichedData.title}' berhasil dibuat di database.`,
      data: enrichedData,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Server Action Database Error: ${err?.message || "Gagal menyimpan data."}`,
    };
  }
}

/**
 * Simulated Server Action: Update Article
 */
export async function updateArticleServerAction(
  id: string,
  articleData: Partial<PsychologyArticle>,
  onStateUpdate: (id: string, fields: Partial<PsychologyArticle>) => void
): Promise<{ success: boolean; message: string; data?: any }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // If content is updated, recalculate readTime
  let readTime = articleData.readTime;
  if (articleData.content) {
    const wordCount = articleData.content.split(/\s+/).length;
    const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));
    readTime = `${readTimeMin} Menit`;
  }

  let slug = articleData.slug;
  if (articleData.title && !slug) {
    slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  const enrichedData: Partial<PsychologyArticle> = {
    ...articleData,
    ...(readTime ? { readTime } : {}),
    ...(slug ? { slug } : {}),
  };

  // If status is published and we don't have a publishedAt, set it
  if (articleData.status === "published" && !articleData.publishedAt) {
    enrichedData.publishedAt = new Date().toISOString().split("T")[0];
  }

  try {
    onStateUpdate(id, enrichedData);
    return {
      success: true,
      message: `Server Action Success: Artikel berhasil diperbarui di database.`,
      data: enrichedData,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Server Action Database Error: ${err?.message || "Gagal memperbarui data."}`,
    };
  }
}

/**
 * Simulated Server Action: Delete Article
 */
export async function deleteArticleServerAction(
  id: string,
  onStateUpdate: (id: string) => void
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    onStateUpdate(id);
    return {
      success: true,
      message: "Server Action Success: Artikel berhasil dihapus dari database.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Server Action Database Error: ${err?.message || "Gagal menghapus data."}`,
    };
  }
}
