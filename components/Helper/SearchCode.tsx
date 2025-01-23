import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchCode: React.FC = () => {
    const [searchCode, setSearchCode] = useState("");
    const [error, setError] = useState(""); 
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
            } else {
                setError("No se encontró ninguna propiedad con ese código.");
            }

        } catch (err: any) {
            setError(err.message || "Error al obtener las propiedades.");
        }
    };

    return (
        <div className="right-12 relative flex items-center w-full max-w-[90%] mx-auto z-0">
            <input
                type="text"
                placeholder="Código propiedad"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-[80%] py-2 pl-4 pr-4 text-gray-500 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7C8F7C]"
            />
        </div>
    )
    }

export default SearchCode;
