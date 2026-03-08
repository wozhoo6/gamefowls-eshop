import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Trash2 } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore.js";
import { useCategoryStore } from "../../stores/useCategoryStore.js";
import { useUserStore } from "../../stores/useUserStore.js";
import ProductForm from "../seller/ProductForm.jsx";
import CategoryForm from "../seller/CategoryForm.jsx";
import Modal from "../Modal.jsx";
import DeleteCategoryModal from "../seller/DeleteCategoryModal.jsx";


const flattenCategories = (cats) => {
  const result = [];
  if (cats) {
    cats.forEach(cat => {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach(child => {
          result.push({ ...child, displayName: `-- ${child.name}` });
        });
      }
    });
  }
  return result;
};

const ProductManager = () => {
  const {
    products,
    fetchSellerProducts,
    fetchSellerProductByCategory,
    createProduct,
    updateProduct,
    toggleFeature,
    deleteProduct
  } = useProductStore();

  const {
    createParentCategory,
    createSubcategory,
    fetchAllCategories,
    deleteCategory,
    categories
  } = useCategoryStore();

  const { user } = useUserStore()


  useEffect(() => {
    fetchAllCategories()
  }, [fetchAllCategories]);



  // CATEGORY STATES
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');

  // FORM STATE
  const [isFormOpen, setIsFormOpen] = useState(false);

  // FILTER STATE
  const [filters, setFilters] = useState({
    category: "All",
    minPrice: "",
    maxPrice: "",
  });

  // PRODUCT FORM STATES
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: ""
  });

  // FILTER LOGIC
  const filteredProducts = products.filter((product) => {

    const minMatch =
      !filters.minPrice || product.price >= Number(filters.minPrice);
    const maxMatch =
      !filters.maxPrice || product.price <= Number(filters.maxPrice);

    return minMatch && maxMatch;
  });

  //SUBMIT PRODUCT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      // console.log(formData, editingProduct._id)
      await updateProduct(editingProduct._id, formData)
    } else {
      await createProduct(formData)
    }

    setFormData({ name: "", categoryId: "", price: "" });
    setEditingProduct(null);
  };

  // EDITING PRODUCT HANDLER
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      images: product.images
    });
    setIsFormOpen(true);
  };

  //CONVERT CATEGORY ID INTO CATEGORY NAME
  const getCategoryName = (categoryId) => {
    const category = flattenCategories(categories).find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  //OPEN NEW CATEGORY FORM
  const handleOpenCategoryForm = () => {
    setIsAddingCategory(true)
    setIsFormOpen(true)
  }

  //CATEGORY HANDLERS
  const handleAddCategory = async (categoryData) => {
    categoryData.parentId ? createSubcategory(categoryData) : createParentCategory(categoryData)
    setIsFormOpen(false);
    setIsAddingCategory(false);
    await fetchAllCategories()

  }

  const handleDeleteCategory = async () => {
    await deleteCategory(selectedCategoryId)
    setSelectedCategoryId('All')
    await fetchSellerProducts(user._id)
    await fetchAllCategories()
    setShowDeleteModal(false)
  }

  //HANDLE ESC KEY PRESS WHEN MODAL IS OPEN
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setIsFormOpen(false);
        setEditingProduct(null);
        setIsAddingCategory(false);
        setShowDeleteModal(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
        <h2 className="text-2xl font-bold text-red-600">Product Management</h2>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: "",
              description: "",
              categoryId: categories[0]?._id || "",
              price: "",
            });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-bold"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-4 mb-6">
        {/* Category */}
        <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[180px]">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">Category</label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleOpenCategoryForm}
                className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold px-2 py-1 rounded-md"
              >
                <Plus size={12} /> New
              </button>

              <button
                type="button"
                disabled={selectedCategoryId === "All"}
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1 text-xs border border-red-500 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1 rounded-md"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          <select
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm w-full"
            value={selectedCategoryId}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategoryId(value);
              value !== "All"
                ? fetchSellerProductByCategory(value)
                : fetchSellerProducts(user._id);
            }}
          >
            <option value="All">All</option>
            {flattenCategories(categories).map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.displayName || cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[120px]">
          <label className="text-sm text-gray-400">Min Price</label>
          <input
            type="number"
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm w-full"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
        </div>

        {/* Max Price */}
        <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[120px]">
          <label className="text-sm text-gray-400">Max Price</label>
          <input
            type="number"
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm w-full"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm min-w-[600px] md:min-w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-gray-400">
              <th className="text-left py-2">Name</th>
              <th className="text-center">Category</th>
              <th className="text-center">Price</th>
              <th className="text-center">Stock</th> {/* New column */}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b border-zinc-800">
                <td className="py-3">{product.name}</td>
                <td className="text-center">{getCategoryName(product.categoryId)}</td>
                <td className="text-center">P{product.price}</td>
                <td className="text-center">{product.stock}</td> {/* Display stock here */}
                <td className="text-right">
                  <div className="flex flex-wrap justify-end items-center gap-2 md:gap-3">
                    {/* Feature Toggle */}
                    <button
                      onClick={() => toggleFeature(product._id, !product.isFeatured)}
                      className={`px-2 py-1 text-xs rounded transition ${product.isFeatured
                        ? "bg-green-500 text-black hover:bg-green-400"
                        : "bg-zinc-800 text-green-400 hover:bg-zinc-700"
                        }`}
                    >
                      {product.isFeatured ? "Featured" : "Feature"}
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-amber-500 hover:text-amber-400 flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-500 hover:text-red-400 flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <Trash size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteCategoryModal
        open={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteCategory={handleDeleteCategory}
      />

      <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <h3 className="text-xl font-bold mb-4">
          {isAddingCategory
            ? "Add Category"
            : editingProduct
              ? "Edit Product"
              : "Add Product"}
        </h3>

        {isAddingCategory ? (
          <CategoryForm
            categories={categories}
            onSubmit={(data) => handleAddCategory(data)}
            onCancel={() => {
              setIsFormOpen(false);
              setIsAddingCategory(false);
            }}
          />
        ) : (
          <ProductForm
            categories={flattenCategories(categories)}
            formData={formData}
            setFormData={setFormData}
            editingProduct={editingProduct}
            onSubmit={(e) => {
              handleSubmit(e);
              setIsFormOpen(false);
              setIsAddingCategory(false);
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
              setIsAddingCategory(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProductManager;
