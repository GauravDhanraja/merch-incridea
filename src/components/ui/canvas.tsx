import { useEffect, useRef } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      // Set canvas dimensions to mimic a phone (9:16 aspect ratio)
      const screenWidth = window.innerWidth;
      const width = Math.min(screenWidth * 0.8, 360); // Canvas width is 80% of screen width, max 360px
      const height = (width / 9) * 16; // Maintain 9:16 aspect ratio

      canvas.width = width;
      canvas.height = height;

      // Draw placeholder background
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add border for better visibility
      ctx.strokeStyle = "#555";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };

    // Initial setup
    resizeCanvas();

    // Update canvas on window resize
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="flex justify-center items-center my-4 mx-2 sm:mx-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-600 rounded-lg shadow-md"
      />
    </div>
  );
};

export default Canvas;
