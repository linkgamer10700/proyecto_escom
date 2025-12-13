export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="antialiased bg-background text-foreground">
            {children}
        </div>
    );
}

