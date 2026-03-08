import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList =
    images.length > 0
      ? images
      : ["https://via.placeholder.com/800x800?text=No+Image"];

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="md:w-1/3 relative rounded-xl border border-red-900 overflow-hidden bg-zinc-900">

      {/* Image Container */}
      <div className="relative w-full aspect-square bg-zinc-800">
        <img
          src={imageList[currentIndex]}
          alt="product"
          className="w-full h-full object-cover"
        />

        {imageList.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {imageList.length > 1 && (
        <div className="flex justify-center gap-2 py-3 bg-zinc-900">
          {imageList.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === currentIndex
                  ? "bg-red-600"
                  : "bg-zinc-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}   