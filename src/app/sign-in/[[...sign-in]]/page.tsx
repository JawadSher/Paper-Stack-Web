import { SignIn } from "@clerk/nextjs";
import { PaperStackLogo } from "@/components/shared/PaperStackLogo";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-ps-coral p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <PaperStackLogo showText size="lg" />
          <div className="max-w-xl">
            <h1 className="text-5xl font-semibold leading-tight">
              PaperStack Admin
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/85">
              Manage past papers, boards, subjects, and common questions from
              one focused workspace.
            </p>
          </div>
          <p className="text-sm text-white/70">
            Access is limited to approved administrators.
          </p>
        </section>

        <section className="grid place-items-center px-6 py-12">
          <div className="grid w-full max-w-md justify-items-center gap-6">
            <div className="grid justify-items-center gap-4 lg:hidden">
              <PaperStackLogo showText size="lg" />
              <div className="text-center">
                <h1 className="text-2xl font-semibold">PaperStack Admin</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in with your approved admin account.
                </p>
              </div>
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
        </section>
      </div>
    </main>
  );
}
