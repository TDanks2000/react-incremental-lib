import React from 'react';
import { useResourceCap } from 'react-incremental-lib';

export const UseResourceCapExample = () => {
  const { resource, addResource, removeResource } = useResourceCap({
    initialValue: 50,
    max: 100,
  });

  return (
    <div>
      <h1>Resource Cap Example</h1>
      <p>Resource: {resource} / 100</p>
      <button onClick={() => addResource(10)}>Add 10</button>
      <button onClick={() => removeResource(10)}>Remove 10</button>
    </div>
  );
};
