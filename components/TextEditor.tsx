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
  const [mode, setMode] = useState<"form" | "json">("json"); // Default to JSON for flexibility
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingSetter, setPendingSetter] = useState<((url: string) => void) | null>(null);

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

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      // If in JSON mode, parse the raw JSON. If in form mode, use the data object.
      // For now, we only rely on rawJson being the source of truth if edited in JSON mode.
      const payload = JSON.parse(rawJson);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate("content")} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-display text-[#2c1a0a] capitalize">Edit {section}</h2>
            <p className="text-sm text-muted-foreground">Manage content and layout</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            {/* Toggle mode button could go here if we implemented form views */}
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#C9A24D] text-[#1c1208] hover:bg-[#b89342]"
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

      <Card>
        <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[#2c1a0a]">JSON Editor</label>
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
    </div>
  );
}
