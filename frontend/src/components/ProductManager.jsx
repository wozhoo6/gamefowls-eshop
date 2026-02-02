import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { useProductStore } from "../stores/useProductStore.js";
import ProductForm from "./seller/ProductForm.jsx";
import Modal from "./Modal.jsx";


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

const ProductManager = ({ categories }) => {
  const {
    products,
    fetchSellerProducts,
    fetchSellerProductByCategory,
    createProduct,
    updateProduct,
    toggleFeature,
    deleteProduct
  } = useProductStore();

  const [editingProduct, setEditingProduct] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: "All",
    minPrice: "",
    maxPrice: "",
  });

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

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
    });
    setIsFormOpen(true);
  };

  const getCategoryName = (categoryId) => {
    const category = flattenCategories(categories).find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setIsFormOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-red-600">
          Product Management
        </h2>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: "",
              description: "",
              categoryId: categories[0]._id,
              price: "",
            });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-bold"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>


      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-400">Category</label>
          <select
            className="block bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm"
            onChange={(e) =>
              e.target.value !== "All"
                ? fetchSellerProductByCategory(e.target.value)
                : fetchSellerProducts()
            }
          >
            <option value="All">All</option>
            {flattenCategories(categories).map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.displayName || cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-400">Min Price</label>
          <input
            type="number"
            className="block bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Max Price</label>
          <input
            type="number"
            className="block bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-gray-400">
              <th className="text-left py-2">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b border-zinc-800">
                <td className="py-3">{product.name}</td>

                <td className="text-center">
                  {getCategoryName(product.categoryId)}
                </td>

                <td className="text-center">P{product.price}</td>

                <td className="text-right">
                  <div className="flex justify-end items-center gap-3">
                    {/* Feature Toggle */}
                    <button
                      onClick={() => toggleFeature(product._id, !product.isFeatured)}
                      className={`px-2 py-1 text-xs rounded transition
                          ${product.isFeatured
                          ? "bg-green-500 text-black hover:bg-green-400"
                          : "bg-zinc-800 text-green-400 hover:bg-zinc-700"
                        }
                         `}
                    >
                      {product.isFeatured ? "Featured" : "Feature"}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-amber-500 hover:text-amber-400 flex items-center gap-1"
                    >
                      <Edit size={14} />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-500 hover:text-red-400 flex items-center gap-1"
                    >
                      <Trash size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <h3 className="text-xl font-bold mb-4">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h3>

        <ProductForm
          categories={flattenCategories(categories)}
          formData={formData}
          setFormData={setFormData}
          editingProduct={editingProduct}
          onSubmit={(e) => {
            handleSubmit(e);
            setIsFormOpen(false);
          }}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductManager;
