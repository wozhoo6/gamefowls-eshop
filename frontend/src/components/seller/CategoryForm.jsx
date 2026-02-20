import React, { useState } from "react";
import { Plus } from "lucide-react";

export default function CategoryForm({
    categories,
    onSubmit,
    onCancel,
}) {
    const [categoryData, setCategoryData] = useState({
        name: '',
        parentId: null
    });

    const [addingSubCategory, setAddingSubCategory] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(categoryData);
        setCategoryData({
            name: '',
            parentId: null
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-100">
                    Categories
                </h3>

                {categories.length !== 0 && (<button
                    type="button"
                    onClick={() => {
                        setAddingSubCategory(prev => !prev);
                        setCategoryData({
                            ...categoryData,
                            parentId: categories[0]._id,
                        });
                    }}
                    className="flex items-center gap-2 text-sm border border-zinc-600 text-gray-300 hover:text-white hover:border-zinc-500 px-3 py-2 rounded-md"
                >
                    <Plus size={14} />
                    {!addingSubCategory ? 'Add Subcategory' : 'Add new'}
                </button>
                )}
            </div>

            {/* Subcategory section */}
            {addingSubCategory ? (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Categories
                    </label>
                    <select className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm w-full mb-2"
                        onChange={(e) => setCategoryData({ ...categoryData, parentId: e.target.value })}
                    >
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.displayName || cat.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="New subcategory name"
                        value={categoryData.name}
                        onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 w-full"
                        required
                    />
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Category Name
                    </label>
                    <input
                        type="text"
                        placeholder="New category"
                        value={categoryData.name}
                        onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                        className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 w-full"
                        required
                    />
                </div>
            )}
            {/* Actions */}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
                >
                    Add Category
                </button>
            </div>
        </form>
    );
}
