// components/ImportModal.js
import React, { useState, useRef } from 'react';
import { 
  FaTimes, 
  FaCloudUploadAlt, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaSpinner, 
  FaUpload 
} from 'react-icons/fa';

const ImportModal = ({ onClose, onImportSuccess }) => {
  const [importStep, setImportStep] = useState('upload'); // 'upload', 'map', 'review', 'complete'
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [importResults, setImportResults] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);

  const requiredFields = ['firstName', 'lastName', 'email', 'role'];
  const optionalFields = ['phone', 'isActive', 'isVerified'];

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(csv|json)$/)) {
      alert('Please select a CSV or JSON file');
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      
      if (file.name.endsWith('.csv')) {
        parseCSV(content);
      } else if (file.name.endsWith('.json')) {
        parseJSON(content);
      }
    };
    
    reader.readAsText(file);
  };

  const parseCSV = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    setFileData(data);
    autoMapColumns(headers);
    setImportStep('map');
  };

  const parseJSON = (content) => {
    try {
      const data = JSON.parse(content);
      if (!Array.isArray(data)) {
        throw new Error('JSON file should contain an array of users');
      }
      
      setFileData(data);
      const headers = Object.keys(data[0] || {});
      autoMapColumns(headers);
      setImportStep('map');
    } catch (error) {
      alert('Invalid JSON file: ' + error.message);
    }
  };

  const autoMapColumns = (headers) => {
    const mapping = {};
    const fieldMappings = {
      'first name': 'firstName',
      'firstname': 'firstName',
      'fname': 'firstName',
      'last name': 'lastName',
      'lastname': 'lastName',
      'lname': 'lastName',
      'email': 'email',
      'phone': 'phone',
      'role': 'role',
      'status': 'isActive',
      'active': 'isActive',
      'verified': 'isVerified'
    };

    headers.forEach(header => {
      const normalizedHeader = header.toLowerCase().trim();
      mapping[header] = fieldMappings[normalizedHeader] || '';
    });

    setColumnMapping(mapping);
  };

  const validateData = (data) => {
    const errors = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 1;
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field]) {
          errors.push(`Row ${rowNumber}: ${field} is required`);
        }
      });
      
      // Validate email format
      if (row.email && !isValidEmail(row.email)) {
        errors.push(`Row ${rowNumber}: Invalid email format`);
      }
      
      // Validate role
      if (row.role && !['admin', 'manager', 'user', 'viewer'].includes(row.role)) {
        errors.push(`Row ${rowNumber}: Invalid role. Must be one of: admin, manager, user, viewer`);
      }
    });
    
    return errors;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleImport = async () => {
    const mappedData = fileData.map(row => {
      const mappedRow = {};
      Object.entries(columnMapping).forEach(([fileColumn, systemField]) => {
        if (systemField && row[fileColumn] !== undefined) {
          // Convert string values to appropriate types
          let value = row[fileColumn];
          
          if (systemField === 'isActive' || systemField === 'isVerified') {
            value = value === 'true' || value === '1' || value === 'yes' || value === 'active';
          }
          
          mappedRow[systemField] = value;
        }
      });
      return mappedRow;
    });

    const errors = validateData(mappedData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsImporting(true);
    setValidationErrors([]);

    try {
      const response = await fetch('https://egas-server-1.onrender.com/api/v1/admin/users/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ users: mappedData })
      });

      const result = await response.json();

      if (response.ok) {
        setImportResults({
          success: true,
          imported: result.importedCount || mappedData.length,
          failed: result.failedCount || 0,
          errors: result.errors || []
        });
        setImportStep('complete');
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        throw new Error(result.message || 'Import failed');
      }
    } catch (error) {
      setImportResults({
        success: false,
        error: error.message
      });
      setImportStep('complete');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      parseFile(droppedFile);
    }
  };

  const resetImport = () => {
    setFile(null);
    setFileData([]);
    setColumnMapping({});
    setImportResults(null);
    setValidationErrors([]);
    setImportStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderUploadStep = () => (
    <div className="aum-import-step">
      <div 
        className="aum-file-drop-zone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <FaCloudUploadAlt />
        <h3>Drop your file here or click to browse</h3>
        <p>Supports CSV and JSON files</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="aum-file-requirements">
        <h4>File Requirements:</h4>
        <ul>
          <li>CSV or JSON format</li>
          <li>Required fields: firstName, lastName, email, role</li>
          <li>Optional fields: phone, isActive, isVerified</li>
          <li>Maximum file size: 10MB</li>
        </ul>
      </div>
    </div>
  );

  const renderMapStep = () => (
    <div className="aum-import-step">
      <h3>Map Columns</h3>
      <p>Match your file columns to the system fields</p>
      
      <div className="aum-mapping-table">
        <div className="aum-mapping-header">
          <span>File Column</span>
          <span>System Field</span>
        </div>
        {Object.keys(columnMapping).map(column => (
          <div key={column} className="aum-mapping-row">
            <span>{column}</span>
            <select
              value={columnMapping[column]}
              onChange={(e) => setColumnMapping(prev => ({
                ...prev,
                [column]: e.target.value
              }))}
            >
              <option value="">-- Ignore Field --</option>
              <optgroup label="Required Fields">
                {requiredFields.map(field => (
                  <option key={field} value={field}>
                    {field} *
                  </option>
                ))}
              </optgroup>
              <optgroup label="Optional Fields">
                {optionalFields.map(field => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        ))}
      </div>

      {validationErrors.length > 0 && (
        <div className="aum-validation-errors">
          <h4>Validation Errors:</h4>
          {validationErrors.map((error, index) => (
            <div key={index} className="aum-error-item">
              {error}
            </div>
          ))}
        </div>
      )}

      <div className="aum-preview-data">
        <h4>Data Preview (First 5 rows):</h4>
        <div className="aum-preview-table">
          {fileData.slice(0, 5).map((row, index) => (
            <div key={index} className="aum-preview-row">
              {Object.values(row).slice(0, 5).map((value, cellIndex) => (
                <span key={cellIndex} className="aum-preview-cell">
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="aum-import-step">
      {importResults.success ? (
        <div className="aum-import-success">
          <FaCheckCircle className="aum-success-icon" />
          <h3>Import Completed Successfully!</h3>
          <div className="aum-import-stats">
            <div className="aum-stat-item">
              <span className="aum-stat-number">{importResults.imported}</span>
              <span className="aum-stat-label">Users Imported</span>
            </div>
            {importResults.failed > 0 && (
              <div className="aum-stat-item">
                <span className="aum-stat-number aum-failed">{importResults.failed}</span>
                <span className="aum-stat-label">Failed</span>
              </div>
            )}
          </div>
          
          {importResults.errors.length > 0 && (
            <div className="aum-import-errors">
              <h4>Errors:</h4>
              {importResults.errors.map((error, index) => (
                <div key={index} className="aum-error-item">
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="aum-import-failed">
          <FaExclamationCircle className="aum-error-icon" />
          <h3>Import Failed</h3>
          <p>{importResults.error}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="aum-modal-overlay">
      <div className="aum-modal-content aum-import-modal">
        <div className="aum-modal-header">
          <h2>Import Users</h2>
          <button onClick={onClose} className="aum-modal-close">
            <FaTimes />
          </button>
        </div>

        <div className="aum-modal-body">
          {importStep === 'upload' && renderUploadStep()}
          {importStep === 'map' && renderMapStep()}
          {importStep === 'complete' && renderCompleteStep()}
        </div>

        <div className="aum-modal-footer">
          {importStep === 'upload' && (
            <button onClick={onClose} className="aum-btn aum-btn-outline">
              Cancel
            </button>
          )}
          
          {importStep === 'map' && (
            <>
              <button onClick={() => setImportStep('upload')} className="aum-btn aum-btn-outline">
                Back
              </button>
              <button 
                onClick={handleImport} 
                className="aum-btn aum-btn-primary"
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <FaSpinner className="aum-fa-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Import Users
                  </>
                )}
              </button>
            </>
          )}
          
          {importStep === 'complete' && (
            <>
              <button onClick={resetImport} className="aum-btn aum-btn-outline">
                Import Another File
              </button>
              <button onClick={onClose} className="aum-btn aum-btn-primary">
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;