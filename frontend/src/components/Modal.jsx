export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* card */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-2xl z-10">
        {children}
      </div>
    </div>
  );
}
