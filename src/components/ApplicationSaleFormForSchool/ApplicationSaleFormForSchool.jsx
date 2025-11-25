import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ApplicationSaleFormForSchool.module.css';

const ApplicationSaleFormForSchool = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationData = location.state?.applicationData;

  return (
    <div style={{ padding: '20px' }}>
      <h2>School Application Sale</h2>
      {applicationData && (
        <div>
          <p><strong>Application No:</strong> {applicationData.applicationNo}</p>
          <p><strong>PRO:</strong> {applicationData.pro}</p>
          <p><strong>Campus:</strong> {applicationData.campus}</p>
          <p><strong>DGM:</strong> {applicationData.dgm}</p>
          <p><strong>Zone:</strong> {applicationData.zone}</p>
          <p><strong>Status:</strong> {applicationData.status}</p>
        </div>
      )}
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default ApplicationSaleFormForSchool;

