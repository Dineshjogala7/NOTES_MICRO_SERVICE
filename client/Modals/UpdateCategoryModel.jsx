import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateCategoryModel = ({ setUpdateModal, categoryId }) => {
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const handleUpdate = async () => {
        try {
            setLoading(true);
            if(!categoryName){
                toast.error("Provide the catgory details")
                return 
            }
            const response = await axios.put(`${import.meta.env.VITE_API_URL}category/updateCategory/${categoryId}`, { categoryName }, {
                withCredentials: true
            });
            console.log(response.data);
            toast.success(response.data.msg);
            setUpdateModal(false);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong!");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={(e) => {
            if (e.target === e.currentTarget) {
                setUpdateModal(false);
            }
            return
        }} >
            <div className="bg-white p-4 rounded-md max-w-md w-full flex flex-col gap-4">
                <h1 className="font-black text-2xl">Update Category</h1>
                <input type="text" placeholder="Category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="border border-black py-2 px-4 rounded-md" />
                <button onClick={handleUpdate} disabled={loading} className="btn">Update</button>
                <button onClick={() => setUpdateModal(false)} className="btn-cancel">Cancel</button>
            </div>
        </div>
    )
}

export default UpdateCategoryModel;   