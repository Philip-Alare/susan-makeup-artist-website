import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Button } from "./Button";
import { Input, Textarea } from "./Input";
import { ArrowLeft, Save, X, Eye, Plus, Trash2 } from "lucide-react";
import { getSection, updateSection, uploadImage, withSite } from "@/lib/api";

interface TextEditorProps {
  section?: string;
  onNavigate: (page: string) => void;
  onSave: () => void;
}

export default function TextEditor({
  section = "home",
  onNavigate,
  onSave,
}: TextEditorProps) {
  const [rawJson, setRawJson] = useState("{}");
  const [prettyJson, setPrettyJson] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"form" | "json">("form");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingSetter, setPendingSetter] = useState<((url: string) => void) | null>(null);
  const stackedHeaderClass = "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";
  const mediaRowClass = "flex flex-col gap-4 lg:flex-row lg:items-start";
  const mediaActionRowClass = "flex flex-col gap-2 sm:flex-row sm:items-center";

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getSection(section);
        const pretty = JSON.stringify(data, null, 2);
        setData(data);
        setRawJson(pretty);
        setPrettyJson(pretty);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [section]);

  const openFilePickerFor = (setter: (url: string) => void) => {
    setPendingSetter(() => setter);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingSetter) return;
    try {
      setError("");
      const res = await uploadImage(file);
      pendingSetter(res.url);
      // update rawJson to reflect current data snapshot
      setRawJson(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (e.target) e.target.value = "";
      setPendingSetter(null);
    }
  };

  const revertImage = (path: string, previousUrl: string) => {
    // path like "about.image"
    try {
      const [root, key] = path.split(".");
      const next = { ...data };
      if (next[root]) {
        const currentUrl = next[root][key];
        next[root][key] = previousUrl;
        next[root].imageHistory = Array.isArray(next[root].imageHistory)
          ? next[root].imageHistory
          : [];
        next[root].imageHistory.unshift(currentUrl);
        setData(next);
        setRawJson(JSON.stringify(next, null, 2));
      }
    } catch {
      /* noop */
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const payload = mode === "form" ? data : JSON.parse(rawJson);
      await updateSection(section, payload);
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON or save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("content")}
            className="hidden p-2 sm:inline-flex"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-display text-black capitalize">Edit {section}</h2>
            <p className="text-sm text-muted-foreground">Manage content and layout</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <Button
            variant="ghost"
            onClick={() => setMode(mode === "form" ? "json" : "form")}
            className="w-full justify-center p-2 sm:w-auto"
          >
            {mode === "form" ? "Switch to JSON" : "Switch to Form"}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {mode === "form" && section === "home" && data?.hero && (
        <Card>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Input
                  label="Eyebrow"
                  id="home_hero_eyebrow"
                  value={data.hero.eyebrow || ""}
                  onChange={(e) => {
                    const next = { ...data, hero: { ...data.hero, eyebrow: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
                <Input
                  label="Title"
                  id="home_hero_title"
                  value={data.hero.title || ""}
                  onChange={(e) => {
                    const next = { ...data, hero: { ...data.hero, title: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
                <Textarea
                  label="Subtitle"
                  id="home_hero_subtitle"
                  value={data.hero.subtitle || ""}
                  onChange={(e) => {
                    const next = { ...data, hero: { ...data.hero, subtitle: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <div className={stackedHeaderClass}>
                  <label className="text-sm font-medium text-black">Slides</label>
          <Button
            variant="primary"
            className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
            onClick={() => {
              const slides = Array.isArray(data.hero.slides) ? data.hero.slides : [];
              const nextSlide = {
                title: "",
                subtitle: "",
                        image: "/assets/placeholder.jpg",
                        primaryLabel: "Book Appointment",
                        primaryHref: "/book",
                        secondaryLabel: "View Packages",
                        secondaryHref: "/packages",
                        imageHistory: [],
                      };
                      const next = { ...data, hero: { ...data.hero, slides: [nextSlide, ...slides] } };
                      setData(next);
                      setRawJson(JSON.stringify(next, null, 2));
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Slide
                  </Button>
                </div>
                <div className="space-y-6">
                  {(Array.isArray(data.hero.slides) ? data.hero.slides : []).map((slide: any, idx: number) => (
                    <div key={idx} className="rounded-lg border border-[#E5E5E5] bg-white p-3">
                      <div className={mediaRowClass}>
                        <img
                          src={slide.image}
                          alt={slide.title || `Slide ${idx + 1}`}
                          className="h-48 w-full rounded object-cover sm:h-40 lg:h-28 lg:w-40"
                          onError={(e) => ((e.currentTarget.src = "/assets/placeholder.jpg"))}
                        />
                        <div className="flex-1 space-y-3">
                          <div className={mediaActionRowClass}>
                            <Button
                              variant="primary"
                              className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
                              onClick={() =>
                                openFilePickerFor((url) => {
                                  const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                  const prev = slides[idx]?.image;
                                  const hist = Array.isArray(slides[idx]?.imageHistory) ? slides[idx].imageHistory : [];
                                  slides[idx] = { ...slides[idx], image: url, imageHistory: [prev, ...hist] };
                                  const next = { ...data, hero: { ...data.hero, slides } };
                                  setData(next);
                                  setRawJson(JSON.stringify(next, null, 2));
                                })
                              }
                            >
                              Replace Image
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-center sm:w-auto"
                              onClick={() => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides.splice(idx, 1);
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          </div>
                          <Input
                            label="Slide Title"
                            id={`home_slide_${idx}_title`}
                            value={slide.title || ""}
                            onChange={(e) => {
                              const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                              slides[idx] = { ...slides[idx], title: e.target.value };
                              const next = { ...data, hero: { ...data.hero, slides } };
                              setData(next);
                              setRawJson(JSON.stringify(next, null, 2));
                            }}
                          />
                          <Textarea
                            label="Slide Subtitle"
                            id={`home_slide_${idx}_subtitle`}
                            value={slide.subtitle || ""}
                            onChange={(e) => {
                              const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                              slides[idx] = { ...slides[idx], subtitle: e.target.value };
                              const next = { ...data, hero: { ...data.hero, slides } };
                              setData(next);
                              setRawJson(JSON.stringify(next, null, 2));
                            }}
                            rows={3}
                          />
                          <div className="grid gap-3 md:grid-cols-2">
                            <Input
                              label="Primary Button Text"
                              id={`home_slide_${idx}_primaryLabel`}
                              value={slide.primaryLabel || ""}
                              onChange={(e) => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides[idx] = { ...slides[idx], primaryLabel: e.target.value };
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            />
                            <Input
                              label="Primary Button Link"
                              id={`home_slide_${idx}_primaryHref`}
                              value={slide.primaryHref || ""}
                              onChange={(e) => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides[idx] = { ...slides[idx], primaryHref: e.target.value };
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            />
                            <Input
                              label="Secondary Button Text"
                              id={`home_slide_${idx}_secondaryLabel`}
                              value={slide.secondaryLabel || ""}
                              onChange={(e) => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides[idx] = { ...slides[idx], secondaryLabel: e.target.value };
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            />
                            <Input
                              label="Secondary Button Link"
                              id={`home_slide_${idx}_secondaryHref`}
                              value={slide.secondaryHref || ""}
                              onChange={(e) => {
                                const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                slides[idx] = { ...slides[idx], secondaryHref: e.target.value };
                                const next = { ...data, hero: { ...data.hero, slides } };
                                setData(next);
                                setRawJson(JSON.stringify(next, null, 2));
                              }}
                            />
                          </div>
                          {Array.isArray(slide.imageHistory) && slide.imageHistory.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground mb-2">Previous Images</p>
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {slide.imageHistory.slice(0, 8).map((prevUrl: string, pidx: number) => (
                                  <button
                                    key={pidx}
                                    type="button"
                                    onClick={() => {
                                      const slides = Array.isArray(data.hero.slides) ? [...data.hero.slides] : [];
                                      const current = slides[idx]?.image;
                                      slides[idx] = {
                                        ...slides[idx],
                                        image: prevUrl,
                                        imageHistory: [current, ...slides[idx].imageHistory],
                                      };
                                      const next = { ...data, hero: { ...data.hero, slides } };
                                      setData(next);
                                      setRawJson(JSON.stringify(next, null, 2));
                                    }}
                                    className="rounded border hover:border-black"
                                  >
                                    <img
                                      src={prevUrl}
                                      alt={`Prev ${pidx + 1}`}
                                      className="w-full h-16 object-cover rounded"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-black">Locations</label>
                <div className="space-y-2">
                  {(Array.isArray(data.locations) ? data.locations : []).map((loc: string, idx: number) => (
                    <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                      <div className="w-full">
                        <Input
                          id={`about_location_${idx}`}
                          value={loc}
                          onChange={(e) => {
                            const list = Array.isArray(data.locations) ? [...data.locations] : []
                            list[idx] = e.target.value
                            const next = { ...data, locations: list }
                            setData(next)
                            setRawJson(JSON.stringify(next, null, 2))
                          }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-center sm:w-auto"
                        onClick={() => {
                          const list = Array.isArray(data.locations) ? [...data.locations] : []
                          list.splice(idx, 1)
                          const next = { ...data, locations: list }
                          setData(next)
                          setRawJson(JSON.stringify(next, null, 2))
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="primary"
                  className="bg-black text-[#FFFFFF] hover:bg-[#1A1A1A]"
                  onClick={() => {
                    const list = Array.isArray(data.locations) ? [...data.locations] : []
                    const next = { ...data, locations: [...list, ""] }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Location
                </Button>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-black">Training Notes</label>
                <div className="space-y-2">
                  {(Array.isArray(data.training) ? data.training : []).map((note: string, idx: number) => (
                    <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                      <div className="w-full">
                        <Input
                          id={`about_training_${idx}`}
                          value={note}
                          onChange={(e) => {
                            const list = Array.isArray(data.training) ? [...data.training] : []
                            list[idx] = e.target.value
                            const next = { ...data, training: list }
                            setData(next)
                            setRawJson(JSON.stringify(next, null, 2))
                          }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-center sm:w-auto"
                        onClick={() => {
                          const list = Array.isArray(data.training) ? [...data.training] : []
                          list.splice(idx, 1)
                          const next = { ...data, training: list }
                          setData(next)
                          setRawJson(JSON.stringify(next, null, 2))
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="primary"
                  className="bg-black text-[#FFFFFF] hover:bg-[#1A1A1A]"
                  onClick={() => {
                    const list = Array.isArray(data.training) ? [...data.training] : []
                    const next = { ...data, training: [...list, ""] }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Training Note
                </Button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      )}

      {mode === "form" && section === "services" && (data?.services || data?.hero) && (
        <Card>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Input
                  label="Hero Title"
                  id="services_hero_title"
                  value={data.hero?.title || ""}
                  onChange={(e) => {
                    const next = { ...data, hero: { ...(data.hero || {}), title: e.target.value } }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
                <Textarea
                  label="Hero Subtitle"
                  id="services_hero_subtitle"
                  value={data.hero?.subtitle || ""}
                  onChange={(e) => {
                    const next = { ...data, hero: { ...(data.hero || {}), subtitle: e.target.value } }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6">
              <div className={stackedHeaderClass}>
                <label className="text-sm font-medium text-black">Services</label>
        <Button
          variant="primary"
          className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
          onClick={() => {
            const list = Array.isArray(data.services) ? data.services : []
            const nextItem = { title: "", description: "", features: [], image: "/assets/placeholder.jpg", imageHistory: [] }
            const next = { ...data, services: [nextItem, ...list] }
            setData(next)
            setRawJson(JSON.stringify(next, null, 2))
          }}
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
              </div>
              <div className="mt-4 space-y-6">
                {(Array.isArray(data.services) ? data.services : []).map((svc: any, idx: number) => (
                  <div key={idx} className="rounded-lg border border-[#E5E5E5] bg-white p-3">
                    <div className={mediaRowClass}>
                      <img
                        src={svc.image}
                        alt={svc.title || `Service ${idx + 1}`}
                        className="h-48 w-full rounded object-cover sm:h-40 lg:h-28 lg:w-40"
                        onError={(e) => ((e.currentTarget.src = "/assets/placeholder.jpg"))}
                      />
                      <div className="flex-1 space-y-3">
                        <div className={mediaActionRowClass}>
                          <Button
                            variant="primary"
                            className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
                            onClick={() =>
                              openFilePickerFor((url) => {
                                const list = Array.isArray(data.services) ? [...data.services] : []
                                const prev = list[idx]?.image
                                const hist = Array.isArray(list[idx]?.imageHistory) ? list[idx].imageHistory : []
                                list[idx] = { ...list[idx], image: url, imageHistory: [prev, ...hist] }
                                const next = { ...data, services: list }
                                setData(next)
                                setRawJson(JSON.stringify(next, null, 2))
                              })
                            }
                          >
                            Replace Image
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-center sm:w-auto"
                            onClick={() => {
                              const list = Array.isArray(data.services) ? [...data.services] : []
                              list.splice(idx, 1)
                              const next = { ...data, services: list }
                              setData(next)
                              setRawJson(JSON.stringify(next, null, 2))
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </Button>
                        </div>
                        <Input
                          label="Title"
                          id={`services_${idx}_title`}
                          value={svc.title || ""}
                          onChange={(e) => {
                            const list = Array.isArray(data.services) ? [...data.services] : []
                            list[idx] = { ...list[idx], title: e.target.value }
                            const next = { ...data, services: list }
                            setData(next)
                            setRawJson(JSON.stringify(next, null, 2))
                          }}
                        />
                        <Textarea
                          label="Description"
                          id={`services_${idx}_desc`}
                          value={svc.description || ""}
                          onChange={(e) => {
                            const list = Array.isArray(data.services) ? [...data.services] : []
                            list[idx] = { ...list[idx], description: e.target.value }
                            const next = { ...data, services: list }
                            setData(next)
                            setRawJson(JSON.stringify(next, null, 2))
                          }}
                          rows={3}
                        />
                        <Textarea
                          label="Features (one per line)"
                          id={`services_${idx}_features`}
                          value={Array.isArray(svc.features) ? svc.features.join("\n") : ""}
                          onChange={(e) => {
                            const lines = e.target.value.split("\n").filter(Boolean)
                            const list = Array.isArray(data.services) ? [...data.services] : []
                            list[idx] = { ...list[idx], features: lines }
                            const next = { ...data, services: list }
                            setData(next)
                            setRawJson(JSON.stringify(next, null, 2))
                          }}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </CardContent>
        </Card>
      )}

      {mode === "form" && section === "packages" && data?.packages && (
        <Card>
          <CardContent>
            <div className={stackedHeaderClass}>
              <label className="text-sm font-medium text-black">Packages</label>
        <Button
          variant="primary"
          className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
          onClick={() => {
            const list = Array.isArray(data.packages) ? data.packages : []
            const nextItem = {
              name: "",
              price: "",
                    deposit: "",
                    durationEstimate: "",
                    badge: "",
                    availability: "",
                    note: "",
                    features: [],
                    deliverables: [],
                  }
                  const next = { ...data, packages: [nextItem, ...list] }
                  setData(next)
                  setRawJson(JSON.stringify(next, null, 2))
                }}
              >
                <Plus className="w-4 h-4" />
                Add Package
              </Button>
            </div>
            <div className="mt-4 space-y-6">
              {(Array.isArray(data.packages) ? data.packages : []).map((pkg: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-[#E5E5E5] bg-white p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full">
                      <Input
                        label="Name"
                        id={`package_${idx}_name`}
                        value={pkg.name || ""}
                        onChange={(e) => {
                          const list = Array.isArray(data.packages) ? [...data.packages] : []
                          list[idx] = { ...list[idx], name: e.target.value }
                          const next = { ...data, packages: list }
                          setData(next)
                          setRawJson(JSON.stringify(next, null, 2))
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-center sm:w-auto"
                      onClick={() => {
                        const list = Array.isArray(data.packages) ? [...data.packages] : []
                        list.splice(idx, 1)
                        const next = { ...data, packages: list }
                        setData(next)
                        setRawJson(JSON.stringify(next, null, 2))
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 mt-3">
                      <Input
                        label="Description"
                        id={`package_${idx}_description`}
                        value={pkg.description || ""}
                        onChange={(e) => {
                          const list = Array.isArray(data.packages) ? [...data.packages] : []
                          list[idx] = { ...list[idx], description: e.target.value }
                          const next = { ...data, packages: list }
                          setData(next)
                          setRawJson(JSON.stringify(next, null, 2))
                        }}
                      />
                      <Input
                        label="Price"
                        id={`package_${idx}_price`}
                        value={pkg.price || ""}
                        onChange={(e) => {
                        const list = Array.isArray(data.packages) ? [...data.packages] : []
                        list[idx] = { ...list[idx], price: e.target.value }
                        const next = { ...data, packages: list }
                        setData(next)
                        setRawJson(JSON.stringify(next, null, 2))
                      }}
                    />
                    <Input
                      label="Deposit"
                      id={`package_${idx}_deposit`}
                      value={pkg.deposit || ""}
                      onChange={(e) => {
                        const list = Array.isArray(data.packages) ? [...data.packages] : []
                        list[idx] = { ...list[idx], deposit: e.target.value }
                        const next = { ...data, packages: list }
                        setData(next)
                        setRawJson(JSON.stringify(next, null, 2))
                      }}
                    />
                    <Input
                      label="Duration"
                      id={`package_${idx}_duration`}
                      value={pkg.durationEstimate || ""}
                      onChange={(e) => {
                        const list = Array.isArray(data.packages) ? [...data.packages] : []
                        list[idx] = { ...list[idx], durationEstimate: e.target.value }
                        const next = { ...data, packages: list }
                        setData(next)
                        setRawJson(JSON.stringify(next, null, 2))
                      }}
                    />
                    <Input
                      label="Badge"
                      id={`package_${idx}_badge`}
                      value={pkg.badge || ""}
                      onChange={(e) => {
                        const list = Array.isArray(data.packages) ? [...data.packages] : []
                        list[idx] = { ...list[idx], badge: e.target.value }
                        const next = { ...data, packages: list }
                        setData(next)
                        setRawJson(JSON.stringify(next, null, 2))
                      }}
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 mt-3">
                    <Input
                      label="Availability"
                      id={`package_${idx}_availability`}
                      value={pkg.availability || ""}
                      onChange={(e) => {
                        const list = Array.isArray(data.packages) ? [...data.packages] : []
                        list[idx] = { ...list[idx], availability: e.target.value }
                        const next = { ...data, packages: list }
                        setData(next)
                        setRawJson(JSON.stringify(next, null, 2))
                      }}
                    />
                    <Input
                      label="Note"
                      id={`package_${idx}_note`}
                      value={pkg.note || ""}
                      onChange={(e) => {
                        const list = Array.isArray(data.packages) ? [...data.packages] : []
                        list[idx] = { ...list[idx], note: e.target.value }
                        const next = { ...data, packages: list }
                        setData(next)
                        setRawJson(JSON.stringify(next, null, 2))
                      }}
                    />
                  </div>
                  <Textarea
                    label="Features (one per line)"
                    id={`package_${idx}_features`}
                    value={Array.isArray(pkg.features) ? pkg.features.join("\n") : ""}
                    onChange={(e) => {
                      const lines = e.target.value.split("\n").filter(Boolean)
                      const list = Array.isArray(data.packages) ? [...data.packages] : []
                      list[idx] = { ...list[idx], features: lines }
                      const next = { ...data, packages: list }
                      setData(next)
                      setRawJson(JSON.stringify(next, null, 2))
                    }}
                    rows={4}
                  />
                  <Textarea
                    label="Deliverables (one per line)"
                    id={`package_${idx}_deliverables`}
                    value={Array.isArray(pkg.deliverables) ? pkg.deliverables.join("\n") : ""}
                    onChange={(e) => {
                      const lines = e.target.value.split("\n").filter(Boolean)
                      const list = Array.isArray(data.packages) ? [...data.packages] : []
                      list[idx] = { ...list[idx], deliverables: lines }
                      const next = { ...data, packages: list }
                      setData(next)
                      setRawJson(JSON.stringify(next, null, 2))
                    }}
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "form" && section === "portfolio" && data?.items && (
        <Card>
          <CardContent>
            <div className={stackedHeaderClass}>
              <label className="text-sm font-medium text-black">Portfolio Items</label>
              <Button
                variant="primary"
                className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
                onClick={() => {
                  const list = Array.isArray(data.items) ? data.items : []
                  const nextItem = { title: "", category: "", media: "/assets/placeholder.jpg", alt: "" }
                  const next = { ...data, items: [nextItem, ...list] }
                  setData(next)
                  setRawJson(JSON.stringify(next, null, 2))
                }}
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>
            <div className="mt-4 space-y-6">
              {(Array.isArray(data.items) ? data.items : []).map((it: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-[#E5E5E5] bg-white p-3">
                  <div className={mediaRowClass}>
                    <img
                      src={it.media}
                      alt={it.alt || `Item ${idx + 1}`}
                      className="h-48 w-full rounded object-cover sm:h-40 lg:h-28 lg:w-40"
                      onError={(e) => ((e.currentTarget.src = "/assets/placeholder.jpg"))}
                    />
                    <div className="flex-1 space-y-3">
                      <div className={mediaActionRowClass}>
                        <Button
                          variant="primary"
                          className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
                          onClick={() =>
                            openFilePickerFor((url) => {
                              const list = Array.isArray(data.items) ? [...data.items] : []
                              list[idx] = { ...list[idx], media: url }
                              const next = { ...data, items: list }
                              setData(next)
                              setRawJson(JSON.stringify(next, null, 2))
                            })
                          }
                        >
                          Replace Media
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-center sm:w-auto"
                          onClick={() => {
                            const list = Array.isArray(data.items) ? [...data.items] : []
                            list.splice(idx, 1)
                            const next = { ...data, items: list }
                            setData(next)
                            setRawJson(JSON.stringify(next, null, 2))
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                      <Input
                        label="Title"
                        id={`portfolio_${idx}_title`}
                        value={it.title || ""}
                        onChange={(e) => {
                          const list = Array.isArray(data.items) ? [...data.items] : []
                          list[idx] = { ...list[idx], title: e.target.value }
                          const next = { ...data, items: list }
                          setData(next)
                          setRawJson(JSON.stringify(next, null, 2))
                        }}
                      />
                      <Input
                        label="Category"
                        id={`portfolio_${idx}_category`}
                        value={it.category || ""}
                        onChange={(e) => {
                          const list = Array.isArray(data.items) ? [...data.items] : []
                          list[idx] = { ...list[idx], category: e.target.value }
                          const next = { ...data, items: list }
                          setData(next)
                          setRawJson(JSON.stringify(next, null, 2))
                        }}
                      />
                      <Input
                        label="Alt Text"
                        id={`portfolio_${idx}_alt`}
                        value={it.alt || ""}
                        onChange={(e) => {
                          const list = Array.isArray(data.items) ? [...data.items] : []
                          list[idx] = { ...list[idx], alt: e.target.value }
                          const next = { ...data, items: list }
                          setData(next)
                          setRawJson(JSON.stringify(next, null, 2))
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </CardContent>
        </Card>
      )}

      {mode === "form" && section === "contact" && data && (
        <Card>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Input
                  label="Phone"
                  id="contact_phone"
                  value={data.phone || ""}
                  onChange={(e) => {
                    const next = { ...data, phone: e.target.value }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
                <Input
                  label="WhatsApp"
                  id="contact_whatsapp"
                  value={data.whatsapp || ""}
                  onChange={(e) => {
                    const next = { ...data, whatsapp: e.target.value }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
                <Input
                  label="WhatsApp Link"
                  id="contact_whatsapp_link"
                  value={data.whatsappLink || ""}
                  onChange={(e) => {
                    const next = { ...data, whatsappLink: e.target.value }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
                <Input
                  label="Email"
                  id="contact_email"
                  value={data.email || ""}
                  onChange={(e) => {
                    const next = { ...data, email: e.target.value }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
              </div>
              <div className="space-y-4">
                <Input
                  label="Instagram Link"
                  id="contact_instagram"
                  value={data.social?.instagram || ""}
                  onChange={(e) => {
                    const next = { ...data, social: { ...(data.social || {}), instagram: e.target.value } }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
                <Input
                  label="Facebook Link"
                  id="contact_facebook"
                  value={data.social?.facebook || ""}
                  onChange={(e) => {
                    const next = { ...data, social: { ...(data.social || {}), facebook: e.target.value } }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
                <Input
                  label="CTA Label"
                  id="contact_cta_label"
                  value={data.ctaLabel || ""}
                  onChange={(e) => {
                    const next = { ...data, ctaLabel: e.target.value }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
                <Input
                  label="CTA Link"
                  id="contact_cta_link"
                  value={data.ctaLink || ""}
                  onChange={(e) => {
                    const next = { ...data, ctaLink: e.target.value }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="text-sm font-medium text-black">Address Lines</label>
              <div className="mt-2 space-y-2">
                {(Array.isArray(data.address?.lines) ? data.address.lines : []).map((line: string, idx: number) => (
                  <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                    <div className="w-full">
                      <Input
                        id={`contact_addr_${idx}`}
                        value={line}
                        onChange={(e) => {
                          const lines = Array.isArray(data.address?.lines) ? [...data.address.lines] : []
                          lines[idx] = e.target.value
                          const next = { ...data, address: { ...(data.address || {}), lines } }
                          setData(next)
                          setRawJson(JSON.stringify(next, null, 2))
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-center sm:w-auto"
                      onClick={() => {
                        const lines = Array.isArray(data.address?.lines) ? [...data.address.lines] : []
                        lines.splice(idx, 1)
                        const next = { ...data, address: { ...(data.address || {}), lines } }
                        setData(next)
                        setRawJson(JSON.stringify(next, null, 2))
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-col gap-3">
                <Button
                  variant="primary"
                  className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
                  onClick={() => {
                    const lines = Array.isArray(data.address?.lines) ? [...data.address.lines] : []
                    const next = { ...data, address: { ...(data.address || {}), lines: [...lines, ""] } }
                    setData(next)
                    setRawJson(JSON.stringify(next, null, 2))
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Line
                </Button>
                <div className="w-full">
                  <Input
                    label="Travel Note"
                    id="contact_travelNote"
                    value={data.travelNote || ""}
                    onChange={(e) => {
                      const next = { ...data, travelNote: e.target.value }
                      setData(next)
                      setRawJson(JSON.stringify(next, null, 2))
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "json" && (
        <Card>
          <CardContent>
              <div className="space-y-4">
                <div className={stackedHeaderClass}>
                    <label className="text-sm font-medium text-black">JSON Editor</label>
                    <span className="text-xs text-muted-foreground">Edit raw content structure</span>
                </div>
                <Textarea
                    value={rawJson}
                    onChange={(e) => setRawJson(e.target.value)}
                    rows={20}
                    className="font-mono text-sm bg-slate-50"
                />
              </div>
          </CardContent>
        </Card>
      )}

      {mode === "form" && section === "about" && data?.about && (
        <Card>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Input
                  label="Title"
                  id="about_title"
                  value={data.about.title || ""}
                  onChange={(e) => {
                    const next = { ...data, about: { ...data.about, title: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
                <Input
                  label="Tagline"
                  id="about_tagline"
                  value={data.about.tagline || ""}
                  onChange={(e) => {
                    const next = { ...data, about: { ...data.about, tagline: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
                <Textarea
                  label="Bio"
                  id="about_bio"
                  value={data.about.bio || ""}
                  onChange={(e) => {
                    const next = { ...data, about: { ...data.about, bio: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                  rows={6}
                />
                <Input
                  label="Travel Note"
                  id="about_travel"
                  value={data.about.travelNote || ""}
                  onChange={(e) => {
                    const next = { ...data, about: { ...data.about, travelNote: e.target.value } };
                    setData(next);
                    setRawJson(JSON.stringify(next, null, 2));
                  }}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-black">Profile Image</label>
                <div className="rounded-lg border border-[#E5E5E5] bg-white p-3">
                  <img
                    src={withSite(data.about.image)}
                    alt={data.about.imageAlt || "About image"}
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => ((e.currentTarget.src = "/assets/placeholder.jpg"))}
                  />
                  <div className="mt-3 flex flex-col gap-3">
                    <Button
                      variant="primary"
                      className="w-full bg-black text-[#FFFFFF] hover:bg-[#1A1A1A] sm:w-auto"
                      onClick={() =>
                        openFilePickerFor((url) => {
                          const prev = data.about.image;
                          const hist = Array.isArray(data.about.imageHistory) ? data.about.imageHistory : [];
                          const next = {
                            ...data,
                            about: { ...data.about, image: url, imageHistory: [prev, ...hist] },
                          };
                          setData(next);
                        })
                      }
                    >
                      Replace Image
                    </Button>
                    <div className="w-full">
                      <Input
                        label="Alt Text"
                        id="about_alt"
                        value={data.about.imageAlt || ""}
                        onChange={(e) => {
                          const next = { ...data, about: { ...data.about, imageAlt: e.target.value } };
                          setData(next);
                          setRawJson(JSON.stringify(next, null, 2));
                        }}
                      />
                    </div>
                  </div>
                  {Array.isArray(data.about.imageHistory) && data.about.imageHistory.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Previous Images</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {data.about.imageHistory.slice(0, 6).map((prevUrl: string, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              revertImage("about.image", prevUrl)
                            }
                            className="rounded border hover:border-black"
                          >
                            <img
                              src={withSite(prevUrl)}
                              alt={`Previous ${idx + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
