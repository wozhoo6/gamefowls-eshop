import { Plus, X } from "lucide-react";
import { useRef } from "react";

export default function ProductForm({
  categories,
  formData,
  setFormData,
  editingProduct,
  onSubmit,
  onCancel,
}) {

  const fileInputRef = useRef(null);

  // Convert file to base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    const base64Images = await Promise.all(
      files.map((file) => convertToBase64(file))
    );

    setFormData({
      ...formData,
      images: [...(formData.images || []), ...base64Images],
    });
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      {/* CATEGORY */}
      <select
        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
        value={formData.categoryId}
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

      {/* NAME */}
      <input
        required
        placeholder="Product Name"
        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />

      {/* DESCRIPTION */}
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

      {/* PRICE */}
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

      {/* STOCK */}
      <input
        type="number"
        placeholder="Stock"
        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2"
        value={formData.stock}
        onChange={(e) =>
          setFormData({ ...formData, stock: e.target.value })
        }
      />

      {/* IMAGE UPLOAD */}
      <div className="md:col-span-4">
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-md mb-3"
        >
          Upload Images
        </button>

        {/* IMAGE PREVIEW */}
        <div className="flex gap-3 flex-wrap">
          {formData.images?.map((img, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={img}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
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