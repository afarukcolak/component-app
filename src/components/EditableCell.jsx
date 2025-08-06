import React, { useState } from 'react';

export default function EditableCell({ value, onChange, className = '' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyPress={handleKeyPress}
        onBlur={handleSave}
        className={`w-full bg-gray-500 border-2 border-blue-400 rounded-xl p-2 text-white focus:outline-none ${className}`}
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`w-full p-2 cursor-pointer hover:bg-gray-500 rounded-xl transition-colors ${className}`}
    >
      {value || 'Click to edit'}
    </div>
  );
}
