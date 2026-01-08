import React from 'react';

export function CustomBuilderPage() {
  console.log('🚀 CustomBuilderPage is executing!');
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 9999,
      backgroundColor: 'red',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        backgroundColor: 'yellow', 
        padding: '50px',
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'black'
      }}>
        CUSTOM BUILDER PAGE IS RENDERING!!!
      </div>
    </div>
  );
}

export default CustomBuilderPage;
