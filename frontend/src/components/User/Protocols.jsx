import React, { useState } from 'react';
import { X } from 'lucide-react';
import { diseaseProtocols } from "./protocols_updated";

function Protocols() {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get unique types from protocols
  const types = [...new Set(Object.values(diseaseProtocols).map(protocol => protocol.type))];
  
  const [selectedType, setSelectedType] = useState(types[0]);

  // Filter diseases by selected type
  const filteredDiseases = selectedType
    ? Object.keys(diseaseProtocols).filter(disease => diseaseProtocols[disease].type === selectedType)
    : [];

  const handleDiseaseClick = (disease) => {
    setSelectedDisease(disease);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDisease(null);
  };

  const shouldDisplayCategory = (category, items) => {
    return items.length > 0 && (category.length >= 20 || items.some(item => item.name || item.duration));
  };

  const ProtocolModal = ({ disease }) => {
    const protocol = diseaseProtocols[disease];
    if (!protocol) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">{protocol.title}</h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              {Object.entries(protocol.categories).map(([category, items]) => (
                shouldDisplayCategory(category, items) && (
                  <div key={category} className="mb-8">
                    {category.length >= 20 && (
                      <h3 className="mb-4 text-xl font-semibold text-green-600">{category}</h3>
                    )}
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="p-3 text-left border border-green-200">Name</th>
                          <th className="p-3 text-left border border-green-200">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index} className="hover:bg-green-50">
                            <td className="p-3 border border-green-200">{item.name}</td>
                            <td className="p-3 border border-green-200">{item.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ))}
            </div>

            {/* Mobile Content View */}
            <div className="md:hidden">
              {Object.entries(protocol.categories).map(([category, items]) => (
                shouldDisplayCategory(category, items) && (
                  <div key={category} className="mb-8">
                    {category.length >= 20 && (
                      <h3 className="mb-4 text-xl font-semibold text-green-600">{category}</h3>
                    )}
                    {items.map((item, index) => (
                      <div key={index} className="p-4 mb-3 rounded-lg bg-green-50">
                        <h4 className="font-medium text-green-700">{item.name}</h4>
                        <p className="mt-1 text-gray-600">Duration: {item.duration}</p>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>

            {/* Best Practices */}
            {protocol.bestPractices && protocol.bestPractices.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-green-600">Best Practices</h3>
                <ul className="pl-5 space-y-2 list-disc">
                  {protocol.bestPractices.map((practice, index) => (
                    <li key={index} className="text-gray-700">{practice}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Type Selection */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-green-700">Select Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-4 rounded-lg text-left transition-colors ${
                selectedType === type
                  ? 'bg-green-600 text-white'
                  : 'bg-white hover:bg-green-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Disease List */}
      {selectedType && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-green-700">
            {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Protocols
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDiseases.map((disease) => (
              <button
                key={disease}
                onClick={() => handleDiseaseClick(disease)}
                className="p-6 text-left transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-green-700">{disease}</h3>
                <p className="mt-2 text-gray-600">Click to view protocol details</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {showModal && selectedDisease && (
        <ProtocolModal disease={selectedDisease} />
      )}
    </div>
  );
}

export default Protocols;