import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { createPortal } from "react-dom";

interface Property {
    code: string;
    propertyHash: string;
}

interface DataResponse {
    properties: Property[];
}

const SearchCode: React.FC = () => {
    const [searchCode, setSearchCode] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleSearch = async () => {
        setError("");

        if (!searchCode) {
            setError("Por favor, ingresa un código de propiedad.");
            return;
        }

        try {
            const queryString = new URLSearchParams({
                codeSearch: searchCode,
            }).toString();

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;

            if (!apiUrl || !apiKey) {
                console.error('Missing API configuration');
                return;
            }

            const response = await fetch(
                `${apiUrl}/properties?${queryString}&oauth_token=${apiKey}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("No se pudo obtener las propiedades.");
            }

            const data: DataResponse = await response.json();
            console.log(data);

            const foundProperty = data.properties.find((prop) => prop.code === searchCode);

            if (foundProperty) {
                router.push(`/properties/${foundProperty.propertyHash}`);
                setIsModalOpen(false);
            } else {
                setError("No se encontró ninguna propiedad con ese código.");
            }

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error desconocido al obtener las propiedades.");
            }
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="hidden lg:block bg-[#81A781] text-sm text-white px-4 py-2 rounded-lg"
            >
                Buscar Propiedad
            </button>

            <button
                onClick={() => setIsModalOpen(true)}
                className="lg:hidden flex items-center justify-center bg-[#81A781] text-white p-3 rounded-full shadow-md hover:bg-[#6e9372] active:scale-95 transition-all"
            >
                <FaSearch className="text-xl" />
            </button>

            {isModalOpen && createPortal(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg text-gray-700 font-semibold mb-2">Buscar por Código</h2>

                        <input
                            type="text"
                            placeholder="Código propiedad"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full py-2 pl-4 pr-4 text-gray-500 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7C8F7C] mb-2"
                        />

                        {error && <p className="text-red-500 text-xs">{error}</p>}

                        <button
                            onClick={handleSearch}
                            className="w-full bg-[#7C8F7C] text-white py-2 rounded-lg mt-2"
                        >
                            Buscar
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default SearchCode;
