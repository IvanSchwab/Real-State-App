import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                },
            });

            if (!response.ok) {
                throw new Error("No se pudo obtener las propiedades.");
            }

            const data = await response.json();
            console.log(data);

            const foundProperty = data.properties.find((prop: any) => prop.code === searchCode);

            if (foundProperty) {
                router.push(`/properties/${foundProperty.propertyHash}`);
                setIsModalOpen(false);
            } else {
                setError("No se encontró ninguna propiedad con ese código.");
            }

        } catch (err: any) {
            setError(err.message || "Error al obtener las propiedades.");
        }
    };

    return (
        <div className="relative font-quicksand">
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#81A781] text-white px-4 py-2 rounded-lg hidden sm:block"
            >
                Buscar Propiedad
            </button>
            <button
                onClick={() => setIsModalOpen(true)}
                className="sm:hidden flex mr-8 items-center justify-center bg-[#81A781] text-white p-3 rounded-full shadow-md hover:bg-[#6e9372] active:scale-95 transition-all"
            >
                <FaSearch className="text-lg" />
            </button>

            {isModalOpen && (
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
                </div>
            )}
        </div>
    );
}

export default SearchCode;
