'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

interface Provider {
  id: number;
  name: string;
  service: string;
  price: number;
}




const ManageProviders: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  // Fetch providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get<Provider[]>('/api/providers');
        setProviders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Delete provider
  const deleteProvider = async (id: number) => {
    try {
      const response = await axios.delete(`/api/providers/${id}`);
      if (response.status === 200) {
        setProviders(prevProviders => prevProviders.filter(provider => provider.id !== id));
        toast.success('Provider deleted successfully!'); 
      }
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Failed to delete provider!'); 
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingProvider) {
      setEditingProvider({
        ...editingProvider,
        [e.target.name]: e.target.value
      });
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProvider) {
      try {

        const response = await axios.put<Provider>(`/api/providers/${editingProvider.id}`, editingProvider);

      
        const updatedProviders = providers.map(provider =>
          provider.id === editingProvider.id ? response.data : provider
        );

        setProviders(updatedProviders);
        setEditingProvider(null);  
        toast.success('Provider updated successfully!'); 
      } catch (error) {
        console.error('Error updating provider:', error);
        toast.error('Failed to update provider!'); 
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="manage-providers">
      <h1>Manage Providers</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Service</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>{provider.id}</td>
              <td>{provider.name}</td>
              <td>{provider.service}</td>
              <td>${provider.price}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => setEditingProvider(provider)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => deleteProvider(provider.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


{editingProvider && (
  <div className="modal show">
    <div className="modal-content">
      <span className="modal-close" onClick={() => setEditingProvider(null)}>&times;</span>
      <h2>Edit Provider</h2>
      <form onSubmit={submitEdit}>
        <div className="modal-body">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editingProvider.name}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label>Service:</label>
            <input
              type="text"
              name="service"
              value={editingProvider.service}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={editingProvider.price}
              onChange={handleEditChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-button" type="submit">Save</button>
          <button className="modal-button" type="button" onClick={() => setEditingProvider(null)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}


    
      <ToastContainer />
    </div>
  );
};

export default ManageProviders;
