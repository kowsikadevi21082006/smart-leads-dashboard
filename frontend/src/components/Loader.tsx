interface LoaderProps {
  label?: string;
  fullScreen?: boolean;
}

const Loader = ({ label = "Loading...", fullScreen = false }: LoaderProps) => {
  const containerClass = fullScreen
    ? "app-shell flex min-h-screen items-center justify-center"
    : "flex items-center justify-center rounded-2xl border border-border bg-surface py-10";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-accent/20 border-t-accent shadow-[0_0_18px_rgba(212,255,0,0.24)]" />
        <p className="text-sm font-medium text-text-secondary">{label}</p>
      </div>
    </div>
  );
};

export default Loader;
