import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
        Find Your Next Perfect Place to Live
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        Discover, view, and compare the best properties in your area. Simple, transparent, and quick.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/search"
          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Browse Properties
        </a>
        <a href="/compare" className="text-sm font-semibold leading-6 text-foreground hover:underline">
          Compare Options <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Temporary Theme Test Section */}
      <div className="mt-20 mx-auto max-w-md text-left">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary text-xl">Theme Verification Card</CardTitle>
            <CardDescription>Confirming custom shadcn/ui theming is active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This card is a temporary test wrapper to verify that our custom colors (Trustworthy Slate Blue and Sunset Orange) work correctly with shadcn/ui.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Primary (Slate Blue)
              </span>
              <span className="rounded bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                Secondary (Sunset Orange)
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Secondary Action</Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Primary CTA (Sunset Orange)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
