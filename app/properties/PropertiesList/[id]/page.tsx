import { useRouter } from 'next/router'; 
import { useEffect, useState } from 'react';

const PropertyDetails = () => {
  const router = useRouter();
  const { id } = router.query; 
  const [property, setProperty] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/properties/${id}`) 
        .then((res) => res.json())
        .then((data) => setProperty(data))
        .catch((error) => console.error('Error fetching property:', error));
    }
  }, [id]);

  if (!property) return <div>Loading...</div>;

  return (
    <div>
    </div>
  );
};

export default PropertyDetails;
