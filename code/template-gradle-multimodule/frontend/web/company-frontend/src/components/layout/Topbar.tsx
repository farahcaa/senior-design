interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <div className="h-14 border-b border-black/[0.08] bg-white flex items-center justify-between px-4 md:px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Brand mark - mobile only (sidebar hidden on mobile) */}
        <img src="/logo.png" alt="App logo" className="md:hidden w-7 h-7 rounded-lg flex-shrink-0 object-contain" />
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      </div>
    </div>
  );
}
