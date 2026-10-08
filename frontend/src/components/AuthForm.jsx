import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(name, value) {
  const text = String(value ?? "").trim();
  if (!text) return "This field is required.";
  if (name === "email" && !emailPattern.test(text)) return "Enter a valid email address.";
  if (name === "password" && text.length < 8) return "Use at least 8 characters.";
  if (name === "phone" && !/^[+\d().\s-]{7,20}$/.test(text)) return "Enter a valid phone number.";
  return "";
}

export default function AuthForm({ title, description, fields, submitLabel, onSubmit, footer, children }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map(({ name }) => [name, ""])));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = Object.fromEntries(fields.map(({ name }) => [name, validateField(name, values[name])]));
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
      <div className="auth-card">
        <a className="brand" href="/login" aria-label="PulseHR home"><span className="brand-mark">P</span> pulse<span>hr</span></a>
        <header className="auth-heading"><p className="eyebrow">PEOPLE, IN SYNC</p><h1>{title}</h1><p>{description}</p></header>
        <form onSubmit={handleSubmit} noValidate>
          {fields.map(({ name, label, type = "text", autoComplete, placeholder }) => (
            <div className="field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input id={name} name={name} type={type} autoComplete={autoComplete || name} placeholder={placeholder || label} value={values[name]} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} onChange={(event) => { setValues({ ...values, [name]: event.target.value }); setErrors({ ...errors, [name]: "" }); }} />
              {errors[name] && <span className="field-error" id={`${name}-error`}>{errors[name]}</span>}
            </div>
          ))}
          {children}
          {formError && <div className="form-error" role="alert">{formError}</div>}
          <button className="submit-button" type="submit" disabled={busy}>{busy ? "Please wait…" : submitLabel}</button>
        </form>
        {footer && <div className="auth-footer">{footer}</div>}
        <p className="auth-legal">Secure access for your workplace</p>
      </div>
      <aside className="auth-aside"><div className="aside-content"><span className="aside-kicker">A better day at work starts here.</span><h2>People are your greatest work.</h2><p>Bring your people operations together, so your team can focus on doing their best work.</p><div className="aside-orbit"><span>✳</span></div></div><span className="aside-caption">PULSEHR · PEOPLE OPERATIONS</span></aside>
    </main>
  );
}

