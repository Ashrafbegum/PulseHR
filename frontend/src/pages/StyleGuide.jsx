import { useState } from "react";
import { Bell, CalendarCheck, Check, Inbox, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarStack } from "@/components/ui/avatar";
import { initialsOf } from "@/lib/initials";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl, SegmentedOption } from "@/components/ui/segmented-control";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { statusMap } from "@/lib/statusMap";

const TOKEN_SWATCHES = [
  ["primary", "bg-primary"], ["primary-soft", "bg-primary-soft"], ["success", "bg-success"],
  ["warning", "bg-warning"], ["danger", "bg-danger"], ["info", "bg-info"],
  ["dayoff", "bg-dayoff"], ["holiday", "bg-holiday"], ["weekend", "bg-weekend"],
  ["surface", "bg-surface"], ["card", "bg-card"], ["border", "bg-border"],
];

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <Card className="p-6">
        <CardContent className="flex flex-wrap items-center gap-3 p-0">{children}</CardContent>
      </Card>
    </section>
  );
}

export default function StyleGuide() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      window.localStorage.setItem("pulsehr-theme", next ? "dark" : "light");
    } catch {
      // Preview only.
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">PULSEHR · DEV ONLY</p>
              <h1 className="text-3xl font-semibold tracking-tight">Style guide</h1>
              <p className="text-sm text-muted-foreground">Tokens, components and states in both themes.</p>
            </div>
            <Button variant="outline" onClick={toggleTheme} aria-label="Toggle preview theme">
              {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
              {isDark ? "Light" : "Dark"}
            </Button>
          </div>

          <Section title="Design tokens">
            {TOKEN_SWATCHES.map(([name, cls]) => (
              <span key={name} className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-xs">
                <span className={`size-6 rounded-full border border-border ${cls}`} aria-hidden="true" />
                {name}
              </span>
            ))}
          </Section>

          <Section title="Type scale">
            <div className="w-full space-y-1">
              {[["36", "text-4xl"], ["30", "text-3xl"], ["24", "text-2xl"], ["20", "text-xl"], ["16", "text-base"], ["14", "text-sm"], ["12", "text-xs"]].map(([size, cls]) => (
                <p key={size} className={`${cls} font-semibold`}>{size}px · PulseHR ships people-first tools <span className="font-mono font-normal">ID-0042</span></p>
              ))}
              <p className="text-sm tabular">Tabular money/hours: $12,480.00 · 9.00 hours · 11:01 am</p>
            </div>
          </Section>

          <Section title="Buttons">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="icon" aria-label="Notifications"><Bell className="size-4" aria-hidden="true" /></Button>
            <Button disabled>Pending…</Button>
          </Section>

          <Section title="Form">
            <div className="w-full max-w-sm space-y-4">
              <div><Label htmlFor="sg-email">Work email</Label><Input id="sg-email" placeholder="you@company.com" /></div>
              <div><Label htmlFor="sg-bad">With error</Label><Input id="sg-bad" aria-invalid="true" aria-describedby="sg-bad-error" defaultValue="not-an-email" /><span id="sg-bad-error" className="mt-1.5 block text-xs text-destructive">Enter a valid email.</span></div>
            </div>
          </Section>

          <Section title="Badges + status map">
            <div className="flex w-full flex-col gap-3">
              {Object.entries(statusMap).map(([domain, statuses]) => (
                <div key={domain} className="flex flex-wrap items-center gap-2">
                  <span className="w-24 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{domain}</span>
                  {Object.keys(statuses).map((status) => (
                    <StatusBadge key={status} domain={domain} status={status} />
                  ))}
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-24 text-xs font-semibold uppercase tracking-wider text-muted-foreground">tones</span>
                <Badge tone="primary">primary</Badge><Badge tone="success">success</Badge><Badge tone="warning">warning</Badge><Badge tone="danger">danger</Badge><Badge tone="info">info</Badge><Badge tone="violet">violet</Badge><Badge tone="pink">pink</Badge><Badge tone="muted">muted</Badge>
              </div>
            </div>
          </Section>

          <Section title="Cards + stats">
            <div className="grid w-full gap-4 sm:grid-cols-3">
              <StatCard label="Headcount" value="128" unit="people" icon={Check} />
              <StatCard label="Payroll" value="$214,900" unit="net" icon={CalendarCheck} />
              <StatCard label="Open roles" value="6" unit="jobs" icon={Inbox} />
            </div>
            <Card className="w-full max-w-sm">
              <CardHeader><CardTitle>Profile card</CardTitle><CardDescription>Label-over-value columns.</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium">Engineering</p></div>
                <div><p className="text-xs text-muted-foreground">Role</p><p className="font-medium">Manager</p></div>
              </CardContent>
            </Card>
          </Section>

          <Section title="Avatars">
            <AvatarStack>
              {["Ava Chen", "Liam Ray", "Mia Fox"].map((name) => (
                <Avatar key={name} className="-ml-2 border-2 border-card ring-1 ring-border first:ml-0">
                  <AvatarFallback>{initialsOf(name)}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarStack>
          </Section>

          <Section title="Tabs + segmented">
            <Tabs defaultValue="day" className="w-full max-w-md">
              <TabsList><TabsTrigger value="day">Day</TabsTrigger><TabsTrigger value="week">Week</TabsTrigger></TabsList>
              <TabsContent value="day">Day panel.</TabsContent>
              <TabsContent value="week">Week panel.</TabsContent>
            </Tabs>
            <SegmentedControl type="single" defaultValue="am">
              <SegmentedOption value="am">AM</SegmentedOption>
              <SegmentedOption value="pm">PM</SegmentedOption>
            </SegmentedControl>
          </Section>

          <Section title="Overlays">
            <Dialog>
              <DialogTrigger asChild><Button variant="outline">Dialog</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Confirm action</DialogTitle><DialogDescription>Short forms only. Long forms use a page or drawer.</DialogDescription></DialogHeader>
                <DialogFooter><Button variant="outline">Cancel</Button><Button>Confirm</Button></DialogFooter>
              </DialogContent>
            </Dialog>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline">Drawer</Button></SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Drawer</SheetTitle><SheetDescription>Long forms live here, not in modals.</SheetDescription></SheetHeader>
              </SheetContent>
            </Sheet>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon" aria-label="More info"><Inbox className="size-4" aria-hidden="true" /></Button></TooltipTrigger>
              <TooltipContent>Helpful hint.</TooltipContent>
            </Tooltip>
          </Section>

          <Section title="States">
            <div className="grid w-full gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loading</p>
                <Skeleton className="h-10 w-full rounded-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Empty</p>
                <EmptyState icon={Inbox} title="Nothing here" message="One line plus an action." action={<Button size="sm">Add item</Button>} />
              </div>
              <div className="rounded-md bg-card p-4 text-sm shadow-card">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Error</p>
                <p className="font-mono text-xs text-danger">VALIDATION_ERROR</p>
                <p className="mt-1 text-muted-foreground">Request validation failed.</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">traceId 8f3a…c1</p>
                <Button size="sm" variant="outline" className="mt-3">Retry</Button>
              </div>
            </div>
          </Section>

          <Separator />
          <p className="text-xs text-muted-foreground">Dev-only route. Not included in production builds of the nav.</p>
        </div>
      </div>
    </TooltipProvider>
  );
}
