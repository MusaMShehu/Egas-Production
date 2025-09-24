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

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/support-tickets');
      const data = await response.json();
      
      if (response.ok) {
        setTickets(data.tickets);
      } else {
        setError(data.message || 'Failed to fetch support tickets');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/support-tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
        ));
        
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
        
        return { success: true, message: 'Ticket status updated successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to update ticket status' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const addResponse = async (ticketId, message, attachments = []) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await fetch(`/api/admin/support-tickets/${ticketId}/respond`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTickets(tickets.map(ticket => 
          ticket._id === ticketId ? data.ticket : ticket
        ));
        
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(data.ticket);
        }
        
        return { success: true, message: 'Response added successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to add response' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    // Filter by status
    if (filters.status !== 'all' && ticket.status !== filters.status) {
      return false;
    }
    
    // Filter by category
    if (filters.category !== 'all' && ticket.category !== filters.category) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        ticket.ticketId.toLowerCase().includes(searchTerm) ||
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.user?.firstName?.toLowerCase().includes(searchTerm) ||
        ticket.user?.lastName?.toLowerCase().includes(searchTerm) ||
        ticket.user?.email?.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTicket(null);
  };

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
          <button onClick={fetchTickets} className="btn-refresh">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <SupportTicketFilters filters={filters} onFilterChange={setFilters} />
      
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