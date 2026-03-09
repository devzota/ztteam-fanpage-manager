/** Layout riêng cho trang Login - không sidebar, không header */
export default function ZTTeamLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      {children}
    </div>
  );
}
