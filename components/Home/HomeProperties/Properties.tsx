import SectionHeading from '@/components/common/SectionHeading';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Property } from '@/constant/constant';
import PropertyCard from './PropertyCard';


const Properties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [, setTotalProperties] = useState<number>(0);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            setError(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;

            if (!apiUrl || !apiKey) {
                console.error('Missing API configuration');
                setError('Missing API configuration');
                setLoading(false);
                return;
            }

            try {
                const responseTotal = await fetch(
                    `${apiUrl}properties?size=1&oauth_token=${apiKey}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!responseTotal.ok) {
                    console.error('Error al obtener el total de propiedades:', responseTotal.statusText);
                    throw new Error('Error al obtener el total de propiedades');
                }

                const totalData = await responseTotal.json();
                const totalProperties = totalData.total || 0;

                const queryString = new URLSearchParams({
                    size: '6',
                    view: 'list',
                }).toString();

                const response = await fetch(
                    `${apiUrl}properties?${queryString}&oauth_token=${apiKey}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    console.error('Error al obtener las propiedades:', response.statusText);
                    throw new Error('Error al obtener las propiedades');
                }

                const data = await response.json();
                setProperties(data.properties || []);
                setTotalProperties(totalProperties);
            } catch (err) {
                if (err instanceof Error) {
                    console.error('Fetch error:', err.message);
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


    const handleClick = (event: React.MouseEvent<HTMLDivElement>, propertyHash: string) => {
        if (!propertyHash) {
            console.error("Property ID is missing:", propertyHash);
            return;
        }

        const url = `/properties/${propertyHash}`;

        if (event.button === 1) {
            window.open(url, "_blank");
            event.preventDefault();
        } else if (event.ctrlKey || event.metaKey) {
            window.open(url, "_blank");
        } else if (router && router.push) {
            router.push(url);
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
                                key={property.propertyHash}
                                data-aos="fade-up"
                                data-aos-delay={`${i * 50}`}
                                data-aos-duration="400"
                                data-aos-easing="ease-in-out"
                                data-aos-offset="200"
                                onMouseDown={(event) => handleClick(event, property.propertyHash)}
                            >
                                <PropertyCard property={property}></PropertyCard>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/properties">
                        <button
                            className="px-6 py-3 bg-[#446447] bg-opacity-70 hover:scale-110 text-white rounded-lg hover:bg-opacity-95 transition duration-100"
                            data-aos="fade-up"
                            data-aos-duration="300"
                            data-aos-offset="100"
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
