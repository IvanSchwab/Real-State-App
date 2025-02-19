import React, { useEffect, useState } from "react";

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

  const updateDisplayedImagesCount = () => {
    const width = window.innerWidth;

    if (width >= 1024) {
      setDisplayedImagesCount(11);
    } else if (width >= 768) {
      setDisplayedImagesCount(8);
    }
    else {
      setDisplayedImagesCount(5);
    }

  };

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
          <img
            key={index}
            src={`https://images.mapaprop.app/photos/${image}`}
            alt={`Imagen ${index + 1}`}
            className="object-cover w-full aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => onImageSelect(index)}
          />
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button
            onClick={onPreviousImage}
            className="absolute left-4 text-white text-3xl font-bold p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors hidden md:block"
          >
            &lt;
          </button>

          <div className="relative">
            <img
              src={`https://images.mapaprop.app/photos/${images[selectedImageIndex]}`}
              alt={`Imagen seleccionada ${selectedImageIndex + 1}`}
              className="max-w-[900px] max-h-[90vh] object-contain animate-slide-in"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-2 rounded-full ${idx === selectedImageIndex
                    ? "bg-white"
                    : "bg-gray-500"
                    }`}
                ></span>
              ))}
            </div>
          </div>


          <button
            onClick={onNextImage}
            className="absolute right-4 text-white text-3xl font-bold p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors hidden md:block"
          >
            &gt;
          </button>

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
              <img
                key={index}
                src={`https://images.mapaprop.app/photos/${image}`}
                alt={`Imagen ${index + 1}`}
                className="h-56 w-56 object-cover cursor-pointer hover:scale-105 transition-transform rounded-md"
                onClick={() => {
                  setShowMoreImages(false);
                  onImageSelect(index);
                }}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageGallery;
