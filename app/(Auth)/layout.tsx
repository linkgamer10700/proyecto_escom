import AuthHeader from "@/components/AuthHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader />

      <main className="flex flex-grow items-center justify-center p-4 
                       bg-gray-50 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}