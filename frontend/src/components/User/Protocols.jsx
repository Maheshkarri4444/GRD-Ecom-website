import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import KhaderVali from "../../assets/KhaderVali2.jpg";
import Ambali from "../../assets/ambali2.jpg";
import Decoction from "../../assets/decotion.jpg";
import { diseaseData, cancerData, preventiveData } from './data';

function Protocols() {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [selectedHowTo, setSelectedHowTo] = useState(null);
  const [activeTab, setActiveTab] = useState('autoimmune');
  const [expandedCategories, setExpandedCategories] = useState({});

  const howToContent = {
    milletPorridge: {
      title: "Millet Porridge (Ambali)",
      content: `Ambali is an elixir for humans health, says by Dr. Khadar Vali.

Off late everyone seems to have macro & micronutrient deficiencies like Vitamin B12 deficiency - one of the reasons being the lack of a good colony of pro-biotic bacteria in the gut.

A simple solution is to consume fermented porridge regularly & here is the recipe on how to prepare Fermented Millet Porridge / Ambali / Khameer.

If you are suffering from any serious chronic health condition, eating fermented porridge / ambali / Khameer for all 3 meals for 6 - 9 weeks will help you to speed up your recovery.

If you are just beginning your millet journey, this would be the best way to start.`,
      steps: [
        "Use structured water for soaking and cooking",
        "Soak the millets for 6 to 8 hours",
        "6 to 10 glasses of water for 1 glass of millets",
        "Do not add the salt or any other ingredients while preparing. It kills the good bacteria and fermentation process will not take properly",
        "Once cooked and before leaving for fermentation process, tie or cover it with cotton or Khadi cloth"
      ],
      image: Ambali,
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
Normal healthy people can practice 1 leaf for one week in this Process. Your cycle would be completed in 49 days.`,
      steps: [
        "Take half a handful of small leaves such as Tulsi, Pudina, Manthi, Kothitamira, Curry leaves",
        "If they are big leaves, make them into small and take half a handful of leaves",
        "Pour 150-200 ml of water on the pan, add the leaves and let them boil for 2-3 minutes. After that, put the lid on for 2-3 minutes, strain the leaves with a filter and drink it warm or cold",
        "Optional ingredients: Mustard ½ tsp/ Cumin 1 tsp/ Mantulu ½ tsp/ Organic Psuppa ½ tsp/ Dalina Chekaka 2\" ground/ Pepper ½ tsp/ Cloves 2/ Alum ½\" ground/ Sambar Ulupaya 4-5/ Aloe Vera Gujuja(white gel) 2 tbsp",
        "For banana pulp/boda/oosa infusion: Add 150-200 ml of water to 100g organic banana pulp and boil for 2-3 minutes",
        "You can mix a little bit of palm jaggery into decoction if desired"
      ],
      image: Decoction,
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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
            
            {/* Image */}
            <div className="flex justify-center mb-6 ">
              <img 
                src={content.image} 
                alt={content.title} 
                className="object-cover h-64 rounded-lg w-100"
              />
            </div>
            
            <div className="prose max-w-none">
              {content.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
              
              {/* Steps with proper formatting */}
              {content.steps && (
                <div className="mt-6">
                  <h3 className="mb-4 text-xl font-semibold text-green-600">
                    {type === 'milletPorridge' ? 'Strict rules to follow to prepare Ambali for best health benefits:' : 'Preparation:'}
                  </h3>
                  <ul className="pl-5 space-y-2 list-disc">
                    {content.steps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProtocolModal = ({ disease }) => {
    const getDataSource = () => {
      switch (activeTab) {
        case 'autoimmune':
          return diseaseData.diseases;
        case 'cancer':
          return cancerData.diseases;
        case 'preventive':
          return preventiveData.diseases;
        default:
          return [];
      }
    };
    
    const data = getDataSource();
    const protocol = data.find(d => d.name === disease);
    
    if (!protocol) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">{protocol.name}</h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {protocol.categories.map((category, index) => (
              <div key={index} className="mb-8">
                {(expandedCategories[`${disease}-${category.category}`] || true) && (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-green-50">
                            <th className="p-3 text-left border border-green-200">Name</th>
                            <th className="p-3 text-left border border-green-200">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-green-50">
                              <td className="p-3 border border-green-200">{item.name}</td>
                              <td className="p-3 border border-green-200">{item.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {category.best_practices && (
                      <div className="p-4 mt-4 rounded-lg bg-green-50">
                        <h4 className="mb-2 font-medium text-green-700">Best Practices:</h4>
                        <p className="text-gray-700">{category.best_practices}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            
            {protocol.notes && protocol.notes.trim() !== "" && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-green-600">Important Notes</h3>
                <div className="p-4 rounded-lg bg-yellow-50">
                  <p className="text-gray-700">{protocol.notes}</p>
                </div>
              </div>
            )}
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
          src={KhaderVali}
          alt="Dr. Khader Vali Inspiration"
          className="object-cover w-48 mx-auto mb-6 rounded-lg h-57"
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

      {/* Tab Selection */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'autoimmune'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('autoimmune')}
          >
            Autoimmune Diseases
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'cancer'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('cancer')}
          >
            Cancer Protocols
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'preventive'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('preventive')}
          >
            Preventive Measures
          </button>
        </div>
      </div>

      {/* Disease List */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-green-700">
          {activeTab === 'autoimmune' 
            ? 'Autoimmune Disease Protocols' 
            : activeTab === 'cancer'
            ? 'Cancer Protocols'
            : 'Preventive Health Measures'}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(activeTab === 'autoimmune' 
            ? diseaseData.diseases 
            : activeTab === 'cancer'
            ? cancerData.diseases
            : preventiveData.diseases
          ).map((disease) => (
            <button
              key={disease.name}
              onClick={() => handleDiseaseClick(disease.name)}
              className="p-6 text-left transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-green-700">{disease.name}</h3>
              <p className="mt-2 text-gray-600">Click to view protocol details</p>
            </button>
          ))}
        </div>
      </div>

      {showModal && selectedDisease && <ProtocolModal disease={selectedDisease} />}
      {showHowToModal && selectedHowTo && <HowToModal type={selectedHowTo} />}
    </div>
  );
}

export default Protocols;