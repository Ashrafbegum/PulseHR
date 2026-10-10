import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import validateAuthField from "@/lib/validateAuthField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthForm({ title, description, fields, submitLabel, onSubmit, footer, children }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map(({ name }) => [name, ""])));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("pulsehr-theme");
    const isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleTheme() {
    const isDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("pulsehr-theme", isDark ? "dark" : "light");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = Object.fromEntries(fields.map(({ name }) => [name, validateAuthField(name, values[name])]));
    const valid = Object.fromEntries(Object.entries(nextErrors).filter(([, message]) => message));
    setErrors(valid);
    setFormError("");
    if (Object.keys(valid).length) return;
    setBusy(true);
    try { await onSubmit(values); }
    catch (error) { setFormError(error?.message || "Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-shell">
      <div className="auth-frame">
      <div className="auth-card">
        <div className="auth-topline">
          <Button variant="outline" size="icon" type="button" onClick={toggleTheme} aria-label="Toggle color theme" className="rounded-full bg-card">
            <Sun className="size-4 dark:hidden" aria-hidden="true" />
            <Moon className="hidden size-4 dark:block" aria-hidden="true" />
          </Button>
        </div>
        <Link className="brand" to="/" aria-label="PulseHR home"><span className="brand-mark">P</span> pulse<span>hr</span></Link>
        <header className="auth-heading"><p className="eyebrow">PEOPLE, IN SYNC</p><h1>{title}</h1><p>{description}</p></header>
        <form onSubmit={handleSubmit} noValidate>
          {fields.map(({ name, label, type = "text", autoComplete, placeholder }) => (
            <div className="mb-5" key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input id={name} name={name} type={type} autoComplete={autoComplete || name} placeholder={placeholder || label} value={values[name]} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} onChange={(event) => { setValues({ ...values, [name]: event.target.value }); setErrors({ ...errors, [name]: "" }); }} />
              {errors[name] && <span className="mt-1.5 block text-xs text-destructive" id={`${name}-error`}>{errors[name]}</span>}
            </div>
          ))}
          {children}
          {formError && <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">{formError}</div>}
          <Button className="min-h-12 w-full" type="submit" disabled={busy}>{busy ? "Please wait…" : submitLabel}</Button>
        </form>
        {footer && <div className="auth-footer">{footer}</div>}
        <p className="auth-legal">Secure access for your workplace</p>
      </div>
      <aside className="auth-aside"><div className="aside-content"><span className="aside-kicker">Built for people-first teams</span><h2>Better work starts with people.</h2><p>Bring your people operations together, so your team can focus on doing their best work.</p><div className="aside-orbit"><span>✳</span></div></div><span className="aside-caption">PULSEHR · PEOPLE OPERATIONS</span></aside>
      </div>
    </main>
  );
}
