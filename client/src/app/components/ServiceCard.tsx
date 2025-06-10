'use client';  

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
      
        <h3>
          <strong>{service.service_name}</strong>
        </h3>
        
       
        <p><strong>Provider: </strong>{service.provider_name}</p>

        
        {service.description && <p>{service.description}</p>}
        
 
        <p><strong>Duration: </strong>{service.duration} minutes</p>
        
      
        <p><strong>Price: </strong>${service.price}</p>

     
        <p><strong>More details about this provider</strong></p>

        <div className="provider-info">
      
          {service.provider_image && (
            <img
              src={service.provider_image}
              alt={service.provider_name}
              className="provider-image"
            />
          )}
          <div className="provider-text">
      
            <p>{service.provider_bio}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
