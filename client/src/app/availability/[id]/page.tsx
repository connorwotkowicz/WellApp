// // app/availability/[id]/page.tsx
// import { notFound } from 'next/navigation';
// // import db from '@src/app/lib/db';
// // import AvailabilityCalendar from '../../components/AvailCalendar';

// interface AvailabilityPageProps {
//   params: { id: string };
// }

// export default async function AvailabilityPage({ params }: AvailabilityPageProps) {
//   const providerId = parseInt(params.id);
  
//   // Validate provider ID
//   if (isNaN(providerId)) {
//     return notFound();
//   }

//   try {
//     // Fetch provider details
//     const providerRes = await db.query(
//       `SELECT id, name, specialty, bio 
//        FROM users 
//        WHERE id = $1 AND role = 'provider'`,
//       [providerId]
//     );

//     // Fetch availability slots
//     const availabilityRes = await db.query(
//       `SELECT id, start_time, end_time, booked
//        FROM availability 
//        WHERE provider_id = $1 
//        ORDER BY start_time ASC`,
//       [providerId]
//     );

//     // Handle provider not found
//     if (providerRes.rows.length === 0) {
//       return notFound();
//     }

//     const provider = providerRes.rows[0];
//     const availability = availabilityRes.rows;

//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             {provider.name}'s Availability
//           </h1>
//           {provider.specialty && (
//             <p className="text-lg text-gray-600 mb-4">
//               Specialty: {provider.specialty}
//             </p>
//           )}
//           {provider.bio && (
//             <p className="text-gray-700 mb-6">{provider.bio}</p>
//           )}
//         </div>

//         <AvailabilityCalendar 
//           provider={provider} 
//           availability={availability} 
//         />
//       </div>
//     );
//   } catch (error) {
//     console.error('Error loading availability:', error);
//     return (
//       <div className="max-w-4xl mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-red-600 mb-4">
//           Error Loading Availability
//         </h1>
//         <p className="text-gray-700">
//           We're having trouble loading the provider's availability. Please try again later.
//         </p>
//       </div>
//     );
//   }
// }