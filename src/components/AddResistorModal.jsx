import React, { useState, useEffect } from 'react';

export default function AddResistorModal({ isOpen, defaultNumber, onAdd, onCancel }) {
  const [number, setNumber] = useState(defaultNumber);
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('K');

  useEffect(() => {
    if (isOpen) {
      setNumber(defaultNumber);
      setValue('');
      setUnit('K');
    }
  }, [isOpen, defaultNumber]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!value) return;
    onAdd({ number, value: `${value} ${unit}`, used: false });
  };

  // Enter tuşu ile ekleme
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="bg-gray-700 border-2 border-gray-500 p-8 rounded-3xl shadow-2xl w-96 mx-auto">
      <h2 className="text-2xl mb-8 text-white font-light text-center">Add Resistor</h2>
      
      <div className="space-y-6">
        <label className="block">
          <span className="block text-sm font-medium mb-3 text-gray-300">Resistor Number</span>
          <input
            type="text"
            value={number}
            onChange={e => setNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-4 bg-gray-600 border-2 border-gray-500 rounded-2xl text-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
            placeholder="R-1"
          />
        </label>
        
        <label className="block">
          <span className="block text-sm font-medium mb-3 text-gray-300">Value</span>
          <div className="flex">
            <input
              type="number"
              step="any"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-4 bg-gray-600 border-2 border-gray-500 rounded-l-2xl text-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
              placeholder="5.6"
            />
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="p-4 bg-gray-600 border-2 border-l-0 border-gray-500 rounded-r-2xl text-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
            >
              <option value="Ω">Ω</option>
              <option value="K">K</option>
              <option value="M">M</option>
            </select>
          </div>
        </label>
        
        {/* Resistor preview */}
        <div className="mb-6">
          <span className="block text-sm font-medium mb-3 text-gray-300">Preview</span>
          <div className="h-16 bg-yellow-600 rounded-2xl flex items-center justify-center relative border-2 border-gray-500">
            {value && (
              <div className="flex space-x-2">
                <div className="w-4 h-12 bg-green-500 rounded"></div>
                <div className="w-4 h-12 bg-blue-500 rounded"></div>
                <div className="w-4 h-12 bg-red-500 rounded"></div>
                <div className="w-4 h-12 bg-yellow-400 rounded"></div>
              </div>
            )}
            <span className="absolute bottom-2 text-sm font-mono text-black bg-white px-2 py-1 rounded">
              {value && `${value}${unit}`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex justify-center space-x-4 pt-8">
        <button 
          onClick={onCancel} 
          className="px-8 py-3 bg-red-500 hover:bg-red-400 text-white rounded-full text-lg transition-all duration-300 shadow-lg"
        >
          Cancel
        </button>
        <button 
          onClick={handleAdd} 
          className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white rounded-full text-lg transition-all duration-300 shadow-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
}
