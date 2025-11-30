"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardBody } from "@/components/tiptap-ui-primitive/card/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card className="w-full max-w-md border-border bg-card">
      <CardHeader className="text-center">
        <h1 className="text-2xl font-bold text-destructive">Authentication Error</h1>
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-center text-muted-foreground">
          {error === "OAuthSignin" && "Error constructing OAuth request"}
          {error === "OAuthCallback" && "Error handling OAuth callback"}
          {error === "OAuthCreateAccount" && "Could not create account"}
          {error === "EmailCreateAccount" && "Could not create email account"}
          {error === "Callback" && "Error in callback handler"}
          {error === "OAuthAccountNotLinked" && "Account already exists with different provider"}
          {error === "EmailSignin" && "Check your email for sign in link"}
          {error === "CredentialsSignin" && "Invalid credentials"}
          {error === "SessionRequired" && "Please sign in to access this page"}
          {!error && "An unknown error occurred"}
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/signin">
            <Button>Try Again</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
