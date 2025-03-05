import { FaTrash } from "react-icons/fa";

const VariantCard = ({ variant, handleDeleteVariant }) => {
  console.log(variant, "variant");
  return (
    <div className="border rounded-lg p-4 bg-gray-50 relative max-w-sm">
      <button
        onClick={() => handleDeleteVariant(variant.variantNumber - 1)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <FaTrash />
      </button>
      <div className="flex justify-between items-center mb-2 pr-6">
        <h4 className="font-medium">Variant {variant.variantNumber}</h4>
        <span className="text-sm text-gray-500">{variant.title}</span>
      </div>
      <div className="space-y-1 text-sm">
        <p>Regular Price: ${variant.price}</p>
        <p>Offer Price: ${variant.offerPrice}</p>
        <p>Stock: {variant.stock}</p>
        <p>Status: {variant.stockStatus}</p>
      </div>
      {variant.images[0] && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(variant?.images[0])}
            alt={`Variant ${variant.variantNumber}`}
            className="w-full h-24 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};

export default VariantCard;
