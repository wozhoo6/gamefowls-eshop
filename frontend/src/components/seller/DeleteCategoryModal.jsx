import React from 'react'

export default function DeleteCategoryModal({
    open,
    handleDeleteCategory,
    setShowDeleteModal,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-white mb-2">
                    Delete category?
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    This action cannot be undone. Products and subcategory under this category will be deleted.
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            handleDeleteCategory();
                            setShowDeleteModal(false);
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
