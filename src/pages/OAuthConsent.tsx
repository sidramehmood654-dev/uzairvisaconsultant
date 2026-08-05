import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

const Shell = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen flex items-center justify-center bg-background p-6">
    <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 text-center">{children}</div>
  </main>
);

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: err } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (err) {
        setError(err.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error: err } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  };

  if (error)
    return (
      <Shell>
        <h1 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Authorization failed
        </h1>
        <p className="text-sm text-muted-foreground">{error}</p>
      </Shell>
    );

  if (!details)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </Shell>
    );

  const clientName = details.client?.name ?? "an application";

  return (
    <Shell>
      <h1 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        Connect {clientName}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {clientName} is requesting access to Uzair Visa Consultancy as you. It will be able to read and act on the data
        your account can access.
      </p>
      <div className="flex gap-3">
        <button
          disabled={busy}
          onClick={() => decide(false)}
          className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          Deny
        </button>
        <button
          disabled={busy}
          onClick={() => decide(true)}
          className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Approve
        </button>
      </div>
    </Shell>
  );
};

export default OAuthConsent;
