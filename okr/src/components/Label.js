import React from 'react';

export const Label = ({ children, type = 'default' }) => (
  <span className={`tag tag-${type}`}>{children}</span>
);

export default Label;
