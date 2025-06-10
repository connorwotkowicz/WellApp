

'use client'; 

import React, { createContext, useContext, useState } from 'react';

const TestContext = createContext<any>(null);

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [testData, setTestData] = useState("Hello, World!");
  return (
    <TestContext.Provider value={{ testData }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => useContext(TestContext);
