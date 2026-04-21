const KGFLogo = ({ size = "lg", variant = "full", className = "" }) => {
  const sizes = {
    sm: "h-8",
    md: "h-12", 
    lg: "h-16",
    xl: "h-36", // Increased 1.5x from h-24
    "2xl": "h-48" // Increased 1.5x from h-32
  };

  return (
    <div className={`${sizes[size]} ${className} flex items-center justify-center`}>
      <img 
        src="/logo.png" 
        alt="GuruKripa Fitness Logo" 
        className="h-full w-auto object-contain drop-shadow-lg"
      />
    </div>
  );
};

export default KGFLogo;