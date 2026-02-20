import { Plus } from "lucide-react";

export default function ProductForm({
  categories,
  formData,
  setFormData,
  editingProduct,
  onSubmit,
  onCancel,
}) {


  console.log(formData)
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <select
        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
        value={formData.categoryiD}
        onChange={(e) =>
          setFormData({ ...formData, categoryId: e.target.value })
        }
        required
      >
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.displayName || cat.name}
          </option>
        ))}
      </select>

      <input
        required
        placeholder="Product Name"
        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />

      <textarea
        required
        placeholder="Product Description"
        rows={4}
        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 resize-none md:col-span-4"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <input
        required
        type="number"
        placeholder="Price"
        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
        value={formData.price}
        onChange={(e) =>
          setFormData({ ...formData, price: e.target.value })
        }
      />


      <input
        type="number"
        placeholder="Stock"
        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
        value={formData.stock}
        onChange={(e) => {
          // TODO: implement stock update logic
          setFormData({ ...formData, stock: e.target.value });
        }}
      />


      <div className="flex gap-2 md:col-span-4">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 rounded-md font-bold px-4 py-2 flex-1"
        >
          <Plus size={16} />
          {editingProduct ? "Update" : "Add"}
        </button>

        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 rounded-md font-bold px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
