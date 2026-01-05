import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Upload, Trash2, RefreshCw, Eye, Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { uploadImage, getSection, updateSection, withSite } from "@/lib/api";

interface ImageManagerProps {
  onDelete: () => void;
}

function ImageManager({ onDelete }: ImageManagerProps) {
  const [images, setImages] = useState<
    { id: number; url: string; name: string; section: string; category: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isVideo = (path: string) => path?.toLowerCase().endsWith(".mp4");

  // Load existing gallery items from website content (portfolio section)
  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        setError("");
        const data = await getSection("portfolio");
        const mapped =
          data.items?.map((item: any, idx: number) => ({
            id: idx,
            url: withSite(item.media),
            name: item.title || `Image ${idx + 1}`,
            section: "Portfolio",
            category: item.category || "General",
          })) || [];
        setImages(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const persistGallery = async (items: typeof images) => {
    // Map back to Susan's portfolio structure
    const payload = {
      items: items.map((img) => ({
        title: img.name,
        category: img.category || "general",
        media: img.url, // Ensure we store the relative path if possible, but full URL is fine if using blob
        alt: img.name,
      })),
    };
    await updateSection("portfolio", payload);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const result = await uploadImage(file);
      const newImage = {
        id: Date.now(),
        url: result.url, // Vercel Blob returns absolute URL
        name: file.name.split('.')[0],
        section: "Portfolio",
        category: "general",
      };
      const nextImages = [newImage, ...images];
      setImages(nextImages);
      await persistGallery(nextImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this image from the portfolio?")) return;
    const nextImages = images.filter((img) => img.id !== id);
    setImages(nextImages);
    await persistGallery(nextImages);
    onDelete();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#2c1a0a] text-xl font-semibold">Gallery Manager</h1>
          <p className="text-muted-foreground">Upload and manage portfolio images</p>
        </div>
        <label className="inline-flex items-center gap-2 bg-[#C9A24D] text-[#1c1208] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#b89342] font-medium transition-colors">
          <Upload className="w-5 h-5" />
          {uploading ? "Uploading..." : "Upload New Image"}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#C9A24D] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <Card key={img.id} className="group relative overflow-hidden">
              <div className="aspect-square bg-muted relative">
                {isVideo(img.url) ? (
                  <video
                    src={img.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    loop
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <ImageWithFallback
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-3 bg-white border-t border-[#d6c4a5]/30">
                <p className="font-medium text-sm truncate text-[#2c1a0a]">{img.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{img.category}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageManager;
