import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Country {
  flag: string;
  name: string;
  enabled: boolean;
  visaTypes: string[];
  fee: number;
  processingDays: string;
}

const initial: Country[] = [
  { flag: "🇮🇹", name: "Italy", enabled: true, visaTypes: ["Study", "Work", "Family", "Tourist", "Business", "Residence"], fee: 1200, processingDays: "30–60" },
  { flag: "🇵🇹", name: "Portugal", enabled: true, visaTypes: ["Study", "Work", "Golden Visa", "Tourist", "Residence"], fee: 1500, processingDays: "45–75" },
  { flag: "🇬🇷", name: "Greece", enabled: true, visaTypes: ["Study", "Tourist", "Residence", "Golden Visa"], fee: 1100, processingDays: "30–45" },
  { flag: "🇪🇸", name: "Spain", enabled: true, visaTypes: ["Study", "Work", "Family", "Tourist", "Business", "Residence"], fee: 1300, processingDays: "30–60" },
  { flag: "🇫🇷", name: "France", enabled: false, visaTypes: ["Tourist"], fee: 900, processingDays: "—" },
];

const AdminCountries = () => {
  const [list, setList] = useState(initial);

  const toggle = (i: number) => {
    const next = [...list];
    next[i].enabled = !next[i].enabled;
    setList(next);
    toast(`${next[i].name} ${next[i].enabled ? "enabled" : "disabled"}`);
  };

  const updateFee = (i: number, fee: number) => {
    const next = [...list];
    next[i].fee = fee;
    setList(next);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Countries & Visa Types</h1>
          <p className="text-sm text-muted-foreground mt-1">Toggle which destinations and visa types your agency offers.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {list.map((c, i) => (
            <div key={c.name} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.flag}</span>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.enabled ? "Visible to clients" : "Hidden"}</p>
                  </div>
                </div>
                <Switch checked={c.enabled} onCheckedChange={() => toggle(i)} />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {c.visaTypes.map((v) => (
                  <span key={v} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{v}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Service Fee (USD)</label>
                  <Input type="number" value={c.fee} onChange={(e) => updateFee(i, parseInt(e.target.value) || 0)} className="mt-1 h-8" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Processing Days</label>
                  <p className="mt-1 h-8 flex items-center text-sm text-foreground">{c.processingDays}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => toast.success("Settings saved")} className="bg-gradient-gold text-primary-foreground font-semibold">
          Save Changes
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminCountries;
