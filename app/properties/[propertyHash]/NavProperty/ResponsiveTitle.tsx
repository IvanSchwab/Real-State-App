"use client";
import React, { useEffect, useState } from 'react'
import NavProperty from './PropertyTitle';

const ResponsiveTitle = ({ propertyHash }: { propertyHash: string }) => {
    const [, setShowNav] = useState(false);
    const [propertyTitle, setPropertyTitle] = useState<string | null>(null);

    const openNavHandler = () => setShowNav(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        if (!apiUrl || !apiKey) {
            console.error('Missing API configuration');
            return;
        }

        const fetchPropertyTitle = async () => {
            try {
                const response = await fetch(
                    `${apiUrl}properties/${propertyHash}?oauth_token=${apiKey}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Error al obtener el título de la propiedad');
                }

                const data = await response.json();

                const { title } = data;

                if (title) {
                    setPropertyTitle(title);
                } else {
                    console.error('Título no disponible');
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchPropertyTitle();
    }, [propertyHash]);

    return (
        <div className="z-0">
            {propertyTitle ? (
                <NavProperty openNav={openNavHandler} propertyTitle={propertyTitle} />
            ) : (
                <h2></h2>
            )}
        </div>
    );

};

export default ResponsiveTitle;
