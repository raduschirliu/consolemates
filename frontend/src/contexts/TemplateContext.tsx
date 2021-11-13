import axios from 'axios';
import React, { useState } from 'react';

interface ITemplateContext {
  children: any;
};

const API_URL = process.env['REACT_APP_API_URL'] || 'localhost:8000';
const TemplateContext = React.createContext<ITemplateContext>(null as any);

export const TemplateProvider = ({ children }: { children: any }) => {
  // TODO: Add useful logic if needed
  
  return (
    <TemplateContext.Provider
      value={{
        children,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateContext;