

'use client'; 

import React from 'react';
import { useTestContext } from '../context/TestContext';

const TestComponent: React.FC = () => {
  const { testData } = useTestContext();
  return <div>{testData}</div>;
};

export default TestComponent;
