// components/reports/CustomReportBuilder.js
import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import './ReportStyles/CustomReportBuilder.css';

const CustomReportBuilder = ({ 
  availableData, 
  onCustomReportGenerate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    sections: [],
    layout: 'grid',
    theme: 'light',
    filters: {},
    charts: []
  });
  const [availableComponents, setAvailableComponents] = useState([
    { id: 'metrics-grid', type: 'metrics', name: 'Metrics Grid', icon: 'fas fa-chart-bar' },
    { id: 'sales-chart', type: 'chart', name: 'Sales Chart', icon: 'fas fa-chart-line' },
    { id: 'data-table', type: 'table', name: 'Data Table', icon: 'fas fa-table' },
    { id: 'user-metrics', type: 'metrics', name: 'User Metrics', icon: 'fas fa-users' },
    { id: 'revenue-chart', type: 'chart', name: 'Revenue Chart', icon: 'fas fa-money-bill-wave' },
    { id: 'inventory-table', type: 'table', name: 'Inventory Table', icon: 'fas fa-boxes' }
  ]);
  const [selectedComponents, setSelectedComponents] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'available' && destination.droppableId === 'selected') {
      // Move from available to selected
      const component = availableComponents[source.index];
      const newAvailable = [...availableComponents];
      const newSelected = [...selectedComponents];
      
      newAvailable.splice(source.index, 1);
      newSelected.splice(destination.index, 0, component);
      
      setAvailableComponents(newAvailable);
      setSelectedComponents(newSelected);
    } else if (source.droppableId === 'selected' && destination.droppableId === 'selected') {
      // Reorder selected components
      const newSelected = [...selectedComponents];
      const [reorderedItem] = newSelected.splice(source.index, 1);
      newSelected.splice(destination.index, 0, reorderedItem);
      setSelectedComponents(newSelected);
    } else if (source.droppableId === 'selected' && destination.droppableId === 'available') {
      // Move from selected to available
      const component = selectedComponents[source.index];
      const newAvailable = [...availableComponents];
      const newSelected = [...selectedComponents];
      
      newSelected.splice(source.index, 1);
      newAvailable.splice(destination.index, 0, component);
      
      setAvailableComponents(newAvailable);
      setSelectedComponents(newSelected);
    }
  };

  const handleComponentConfig = (componentId, config) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === componentId ? { ...section, config } : section
      )
    }));
  };

  const handleGenerateReport = () => {
    const customReport = {
      ...reportConfig,
      sections: selectedComponents,
      timestamp: new Date().toISOString(),
      id: `custom-${Date.now()}`
    };
    
    onCustomReportGenerate?.(customReport);
    setIsOpen(false);
    
    // Reset form
    setReportConfig({
      name: '',
      description: '',
      sections: [],
      layout: 'grid',
      theme: 'light',
      filters: {},
      charts: []
    });
    setSelectedComponents([]);
  };

  const renderComponentPreview = (component) => {
    switch (component.type) {
      case 'metrics':
        return (
          <div className="component-preview metrics">
            <div className="preview-metric">
              <div className="preview-value">--</div>
              <div className="preview-label">Metric</div>
            </div>
            <div className="preview-metric">
              <div className="preview-value">--</div>
              <div className="preview-label">Metric</div>
            </div>
          </div>
        );
      case 'chart':
        return (
          <div className="component-preview chart">
            <div className="preview-chart-bar"></div>
            <div className="preview-chart-bar"></div>
            <div className="preview-chart-bar"></div>
          </div>
        );
      case 'table':
        return (
          <div className="component-preview table">
            <div className="preview-table-row">
              <div className="preview-table-cell"></div>
              <div className="preview-table-cell"></div>
            </div>
            <div className="preview-table-row">
              <div className="preview-table-cell"></div>
              <div className="preview-table-cell"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="custom-report-builder">
      <button 
        className="btn-builder-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-magic"></i>
        Custom Report Builder
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="builder-panel">
          <div className="builder-header">
            <h3>Custom Report Builder</h3>
            <p>Drag and drop components to create your perfect report</p>
          </div>

          <div className="builder-content">
            <div className="builder-config">
              <div className="config-section">
                <h4>Report Details</h4>
                <div className="form-group">
                  <label>Report Name</label>
                  <input
                    type="text"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter report name"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={reportConfig.description}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this report..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="config-section">
                <h4>Layout & Theme</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Layout</label>
                    <select
                      value={reportConfig.layout}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, layout: e.target.value }))}
                    >
                      <option value="grid">Grid Layout</option>
                      <option value="single">Single Column</option>
                      <option value="dashboard">Dashboard</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Theme</label>
                    <select
                      value={reportConfig.theme}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, theme: e.target.value }))}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="blue">Blue</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="builder-workspace">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="components-panel">
                  <div className="components-section">
                    <h4>Available Components</h4>
                    <Droppable droppableId="available">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="components-list available"
                        >
                          {availableComponents.map((component, index) => (
                            <Draggable
                              key={component.id}
                              draggableId={component.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="component-item"
                                >
                                  <i className={component.icon}></i>
                                  <span>{component.name}</span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>

                  <div className="components-section">
                    <h4>Report Canvas</h4>
                    <Droppable droppableId="selected">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="components-list selected"
                        >
                          {selectedComponents.length > 0 ? (
                            selectedComponents.map((component, index) => (
                              <Draggable
                                key={component.id}
                                draggableId={component.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="component-item selected"
                                  >
                                    <div className="component-header">
                                      <i className={component.icon}></i>
                                      <span>{component.name}</span>
                                      <button 
                                        className="btn-remove"
                                        onClick={() => {
                                          const newSelected = selectedComponents.filter(c => c.id !== component.id);
                                          setSelectedComponents(newSelected);
                                          setAvailableComponents(prev => [...prev, component]);
                                        }}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                    <div className="component-preview-container">
                                      {renderComponentPreview(component)}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className="empty-canvas">
                              <i className="fas fa-hand-pointer"></i>
                              <p>Drag components here to build your report</p>
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </DragDropContext>

              <div className="builder-actions">
                <button 
                  className="btn-generate"
                  onClick={handleGenerateReport}
                  disabled={!reportConfig.name || selectedComponents.length === 0}
                >
                  <i className="fas fa-rocket"></i>
                  Generate Custom Report
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomReportBuilder;