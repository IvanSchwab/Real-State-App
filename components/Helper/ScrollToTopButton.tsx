'use client'; // Directiva para cliente

import { useState, useEffect } from "react";
import { HiChevronUp } from "react-icons/hi";

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${showButton ? "opacity-100" : "opacity-0"
                }`}
        >
            {/* Botón con ícono de flecha hacia arriba */}
            <button
                onClick={scrollToTop}
                className="p-3 rounded-full shadow-lg text-white transition-all duration-300 hover:bg-[#E3C565] hover:shadow-xl"
                style={{
                    backgroundColor: '#A4B494', 
                }}
                aria-label="Volver arriba"
            >
                <HiChevronUp className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ScrollToTopButton;