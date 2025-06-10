'use client';  // Ensure this is a client-side component

import Link from 'next/link';

type Props = {
  service: {
    service_id: number;
    service_name: string;
    description: string;
    duration: number;
    price: number;
    specialty: string;
    provider_id: number;
    provider_name: string;
    provider_bio: string;
    provider_image: string;
  };
};

const ServiceCard = ({ service }: Props) => {
  return (
    <Link href={`/providers/${service.provider_id}`} passHref>
      <div className="service-item">
        {/* Display Service Name */}
        <h3>
          <strong>{service.service_name}</strong>
        </h3>
        
        {/* Display Provider Name */}
        <p><strong>Provider: </strong>{service.provider_name}</p>

        {/* Display Description */}
        {service.description && <p>{service.description}</p>}
        
        {/* Display Duration */}
        <p><strong>Duration: </strong>{service.duration} minutes</p>
        
        {/* Display Price */}
        <p><strong>Price: </strong>${service.price}</p>

        {/* Display More Details Link */}
        <p><strong>More details about this provider</strong></p>

        <div className="provider-info">
          {/* Display Provider Image if available */}
          {service.provider_image && (
            <img
              src={service.provider_image}
              alt={service.provider_name}
              className="provider-image"
            />
          )}
          <div className="provider-text">
            {/* Display Provider Bio */}
            <p>{service.provider_bio}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
