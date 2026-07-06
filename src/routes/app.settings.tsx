import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Bell, Palette, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Configurações — Nexlearn" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [notifs, setNotifs] = useState(true);
  const [emails, setEmails] = useState(false);
  const [autoproc, setAutoproc] = useState(true);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <p className="text-xs uppercase tracking-widest text-primary/80">Preferências</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Configurações</h1>

      <Section icon={User} title="Perfil" desc="Como você aparece no Nexlearn.">
        <Field label="Nome">
          <input
            defaultValue="Aluno Nexlearn"
            className="w-full rounded-md border border-border/60 bg-surface/60 px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
          />
        </Field>
        <Field label="Email">
          <input
            defaultValue="aluno@nexlearn.com"
            className="w-full rounded-md border border-border/60 bg-surface/60 px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
          />
        </Field>
      </Section>

      <Section icon={Bell} title="Notificações" desc="Escolha o que você quer receber.">
        <Toggle label="Push no navegador" desc="Alertas quando um documento é processado" value={notifs} onChange={setNotifs} />
        <Toggle label="Email semanal" desc="Resumo de progresso todas as segundas" value={emails} onChange={setEmails} />
      </Section>

      <Section icon={Zap} title="Automação" desc="Deixe a IA trabalhar sozinha.">
        <Toggle
          label="Processamento automático"
          desc="Ao fazer upload, iniciar processamento imediatamente"
          value={autoproc}
          onChange={setAutoproc}
        />
      </Section>

      <Section icon={Palette} title="Aparência" desc="Tema visual do workspace.">
        <div className="grid grid-cols-3 gap-3">
          <ThemeCard label="Dark Red" active gradient="linear-gradient(135deg, oklch(0.13 0.01 20), oklch(0.35 0.15 25))" />
          <ThemeCard label="Midnight" gradient="linear-gradient(135deg, oklch(0.13 0.02 260), oklch(0.28 0.15 260))" />
          <ThemeCard label="Slate" gradient="linear-gradient(135deg, oklch(0.15 0 0), oklch(0.35 0 0))" />
        </div>
      </Section>

      <Section icon={Shield} title="Segurança" desc="Sua conta e privacidade.">
        <div className="flex flex-wrap gap-2">
          <button className="rounded-md border border-border/60 bg-surface/60 px-3 py-2 text-sm hover:border-primary/40">
            Alterar senha
          </button>
          <button className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive hover:bg-destructive/20">
            Deletar conta
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-xl border border-border/60 bg-surface/40 p-6">
      <div className="flex items-start gap-3 border-b border-border/40 pb-4">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-display font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function ThemeCard({ label, gradient, active }: { label: string; gradient: string; active?: boolean }) {
  return (
    <button
      className={`overflow-hidden rounded-lg border p-1 text-left transition-all ${
        active ? "border-primary shadow-[var(--shadow-red)]" : "border-border/60 hover:border-primary/40"
      }`}
    >
      <div className="h-16 w-full rounded-md" style={{ background: gradient }} />
      <p className="mt-2 px-1 pb-1 text-xs font-medium">{label}</p>
    </button>
  );
}
