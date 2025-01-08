import React from 'react';

export function Input({ reference, placeholder }) {
  return (
    <div>
      <input 
        ref={reference} 
        placeholder={placeholder} 
        type='text' 
        className='px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm' 
      />
    </div>
  );
}
