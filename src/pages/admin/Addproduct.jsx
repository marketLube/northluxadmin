import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//components
import PageHeader from "../../components/Admin/PageHeader";
import ProductNameInput from "../../components/Admin/Product/components/Inputs/ProductNameInput";
import BrandSelect from "../../components/Admin/Product/components/Inputs/BrandSelect";
import CategorySelect from "../../components/Admin/Product/components/Inputs/CategrorySelect";
import UnitsSelect from "../../components/Admin/Product/components/Inputs/UnitsSelects";
import LabelSelect from "../../components/Admin/Product/components/Inputs/LabelSelect";
import VariantRadioButtons from "../../components/Admin/Product/components/Variants/VariantRadioButtons";
import VariantCard from "../../components/Admin/Product/components/Variants/VariantsCard";
import VariantForm from "../../components/Admin/Product/components/Forms/VariantForm";
import ErrorMessage from "../../components/common/ErrorMessage";
import ImageUploaderContainer from "../../components/Admin/Product/components/ImageUploader/ImageUploaderContainer";

//  validations
import { validateProduct } from "../../components/Admin/Product/components/Validations/ProductValidation";
import { validateVariant } from "../../components/Admin/Product/components/Validations/VariantValidation";

//  API services
import { getcategoriesbrands } from "../../sevices/adminApis";
import { addProduct } from "../../sevices/ProductApis";

//  initial states
import {
  initialProductState,
  initialVariantState,
} from "../../components/Admin/Product/constants/initialStates";

function Addproduct() {
  // State Management
  const [productData, setProductData] = useState(initialProductState);
  const [currentVariant, setCurrentVariant] = useState(initialVariantState);
    const [selectedVariant, setSelectedVariant] = useState("");
  const [images, setImages] = useState([]);
  const [formUtilites, setFormUtilites] = useState({});
  const [showVariantForm, setShowVariantForm] = useState(true);
    const fileInputs = useRef([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState({});
  const [variantErrors, setVariantErrors] = useState({});

  const navigate = useNavigate();

  // Data Fetching
    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getcategoriesbrands();
        setFormUtilites(res.data);
      } catch (err) {
        toast.error("Failed to fetch categories and brands");
      }
    };
    fetchData();
  }, []);

  // Event Handlers
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" || name === "description") {
      setCurrentVariant((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [name]: value,
        },
      }));
      // Clear the error for this field
      setVariantErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    } else {
      setCurrentVariant((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear the error for this field
      setVariantErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedVariant(value);

    // Reset product data structure based on variant selection
    if (value === "noVariants") {
      setProductData((prev) => ({
        ...prev,
        variants: [],
      }));
    }

    // Clear all errors when switching variant types
    setErrors({});
    setVariantErrors({});
  };

    const handleClick = (index) => {
        if (fileInputs.current[index]) {
      fileInputs.current[index].click(index);
        }
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = [...images];
      newImages[index] = file;
            setImages(newImages);
        }
    };

  const handleSaveVariant = () => {
    const variantData = {
      sku: currentVariant.sku,
      attributes: {
        title: currentVariant.attributes.title,
        description: currentVariant.attributes.description,
      },
      price: currentVariant.originalPrice,
      offerPrice: currentVariant.offerPrice,
      stock: currentVariant.stock,
      stockStatus: currentVariant.stockStatus,
      images: [...images],
    };

    // Validate variant before saving
    const validationErrors = validateVariant(variantData);
    if (Object.keys(validationErrors).length > 0) {
      setVariantErrors(validationErrors);
      //   toast.error("Please fill in all required variant fields");
      return;
    }

    setProductData((prev) => ({
      ...prev,
      variants: [...prev.variants, variantData],
    }));
    resetVariantForm();
    setShowVariantForm(false);
    setVariantErrors({});
  };

  const resetVariantForm = () => {
    setCurrentVariant(initialVariantState);
    setImages([]);
  };

  const handleDeleteVariant = (index) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handlePublish = async () => {
    // Check if variants are required but none are added
    if (
      selectedVariant === "hasVariants" &&
      productData.variants.length === 0
    ) {
      toast.error("Please add at least one variant before publishing");
      setErrors((prev) => ({
        ...prev,
        variants: "At least one variant is required",
      }));
      return;
    }

    // Pass images as third argument to validateProduct
    const validationErrors = validateProduct(
      productData,
      selectedVariant,
      images
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Show specific error messages
      if (validationErrors.variants) {
        toast.error(validationErrors.variants);
        if (validationErrors.variantErrors) {
          // Show detailed variant errors
          validationErrors.variantErrors.forEach((variantError, index) => {
            if (variantError) {
              const errorMessages = Object.values(variantError).join(", ");
              toast.error(`Variant ${index + 1}: ${errorMessages}`);
            }
          });
        }
      } else {
        toast.error("Please fill in all required fields");
      }
      return;
    }

    setIsPublishing(true);
    const formData = new FormData();

    // Add basic product info
    formData.append("name", productData.name);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);
    formData.append("label", productData.label);
    formData.append("units", productData.units);

    if (selectedVariant === "hasVariants") {
      // For products with variants
      const formattedVariants = productData.variants.map((variant, index) => {
        // Create a clean variant object without prototype
        const cleanVariant = {
          sku: variant.sku,
          attributes: {
            title: variant.attributes.title,
            description: variant.attributes.description,
          },
          price: variant.price,
          offerPrice: variant.offerPrice,
          stock: variant.stock,
          stockStatus: variant.stockStatus,
        };

        // Handle variant images separately
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((image, imageIndex) => {
            if (image) {
              formData.append(`variants[${index}][images]`, image);
            }
          });
        }

        return cleanVariant;
      });

      // Append each variant separately
      formattedVariants.forEach((variant, index) => {
        formData.append(`variants[]`, JSON.stringify(variant));
      });
    } else {
      // For products without variants
      formData.append("description", productData.description);
      formData.append("sku", productData.sku);
      formData.append("price", productData.price);
      formData.append("offerPrice", productData.offerPrice);
      formData.append("stock", productData.stock);

      // Handle product images
      images.forEach((image, index) => {
        if (image) {
          formData.append(`productImages`, image);
        }
      });
    }

    try {
      const res = await addProduct(formData);
      if (res.status === 201) {
        toast.success("Product added successfully");
        navigate("/admin/product");
      }
    } catch (err) {
      if (err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to add product");
      }
    } finally {
      setIsPublishing(false);
    }
  };

        return (
    <div className="space-y-3 w-full bg-white p-3 flex flex-col min-h-full">
      <PageHeader content={"Products"} />
      <h1 className="font-bold text-lg mb-2">Add Product</h1>

      <div className="w-full flex justify-between">
        <div
          className={
            selectedVariant === "" ||
            (selectedVariant === "hasVariants" && !showVariantForm) ||
            (selectedVariant === "noVariants" && !showVariantForm)
              ? "w-full"
              : "w-1/2"
          }
        >
          <div className="space-y-4 bg-white py-3 px-5">
            <ProductNameInput
              handleChange={handleProductChange}
              value={productData.name}
              errors={errors}
            />

            <div className="flex gap-2">
              <BrandSelect
                brands={formUtilites.brands}
                handleChange={handleProductChange}
                value={productData.brand}
                errors={errors}
              />
              <CategorySelect
                categories={formUtilites.categories}
                handleChange={handleProductChange}
                value={productData.category}
                errors={errors}
              />
                </div>

            <div className="flex gap-2">
              <UnitsSelect
                handleChange={handleProductChange}
                value={productData.units}
                errors={errors}
              />
              <LabelSelect
                labels={formUtilites.labels}
                handleChange={handleProductChange}
                value={productData.label}
                errors={errors}
                        />
                    </div>

            <VariantRadioButtons
              selectedVariant={selectedVariant}
              handleRadioChange={handleRadioChange}
            />
            <ErrorMessage error={errors?.variantSelection} />

            {productData.variants.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Saved Variants</h3>
                  {!showVariantForm && !isPublishing && (
                    <button
                      onClick={() => setShowVariantForm(true)}
                      className="btn bg-blue-600 text-white p-2 px-4 rounded-3xl flex items-center gap-2"
                    >
                      <span>+ Add Variant</span>
                    </button>
                  )}
                    </div>
                <div className="grid grid-cols-3 gap-4">
                  {productData.variants.map((variant, index) => (
                    <VariantCard
                                key={index}
                      variant={{
                        ...variant,
                        variantNumber: index + 1,
                        title: variant.attributes.title,
                      }}
                      handleDeleteVariant={() => handleDeleteVariant(index)}
                    />
                  ))}
                </div>
              </div>
            )}
            </div>
            </div>

        {selectedVariant === "noVariants" && (
          <div className="w-1/2 flex items-center">
            <div className="w-full space-y-3">
              <div className="flex gap-2 px-3">
                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={productData.sku}
                    onChange={handleProductChange}
                    className={`bg-gray-50 border ${
                      errors?.sku ? "border-red-500" : "border-gray-300"
                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  />
                  <ErrorMessage error={errors?.sku} />
                </div>
              </div>
              <div className="flex gap-2 px-3">
                <div className="flex flex-col w-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={productData.price}
                    onChange={handleProductChange}
                    className={`bg-gray-50 border ${
                      errors?.price ? "border-red-500" : "border-gray-300"
                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  />
                  <ErrorMessage error={errors?.price} />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Offer Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="offerPrice"
                    value={productData.offerPrice}
                    onChange={handleProductChange}
                    className={`bg-gray-50 border ${
                      errors?.offerPrice ? "border-red-500" : "border-gray-300"
                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  />
                  <ErrorMessage error={errors?.offerPrice} />
                </div>
              </div>
              <div className="flex gap-2 px-3">
                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="stock"
                    value={productData.stock}
                    onChange={handleProductChange}
                    className={`bg-gray-50 border ${
                      errors?.stock ? "border-red-500" : "border-gray-300"
                    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  />
                  <ErrorMessage error={errors?.stock} />
                </div>
              </div>
              <div className="px-3">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleProductChange}
                  rows={6}
                  className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                    errors?.description ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500 focus:border-blue-500`}
                />
                <ErrorMessage error={errors?.description} />
              </div>

              <ImageUploaderContainer
                images={images}
                handleClick={handleClick}
                handleFileChange={handleFileChange}
                fileInputs={fileInputs}
                error={errors?.images}
              />
            </div>
          </div>
        )}

        {selectedVariant === "hasVariants" &&
          (showVariantForm || productData.variants.length === 0) && (
            <div className="w-1/2 flex items-center">
              <div className="w-full space-y-3">
                <div className="flex gap-2 px-3">
                  <div className="flex flex-col w-1/2">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      SKU <span className="text-red-500">*</span>
                    </label>
                        <input
                      type="text"
                      name="sku"
                      value={currentVariant.sku}
                      onChange={handleVariantChange}
                      className={`bg-gray-50 border ${
                        variantErrors?.sku
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    />
                    <ErrorMessage error={variantErrors?.sku} />
                    </div>
                  <div className="flex flex-col w-1/2">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Variant Title <span className="text-red-500">*</span>
                    </label>
                        <input
                      type="text"
                      name="title"
                      value={currentVariant.attributes.title}
                      onChange={handleVariantChange}
                      className={`bg-gray-50 border ${
                        variantErrors?.title
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                    />
                    <ErrorMessage error={variantErrors?.title} />
                  </div>
                </div>

                <VariantForm
                  handleVariantChange={handleVariantChange}
                  currentVariantData={currentVariant}
                  errors={variantErrors}
                />

                <ImageUploaderContainer
                  images={images}
                  handleClick={handleClick}
                  handleFileChange={handleFileChange}
                  fileInputs={fileInputs}
                  error={variantErrors?.images}
                />

                <div className="w-full text-end">
                  <button
                    onClick={handleSaveVariant}
                    className="btn bg-blue-600 text-white p-1 px-3 rounded-3xl"
                  >
                    Save Variant
                  </button>
                    </div>
                </div>
            </div>
          )}
            </div>

            <div className="flex justify-center gap-4">
        <button
          className="btn bg-red-600 text-white p-1 px-3 w-full max-w-sm rounded-3xl"
          disabled={isPublishing}
        >
          Cancel
        </button>
        <button
          className={`btn ${
            isPublishing ? "bg-gray-500" : "bg-green-600"
          } text-white p-1 px-3 w-full max-w-sm rounded-3xl flex items-center justify-center gap-2`}
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Publishing...</span>
            </>
          ) : (
            "Publish Product"
          )}
        </button>
            </div>
        </div>
  );
}

export default Addproduct;
