import React, { useState } from 'react';
import { X } from 'lucide-react';
import { diseaseProtocols } from "./protocols_updated";

function Protocols() {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [selectedHowTo, setSelectedHowTo] = useState(null);

  // Get unique types from protocols
  const types = [...new Set(Object.values(diseaseProtocols).map(protocol => protocol.type))];
  const [selectedType, setSelectedType] = useState(types[0]);

  const howToContent = {
    milletPorridge: {
      title: "Millet Porridge (Ambali)",
      content: `Ambali is an elixir for humans health, says by Dr. Khadar Valli.

Off late everyone seems to have macro & micronutrient deficiencies like Vitamin B12 deficiency - one of the reasons being the lack of a good colony of pro-biotic bacteria in the gut.

A simple solution is to consume fermented porridge regularly & here is the recipe on how to prepare Fermented Millet Porridge / Ambali / Khameer.

If you are suffering from any serious chronic health condition, eating fermented porridge / ambali / Khameer for all 3 meals for 6 - 9 weeks will help you to speed up your recovery.

If you are just beginning your millet journey, this would be the best way to start.

Strict rules to follow to prepare Ambali for best health benefits:
• Use structured water for soaking and cooking
• Soak the millets for 6 to 8 hours
• 6 to 10 glasses of water for 1 glass of millets
• Do not add the salt or any other ingredients while preparing. It kills the good bacteria and fermentation process will not take properly
• Once cooked and before leaving for fermentation process, tie or cover it with cotton or Khadi cloth`
    },
    decoctions: {
      title: "Immunity Boosting Decoctions",
      content: `To Boost Immunity levels in our body along with your regular diet use the following Decoctions in the same order for 4 days each and your cycle would be completed with in 28 days.

1. గరిక (Bermuda Grass, Dhub, Cynodon dactylon)
2. తులసి (Holy Basil, Ocimum tenuiflorum, Ocimum sanctum)
3. తిప్పతీగ (Guduchi, Amrutavalli, Tinospora cordifolia)
4. బిలవప్త్రం/ మారేడు (Bael or Bili or Bhel, Aegle marmelos)
5. కానుగ (Pongamia pinnata)
6. వేప్ (Neem, Azadirachta indica)
7. రావి (Peepal, Aswattha, Ficus religiosa)

As a preventive medicine before starting rainy season one can use the above cycle to avoid seasonal diseases.
Pandemic and Endemic: use the above Decoctions 2 days each in the same order for 14 days.
Age limit: this can be used from 9 months baby. Even pregnant ladies and after delivery also this Decoctions can be used.
Normal healthy people can practice 1 leaf for one week in this Process. Your cycle would be completed in 49 days.

Preparation:
1. Take half a handful of small leaves such as Tulsi, Pudina, Manthi, Kothitamira, Curry leaves
2. If they are big leaves, make them into small and take half a handful of leaves
3. Pour 150-200 ml of water on the pan, add the leaves and let them boil for 2-3 minutes. After that, put the lid on for 2-3 minutes, strain the leaves with a filter and drink it warm or cold
4. Optional ingredients: Mustard ½ tsp/ Cumin 1 tsp/ Mantulu ½ tsp/ Organic Psuppa ½ tsp/ Dalina Chekaka 2" ground/ Pepper ½ tsp/ Cloves 2/ Alum ½" ground/ Sambar Ulupaya 4-5/ Aloe Vera Gujuja(white gel) 2 tbsp
5. For banana pulp/boda/oosa infusion: Add 150-200 ml of water to 100g organic banana pulp and boil for 2-3 minutes
6. You can mix a little bit of palm jaggery into decoction if desired`
    }
  };

  // Filter diseases by selected type
  const filteredDiseases = selectedType
    ? Object.keys(diseaseProtocols).filter(disease => diseaseProtocols[disease].type === selectedType)
    : [];

  const handleDiseaseClick = (disease) => {
    setSelectedDisease(disease);
    setShowModal(true);
  };

  const handleHowToClick = (type) => {
    setSelectedHowTo(type);
    setShowHowToModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowHowToModal(false);
    setSelectedDisease(null);
    setSelectedHowTo(null);
  };

  const HowToModal = ({ type }) => {
    const content = howToContent[type];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">{content.title}</h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="prose max-w-none">
              {content.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProtocolModal = ({ disease }) => {
    const protocol = diseaseProtocols[disease];
    if (!protocol) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">{protocol.title}</h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Desktop view - Table format */}
            <div className="hidden md:block">
              {Object.entries(protocol.categories).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="mb-8">
                    <h3 className="mb-4 text-xl font-semibold text-green-600">{category}</h3>
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
            
            {/* Mobile view - Card format */}
            <div className="block md:hidden">
              {Object.entries(protocol.categories).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="mb-8">
                    <h3 className="mb-4 text-xl font-semibold text-green-600">{category}</h3>
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="p-4 rounded-lg bg-green-50">
                          <h4 className="font-medium text-green-700">{item.name}</h4>
                          <p className="mt-2 text-sm text-gray-600">Duration: {item.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <img
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          alt="Dr. Khader Vali Inspiration"
          className="object-cover w-48 h-48 mx-auto mb-6 rounded-lg"
        />
        <blockquote className="mb-8 text-xl italic text-gray-700">
          "Inspired by Dr.Khadar Vali"
        </blockquote>
        <blockquote className="mb-8 text-xl italic text-gray-700">
          "Nature has provided us with everything we need for our well-being. The key is to return to our roots and embrace the healing power of natural foods and medicines."
        </blockquote>
      </div>

      {/* How To Make Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-green-700">How to Make</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <button
            onClick={() => handleHowToClick('milletPorridge')}
            className="p-6 text-left transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold text-green-700">Millet Porridge (Ambali)</h3>
            <p className="mt-2 text-gray-600">Learn how to prepare this healing elixir</p>
          </button>
          <button
            onClick={() => handleHowToClick('decoctions')}
            className="p-6 text-left transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold text-green-700">Immunity Boosting Decoctions</h3>
            <p className="mt-2 text-gray-600">Discover natural immunity boosters</p>
          </button>
        </div>
      </div>

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

      {showModal && selectedDisease && <ProtocolModal disease={selectedDisease} />}
      {showHowToModal && selectedHowTo && <HowToModal type={selectedHowTo} />}
    </div>
  );
}

export default Protocols;