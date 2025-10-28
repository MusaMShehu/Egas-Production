// components/SupportManagement.js
import React, { useState, useEffect } from 'react';
import SupportTicketList from './SupportTicketList';
import SupportTicketDetails from './SupportTicketDetails';
import SupportTicketFilters from './SupportTicketFilters';
import './SupportManagement.css';

const SupportManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'details'
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  // Base API URL - adjust based on your environment
  const API_BASE_URL = 'http://localhost:5000';

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token")?.replace(/^"|"$/g, "") || '';
  };

  // Get auth headers for requests
  const getAuthHeaders = (isFormData = false) => {
    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      
      // Add filters to query params if not 'all'
      if (filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      if (filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const url = `${API_BASE_URL}/api/v1/admin/supports?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok) {
        // Handle both response formats for backward compatibility
        setTickets(data.data?.tickets || data.tickets || []);
      } else {
        setError(data.message || 'Failed to fetch support tickets');
      }

    } catch (error) {
      console.error('Fetch tickets error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refetch tickets when filters change
  useEffect(() => {
    fetchTickets();
  }, [filters.status, filters.category]);

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== '') {
        fetchTickets();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/supports/${ticketId}/status`, 
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updatedTicket = data.data?.ticket || data.ticket;
        
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId ? updatedTicket : ticket
        ));
        
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(updatedTicket);
        }
        
        return { 
          success: true, 
          message: data.message || 'Ticket status updated successfully' 
        };
      } else {
        return { 
          success: false, 
          message: data.message || 'Failed to update ticket status' 
        };
      }
    } catch (error) {
      console.error('Update ticket status error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const addResponse = async (ticketId, message, attachments = []) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/supports/${ticketId}/respond`, 
        {
          method: 'POST',
          headers: getAuthHeaders(true),
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updatedTicket = data.data?.ticket || data.ticket;
        
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId ? updatedTicket : ticket
        ));
        
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(updatedTicket);
        }
        
        return { 
          success: true, 
          message: data.message || 'Response added successfully' 
        };
      } else {
        return { 
          success: false, 
          message: data.message || 'Failed to add response' 
        };
      }
    } catch (error) {
      console.error('Add response error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/supports/${ticketId}`,
        {
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (response.ok) {
        return data.data?.ticket || data.ticket;
      } else {
        throw new Error(data.message || 'Failed to fetch ticket details');
      }
    } catch (error) {
      console.error('Fetch ticket details error:', error);
      throw error;
    }
  };

  const handleViewTicket = async (ticket) => {
    try {
      // Fetch fresh ticket data to ensure we have the latest responses
      const freshTicket = await fetchTicketDetails(ticket._id);
      setSelectedTicket(freshTicket);
      setView('details');
    } catch (error) {
      // If fetching fresh data fails, use the existing ticket data
      console.warn('Could not fetch fresh ticket data, using cached data:', error);
      setSelectedTicket(ticket);
      setView('details');
    }
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTicket(null);
    // Refresh the list when returning from details view
    fetchTickets();
  };

  // Filter tickets locally for immediate UI updates (optional)
  const filteredTickets = tickets.filter(ticket => {
    // Since we're now fetching filtered data from the API,
    // this local filtering is mostly for search functionality
    // and as a fallback
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        ticket.ticketId?.toLowerCase().includes(searchTerm) ||
        ticket.subject?.toLowerCase().includes(searchTerm) ||
        ticket.user?.firstName?.toLowerCase().includes(searchTerm) ||
        ticket.user?.lastName?.toLowerCase().includes(searchTerm) ||
        ticket.user?.email?.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  if (view === 'details' && selectedTicket) {
    return (
      <SupportTicketDetails
        ticket={selectedTicket}
        onBack={handleBackToList}
        onUpdateTicketStatus={updateTicketStatus}
        onAddResponse={addResponse}
      />
    );
  }

  return (
    <div className="support-management">
      <div className="support-header">
        <h1>Support Ticket Management</h1>
        <div className="header-actions">
          <button 
            onClick={fetchTickets} 
            className="btn-refresh"
            disabled={loading}
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i> 
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <SupportTicketFilters 
        filters={filters} 
        onFilterChange={setFilters} 
      />
      
      <SupportTicketList
        tickets={filteredTickets}
        loading={loading}
        error={error}
        onViewTicket={handleViewTicket}
        onUpdateTicketStatus={updateTicketStatus}
      />
    </div>
  );
};

export default SupportManagement;