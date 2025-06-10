'use client';

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

interface Service {
  service_id: number;
  provider_id: number;
  service_name: string;
  description: string;
  price: number;
  duration: number;
  specialty: string;
}

const ManageServices: React.FC = () => {
  const { user, initialized } = useContext(AuthContext);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    if (!initialized) return;

    const fetchServices = async () => {
      try {
        const res = await axios.get('/api/services');
        
        if (res.status === 200) {
          const data = res.data as Service[];
          setServices(data);
        } else {
          console.error("Failed to fetch services: ", res.status);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, [initialized]);

  const deleteService = async (id: number) => {
    try {
      const response = await axios.delete(`/api/services/${id}`);
      if (response.status === 200) {
        setServices(services.filter(service => service.service_id !== id));
        toast.success('Service deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service!'); 
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        [e.target.name]: e.target.value,
      });
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingService) {
      try {
        const response = await axios.put<Service>(`/api/services/${editingService.service_id}`, editingService);

        setServices(services.map(service =>
          service.service_id === editingService.service_id ? response.data : service
        ));

        setEditingService(null); 
        toast.success('Service updated successfully!'); 
      } catch (error) {
        console.error('Error updating service:', error);
        toast.error('Failed to update service!'); 
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manage-services">
      <h1>Manage Services</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Provider ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Duration (Minutes)</th>
            <th>Specialty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.service_id}>
              <td>{service.service_id || 'N/A'}</td>
              <td>{service.provider_id || 'N/A'}</td>
              <td>{service.service_name || 'No Name'}</td>
              <td>{service.description || 'No Description'}</td>
              <td>${service.price || 'N/A'}</td>
              <td>{service.duration || 'N/A'}</td>
              <td>{service.specialty || 'N/A'}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingService(service)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => deleteService(service.service_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingService && (
        <div className="modal show">
          <div className="modal-content">
            <span className="modal-close" onClick={() => setEditingService(null)}>&times;</span>
            <h2>Edit Service</h2>
            <form onSubmit={submitEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="service_name"
                    value={editingService.service_name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={editingService.description}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={editingService.price}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Duration:</label>
                  <input
                    type="number"
                    name="duration"
                    value={editingService.duration}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Specialty:</label>
                  <input
                    type="text"
                    name="specialty"
                    value={editingService.specialty}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-button" type="submit">Save</button>
                <button className="modal-button" type="button" onClick={() => setEditingService(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageServices;
