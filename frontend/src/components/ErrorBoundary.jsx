import { Component } from "react";
import { RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("Application render error", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-background px-6">
          <Card className="w-full max-w-sm p-9">
            <CardContent className="space-y-3 p-0">
              <span className="brand-mark">P</span>
              <p className="eyebrow">PULSEHR</p>
              <h1 className="text-2xl font-semibold tracking-tight">That didn’t go to plan.</h1>
              <p className="text-sm leading-6 text-muted-foreground">Something unexpected happened. Reload the page to try again.</p>
              <Button className="mt-5 w-full" onClick={() => window.location.reload()}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Reload page
              </Button>
            </CardContent>
          </Card>
        </main>
      );
    }
    return this.props.children;
  }
}
