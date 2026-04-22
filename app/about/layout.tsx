export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>
        <p className="border border-3">about layar 1</p>
        {children}
      </div>
    </>
  );
}
