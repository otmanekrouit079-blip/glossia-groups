type ImagePlaceholderProps = {
  className?: string;
};

export function ImagePlaceholder({ className = "" }: ImagePlaceholderProps) {
  return (
    <div className={`flex items-center justify-center bg-surface-alt ${className}`}>
      <span className="text-3xl opacity-60">✂️</span>
    </div>
  );
}
