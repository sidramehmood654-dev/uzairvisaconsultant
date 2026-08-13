import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Country,
  createCountry,
  deleteCountry,
  listCountries,
  updateCountry,
} from "@/lib/countries";

const emptyForm = { name: "", flag: "", visaTypes: "", fee: "", processingDays: "" };

const AdminCountries = () => {
  const [list, setList] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setList(await listCountries());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const patchLocal = (id: string, patch: Partial<Country>) =>
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const toggle = async (c: Country) => {
    const next = !c.enabled;
    patchLocal(c.id, { enabled: next });
    try {
      await updateCountry(c.id, { enabled: next });
      toast(`${c.name} ${next ? "enabled" : "hidden from clients"}`);
    } catch (e) {
      patchLocal(c.id, { enabled: c.enabled });
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const saveRow = async (c: Country) => {
    setSavingId(c.id);
    try {
      await updateCountry(c.id, {
        fee: Number(c.fee) || 0,
        processing_days: c.processing_days,
      });
      toast.success(`${c.name} saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (c: Country) => {
    if (!confirm(`Remove ${c.name}?`)) return;
    try {
      await deleteCountry(c.id);
      setList((prev) => prev.filter((x) => x.id !== c.id));
      toast.success(`${c.name} removed`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const submitNew = async () => {
    setCreating(true);
    try {
      const created = await createCountry({
        name: form.name,
        flag: form.flag,
        visa_types: form.visaTypes.split(",").map((s) => s.trim()).filter(Boolean),
        fee: Number(form.fee) || 0,
        processing_days: form.processingDays,
        enabled: true,
      });
      setList((prev) => [...prev, created]);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Country added");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add country");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Countries & Fees
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Live data — changes are saved to your database instantly.
            </p>
          </div>
          <Button
            onClick={() => setShowForm((s) => !s)}
            className="bg-gradient-gold text-primary-foreground font-semibold"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Country
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-5 grid md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Flag</label>
              <Input value={form.flag} onChange={(e) => setForm({ ...form, flag: e.target.value })} placeholder="🇩🇪" className="mt-1" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Germany" className="mt-1" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Visa types (comma separated)</label>
              <Input value={form.visaTypes} onChange={(e) => setForm({ ...form, visaTypes: e.target.value })} placeholder="Study, Work" className="mt-1" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Fee (USD)</label>
              <Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="mt-1" />
            </div>
            <div className="flex gap-2">
              <Input value={form.processingDays} onChange={(e) => setForm({ ...form, processingDays: e.target.value })} placeholder="30–60" className="mt-1" />
              <Button onClick={submitNew} disabled={creating} className="mt-1 bg-gradient-gold text-primary-foreground">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading countries…
          </div>
        ) : list.length === 0 ? (
          <p className="text-muted-foreground">No countries yet. Add your first destination.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {list.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.flag}</span>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.enabled ? "Visible to clients" : "Hidden"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={c.enabled} onCheckedChange={() => toggle(c)} />
                    <Button variant="ghost" size="icon" onClick={() => remove(c)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.visa_types.map((v) => (
                    <span key={v} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{v}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Service Fee (USD)</label>
                    <Input
                      type="number"
                      value={c.fee}
                      onChange={(e) => patchLocal(c.id, { fee: parseInt(e.target.value) || 0 })}
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Processing Days</label>
                    <Input
                      value={c.processing_days}
                      onChange={(e) => patchLocal(c.id, { processing_days: e.target.value })}
                      className="mt-1 h-8"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => saveRow(c)}
                  disabled={savingId === c.id}
                  size="sm"
                  className="mt-4 bg-gradient-gold text-primary-foreground font-semibold"
                >
                  {savingId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCountries;
