import React, { useState } from 'react';
import AddResistorModal from './components/AddResistorModal';
import AddCapacitorModal from './components/AddCapacitorModal';
import EditableCell from './components/EditableCell';
import './index.css';

function App() {
  const [resistors, setResistors] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capacitors, setCapacitors] = useState([]);
  const [nextCapId, setNextCapId] = useState(1);
  const [isCapModalOpen, setIsCapModalOpen] = useState(false);

  // Problem 1 çözümü: Kullanılmayan en küçük numarayı bul
  const getNextAvailableId = () => {
    const usedNumbers = resistors.map(r => parseInt(r.number.replace('R-', '')));
    for (let i = 1; i <= usedNumbers.length + 1; i++) {
      if (!usedNumbers.includes(i)) {
        return i;
      }
    }
    return usedNumbers.length + 1;
  };

  // Capacitor için kod üretimi - değerden 3 haneli kod üret
  const generateCapacitorCode = (value) => {
    // Değeri parse et (örn: "5.6 µF" -> 5.6)
    const numericValue = parseFloat(value.split(' ')[0]) || 0;
    
    if (numericValue === 0) return "0 0 0";
    
    // Basit bir algoritma: ilk iki hane + sıfır sayısı
    const valueStr = numericValue.toString().replace('.', '');
    const firstDigit = valueStr[0] || '0';
    const secondDigit = valueStr[1] || '0';
    const thirdDigit = valueStr.length > 2 ? valueStr[2] : '0';
    
    return `${firstDigit} ${secondDigit} ${thirdDigit}`;
  };

  // Kapasitör kodlama matematiği
  const calculateCapacitorCode = (value) => {
    if (!value) return "0 0 0";

    const numericValue = parseFloat(value.split(' ')[0]);
    const unit = value.split(' ')[1];

    let multiplier = 0;
    if (unit === "pF") multiplier = 1;
    else if (unit === "nF") multiplier = 1000;
    else if (unit === "µF") multiplier = 1000000;

    const picofaradValue = numericValue * multiplier;
    const code = Math.round(picofaradValue).toString();

    if (code.length < 3) {
      return `${code[0] || "0"} ${code[1] || "0"} ${code[2] || "0"}`;
    }

    const firstTwoDigits = code.slice(0, 2);
    const zerosCount = code.length - 2;

    return `${firstTwoDigits.split('').join(' ')} ${zerosCount}`;
  };

  const openModal = () => setIsModalOpen(true);
  const handleAdd = (resistor) => {
    setResistors([...resistors, resistor]);
    setIsModalOpen(false);
  };
  const handleCancel = () => setIsModalOpen(false);
  
  // Problem 2 çözümü: Resistor silme fonksiyonu
  const deleteResistor = (index) => {
    setResistors(resistors.filter((_, i) => i !== index));
  };
  
  const toggleUsed = (index) => {
    setResistors(
      resistors.map((item, i) =>
        i === index ? { ...item, used: !item.used } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-light text-white tracking-wider lowercase">component app</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-12 mb-16">
        <button 
          onClick={openModal} 
          disabled={isCapModalOpen}
          className="px-16 py-6 bg-gray-600 hover:bg-gray-500 text-white text-xl font-normal rounded-full transition-all duration-300 disabled:bg-gray-700 disabled:opacity-50 shadow-lg lowercase"
        >
          add resistor
        </button>
        <button 
          onClick={() => setIsCapModalOpen(true)} 
          disabled={isModalOpen}
          className="px-16 py-6 bg-gray-600 hover:bg-gray-500 text-white text-xl font-normal rounded-full transition-all duration-300 disabled:bg-gray-700 disabled:opacity-50 shadow-lg lowercase"
        >
          add capacitor
        </button>
      </div>

      {/* Components List Container - Telefon görünümü */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-600 rounded-[3rem] p-8 shadow-2xl" style={{borderRadius: '3rem'}}>
          
          {/* Resistor Modal - positioned relative to add resistor button */}
          {isModalOpen && (
            <div className="fixed top-32 left-1/2 transform -translate-x-1/2 -translate-y-8 z-50">
              <AddResistorModal
                isOpen={isModalOpen}
                defaultNumber={`R-${getNextAvailableId()}`}
                onAdd={handleAdd}
                onCancel={handleCancel}
              />
            </div>
          )}

          {/* Capacitor Modal - positioned relative to add capacitor button */}
          {isCapModalOpen && (
            <div className="fixed top-32 right-1/2 transform translate-x-1/2 -translate-y-8 z-50">
              <AddCapacitorModal
                isOpen={isCapModalOpen}
                defaultNumber={`C-${nextCapId}`}
                onAdd={(cap) => {
                  setCapacitors([...capacitors, cap]);
                  setNextCapId(nextCapId + 1);
                  setIsCapModalOpen(false);
                }}
                onCancel={() => setIsCapModalOpen(false)}
              />
            </div>
          )}

          {/* Component Items */}
          <div className="space-y-6">
            {/* Resistors */}
            {resistors.map((r, i) => (
              <div key={`resistor-${i}`} className="bg-black rounded-[2rem] p-6 flex items-center space-x-6" style={{borderRadius: '2rem'}}>
                {/* Delete Button */}
                <button
                  onClick={() => deleteResistor(i)}
                  className="w-20 h-20 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 font-light"
                >
                  ✕
                </button>
                
                {/* Used/Check Button */}
                <button
                  onClick={() => toggleUsed(i)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 font-light ${
                    r.used 
                      ? 'bg-green-500 hover:bg-green-400' 
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                >
                  ✓
                </button>

                {/* Component Info */}
                <div className="flex-1 flex items-center space-x-8">
                  {/* Component Name */}
                  <div className="bg-gray-600 rounded-full px-10 py-5 min-w-[140px] text-center">
                    <EditableCell
                      value={r.number}
                      onChange={(newValue) => {
                        setResistors(
                          resistors.map((item, idx) =>
                            idx === i ? { ...item, number: newValue } : item
                          )
                        );
                      }}
                      className={`text-white text-2xl font-normal ${r.used ? 'opacity-60' : ''}`}
                    />
                  </div>

                  {/* Value */}
                  <div className="bg-gray-600 rounded-full px-10 py-5 min-w-[140px] text-center">
                    <EditableCell
                      value={r.value}
                      onChange={(newValue) => {
                        setResistors(
                          resistors.map((item, idx) =>
                            idx === i ? { ...item, value: newValue } : item
                          )
                        );
                      }}
                      className={`text-white text-2xl font-normal ${r.used ? 'opacity-60' : ''}`}
                    />
                  </div>

                  {/* Color Bands for Resistor - Tasarımdaki gibi */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="bg-yellow-600 rounded-full h-16 flex items-center px-12 space-x-3" style={{borderRadius: '2rem'}}>
                      <div className="w-8 h-12 bg-green-500 rounded-sm"></div>
                      <div className="w-8 h-12 bg-blue-500 rounded-sm"></div>
                      <div className="w-8 h-12 bg-red-500 rounded-sm"></div>
                      <div className="w-8 h-12 bg-yellow-400 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Capacitors */}
            {capacitors.map((c, i) => (
              <div key={`capacitor-${i}`} className="bg-black rounded-[2rem] p-6 flex items-center space-x-6" style={{borderRadius: '2rem'}}>
                {/* Delete Button */}
                <button
                  onClick={() => setCapacitors(capacitors.filter((_, idx) => idx !== i))}
                  className="w-20 h-20 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 font-light"
                >
                  ✕
                </button>
                
                {/* Used/Check Button */}
                <button
                  onClick={() => {
                    setCapacitors(
                      capacitors.map((item, idx) =>
                        idx === i ? { ...item, used: !item.used } : item
                      )
                    );
                  }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-300 font-light ${
                    c.used 
                      ? 'bg-green-500 hover:bg-green-400' 
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                >
                  ✓
                </button>

                {/* Component Info */}
                <div className="flex-1 flex items-center space-x-8">
                  {/* Component Name */}
                  <div className="bg-gray-600 rounded-full px-10 py-5 min-w-[140px] text-center">
                    <EditableCell
                      value={c.number}
                      onChange={(newValue) => {
                        setCapacitors(
                          capacitors.map((item, idx) =>
                            idx === i ? { ...item, number: newValue } : item
                          )
                        );
                      }}
                      className={`text-white text-2xl font-normal ${c.used ? 'opacity-60' : ''}`}
                    />
                  </div>

                  {/* Value */}
                  <div className="bg-gray-600 rounded-full px-10 py-5 min-w-[140px] text-center">
                    <EditableCell
                      value={c.value}
                      onChange={(newValue) => {
                        setCapacitors(
                          capacitors.map((item, idx) =>
                            idx === i ? { ...item, value: newValue } : item
                          )
                        );
                      }}
                      className={`text-white text-2xl font-normal ${c.used ? 'opacity-60' : ''}`}
                    />
                  </div>

                  {/* Capacitor Code Display - Dinamik kod */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="bg-gray-600 rounded-full px-12 py-5 min-w-[180px] text-center">
                      <span className="text-white text-2xl font-mono tracking-[0.5rem] font-normal">
                        {calculateCapacitorCode(c.value)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Select Resistor Tolerance Button - Alt kısımda */}
        <div className="mt-8 flex justify-start">
          <button className="px-12 py-5 bg-gray-600 hover:bg-gray-500 text-white text-xl font-normal rounded-full transition-all duration-300 shadow-lg lowercase">
            select resistor tolerance
          </button>
        </div>
      </div>
    </div>
  );
}

export default App
