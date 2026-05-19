import { SignIn } from "@clerk/nextjs";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-12">
      <div className="grid w-full max-w-md justify-items-center gap-6">
        <PaperStackLogo showText size="lg" />
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access is limited to approved PaperStack administrators.
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          appearance={{
            elements: {
              footerAction: "hidden",
              footerActionText: "hidden",
              footerActionLink: "hidden",
            },
          }}
        />
      </div>
    </main>
  );
}
