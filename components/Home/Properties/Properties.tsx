import SectionHeading from '@/components/Helper/SectionHeading';
import React, { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Property {
    propertyHash: string;
    title: string;
    bedrooms: number;
    bathrooms: number;
    size: number;
    price: number;
    mainImage: string;
    contrat?: string;
}

const Properties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [totalProperties, setTotalProperties] = useState<number>(0);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            setError(null);
            try {
                const responseTotal = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}?size=1`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!responseTotal.ok) {
                    throw new Error('Error al obtener el total de propiedades');
                }

                const queryString = new URLSearchParams({
                    size: '6',
                    view: 'list',
                }).toString();

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}?${queryString}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Error al obtener las propiedades');
                }

                const data = await response.json();
                setProperties(data.properties);
                setTotalProperties(data.total);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Error desconocido');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);


    const handleClick = (propertyHash: string) => {
        if (!propertyHash) {
            console.error("Property ID is missing:", propertyHash);
            return;
        }

        if (router && router.push) {
            router.push(`/properties/${propertyHash}`);
        } else {
            console.error("Router is not initialized");
        }
    };

    if (loading) {
        return (
            <div className="pt-16 pb-16 bg-[#D9E4C3]">
                <div className="w-[80%] mt-10 mx-auto">
                    <SectionHeading heading="¡Propiedades Recientes!" />
                    <p className="mt-4 text-xl text-gray-600 text-left font-medium">
                        Explora nuestras propiedades más recomendadas y encuentra la opción ideal para ti.
                    </p>
                    <div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center">
                        {Array(6)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={`skeleton-${i}`}
                                    className="bg-[#a6b8a4] rounded-lg animate-pulse h-64"
                                />
                            ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-600">Error: {error}</p>;
    }

    return (
        <div className="pt-16 pb-16 bg-[#D9E4C3]">
            <div className="w-[80%] mt-10 mx-auto">
                <SectionHeading heading="¡Propiedades Recientes!" />
                <p className="mt-4 text-xl text-gray-600 text-left font-medium">
                    Explora nuestras propiedades más recomendadas y encuentra la opción ideal para ti.
                </p>
                <div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center">
                    {properties.length === 0 ? (
                        Array(6)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={`skeleton-${i}`}
                                    className="bg-gray-300 rounded-lg animate-pulse h-64"
                                />
                            ))
                    ) : (
                        properties.map((property, i) => (
                            <div
                                key={property.propertyHash || `property-${i}`}
                                data-aos="fade-up"
                                data-aos-delay={`${i * 50}`}
                                data-aos-duration="800"
                                data-aos-easing="ease-in-out"
                                data-aos-offset="200"
                                onClick={() => handleClick(property.propertyHash)}
                            >
                                <PropertyCard property={property}></PropertyCard>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/properties">
                        <button
                            className="px-6 py-3 bg-[#446447] bg-opacity-70 hover:scale-110 text-white rounded-lg hover:bg-opacity-95 transition duration-300"
                            data-aos="fade-up"
                            data-aos-offset="200"
                        >
                            ¡Ver todas las propiedades!
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Properties;
