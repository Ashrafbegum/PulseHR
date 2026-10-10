import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/services/authService";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <main className="auth-shell">
        <div className="auth-frame">
          <div className="auth-card">
            <Link className="brand" to="/"><span className="brand-mark">P</span> pulse<span>hr</span></Link>
            <span className="mt-12 grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
              <Check className="size-6" aria-hidden="true" />
            </span>
            <header className="auth-heading"><p className="eyebrow">CHECK YOUR INBOX</p><h1>Reset link requested</h1><p>If an account matches that email, you’ll receive instructions shortly.</p></header>
            <Button asChild className="mt-8 w-full"><Link to="/login">Back to sign in</Link></Button>
          </div>
          <aside className="auth-aside"><div className="aside-content"><span className="aside-kicker">Built for people-first teams</span><h2>Better work starts with people.</h2><p>Bring your people operations together, so your team can focus on doing their best work.</p><div className="aside-orbit"><span>✳</span></div></div><span className="aside-caption">PULSEHR · PEOPLE OPERATIONS</span></aside>
        </div>
      </main>
    );
  }
  return <AuthForm title="Forgot your password?" description="Enter your work email and we’ll send you a link to reset it." submitLabel="Send reset link" fields={[{ name: "email", label: "Work email", type: "email", autoComplete: "email", placeholder: "you@company.com" }]} onSubmit={async ({ email }) => { await forgotPassword(email); setSent(true); }} footer={<>Remembered it? <Link to="/login">Back to sign in</Link></>} />;
}
