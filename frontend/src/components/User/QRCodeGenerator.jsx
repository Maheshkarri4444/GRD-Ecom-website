import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

const QRCodeGenerator = ({ amount: initialAmount }) => {
  const [amount, setAmount] = useState(initialAmount);
  const [isEditing, setIsEditing] = useState(false);
  
  // Replace with your actual PhonePe UPI ID
  const upiId = "9849141105@ybl";
  const merchantName = "Karunakar Reddy T";
  
  const upiPaymentLink = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR`;

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
      setAmount(value);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 rounded-lg bg-purple-50">
      <div className="flex items-center space-x-2">
        <span className="text-lg font-semibold">Amount: ₹</span>
        {isEditing ? (
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-24 px-2 py-1 bg-white border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
            onBlur={() => setIsEditing(false)}
          />
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 rounded cursor-pointer hover:bg-purple-100"
            title="Click to edit amount"
          >
            {amount}
          </div>
        )}
      </div>
      <QRCodeSVG 
        value={upiPaymentLink}
        size={200}
        level="H"
        includeMargin={true}
      />
      <p className="mt-2 text-sm text-center text-purple-800">
        Scan this QR code to pay ₹{amount} via PhonePe
      </p>
      <p className="text-xs text-center text-purple-600">
        Click on the amount to edit
      </p>
    </div>
  );
};

export default QRCodeGenerator;