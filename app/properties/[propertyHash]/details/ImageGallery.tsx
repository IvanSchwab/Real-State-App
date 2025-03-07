import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

interface ImageGalleryProps {
  images: string[];
  selectedImageIndex: number | null;
  onImageSelect: (index: number) => void;
  onNextImage: () => void;
  onPreviousImage: () => void;
  onCloseModal: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  selectedImageIndex,
  onImageSelect,
  onNextImage,
  onPreviousImage,
  onCloseModal,
}) => {
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [displayedImagesCount, setDisplayedImagesCount] = useState(5);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialDistance = useRef<number | null>(null);
  const panStart = useRef<{ x: number; y: number } | null>(null);

  const updateDisplayedImagesCount = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setDisplayedImagesCount(11);
    } else if (width >= 768) {
      setDisplayedImagesCount(8);
    } else {
      setDisplayedImagesCount(5);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    if (e.touches.length === 1) {
      setTouchStart(e.touches[0].clientX);
      setTouchEnd(e.touches[0].clientX);
      panStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialDistance.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale === 1) {
      setTouchEnd(e.touches[0].clientX);
    } else if (e.touches.length === 1 && scale > 1 && panStart.current) {
      const newX = e.touches[0].clientX - panStart.current.x;
      const newY = e.touches[0].clientY - panStart.current.y;
      setPosition(limitPan(newX, newY));
    } else if (e.touches.length === 2 && initialDistance.current) {
      e.preventDefault();
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = currentDistance / initialDistance.current;
      setScale(Math.min(Math.max(newScale, 1), 4));
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    initialDistance.current = null;

    if (scale === 1) {
      if (touchStart - touchEnd > 50) {
        onNextImage();
      }
      if (touchStart - touchEnd < -50) {
        onPreviousImage();
      }
    }
    panStart.current = null;
  };

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      setPosition(limitPan(newX, newY));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const limitPan = (x: number, y: number) => {
    if (!imageRef.current || !containerRef.current) return { x, y };

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgWidth = imageRef.current.offsetWidth * scale;
    const imgHeight = imageRef.current.offsetHeight * scale;

    const overflowX = Math.max((imgWidth - containerRect.width) / 2, 0);
    const overflowY = Math.max((imgHeight - containerRect.height) / 2, 0);

    const limitedX = Math.min(Math.max(x, -overflowX), overflowX);
    const limitedY = Math.min(Math.max(y, -overflowY), overflowY);

    return { x: limitedX, y: limitedY };
  };


  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetZoom();
  }, [selectedImageIndex]);

  useEffect(() => {
    updateDisplayedImagesCount();
    window.addEventListener("resize", updateDisplayedImagesCount);
    return () => {
      window.removeEventListener("resize", updateDisplayedImagesCount);
    };
  }, []);

  return (
    <div className="relative">
      <div className="grid pt-16 grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.slice(0, displayedImagesCount).map((image, index) => (
          <div
            key={index}
            className="relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => onImageSelect(index)}
          >
            <Image
              src={`https://images.mapaprop.app/photos/${image}`}
              alt={`Imagen ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-300"
              quality={70}
            />
          </div>
        ))}
        {images.length > displayedImagesCount && !showMoreImages && (
          <button
            className="col-span-1 bg-gray-200 text-gray-700 font-semibold rounded-lg flex items-center justify-center aspect-square w-full cursor-pointer hover:bg-gray-300 transition-all"
            onClick={() => setShowMoreImages(true)}
          >
            +{images.length - displayedImagesCount} más
          </button>
        )}
      </div>

      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 touch-none">
          <div
            ref={containerRef}
            className="absolute inset-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={onPreviousImage}
              className={`absolute left-4 z-40 text-white text-3xl font-bold p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-opacity ${isTouching ? "opacity-0" : "opacity-100"
                } md:block`}
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              &lt;
            </button>

            <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
              <div
                ref={imageRef}
                className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: scale === 1 ? "transform 0.3s" : "none",
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                }}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
              >
                <Image
                  src={`https://images.mapaprop.app/photos/${images[selectedImageIndex]}`}
                  alt={`Imagen seleccionada ${selectedImageIndex + 1}`}
                  width={800} 
                  height={600}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-contain w-auto h-auto max-w-full max-h-full"
                  quality={85}
                />
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2 w-2 rounded-full ${idx === selectedImageIndex ? "bg-white" : "bg-gray-500"
                      }`}
                  ></span>
                ))}
              </div>
            </div>

            <button
              onClick={onNextImage}
              className={`absolute right-4 text-white text-3xl font-bold p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-opacity ${isTouching ? "opacity-0" : "opacity-100"
                } md:block`}
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              &gt;
            </button>
          </div>

          <button
            onClick={onCloseModal}
            className="absolute top-4 right-4 text-white text-2xl p-2 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {showMoreImages && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-wrap p-4 overflow-auto">
          <button
            onClick={() => setShowMoreImages(false)}
            className="absolute top-4 right-4 text-white text-2xl bg-red-600 rounded-full p-2 hover:bg-red-500"
          >
            ✕
          </button>
          <div className="w-full gap-x-2 gap-y-1 max-w-4xl mx-auto bg-gray-200 rounded-lg p-4 flex flex-wrap justify-center border-4 border-custom-green">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-56 w-56 overflow-hidden rounded-md cursor-pointer"
                onClick={() => {
                  setShowMoreImages(false);
                  onImageSelect(index);
                }}
              >
                <Image
                  src={`https://images.mapaprop.app/photos/${image}`}
                  alt={`Imagen ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  quality={70}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;