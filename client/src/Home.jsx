import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UpdateCategoryModel from "../Modals/UpdateCategoryModel";
import AddCategoryModel from "../Modals/AddCategoryModel";
const Home = () => {
    const [categories, setCategories] = useState([]);
    const [updateModal, setUpdateModal] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [createModal, setCreateModal] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}category/getCategories`, {
                    withCredentials: true
                });
                setCategories(response.data.userCategories);
            } catch (error) {
                console.log(error);
            }
        }
        getCategories();
    }, [])
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}users/auth/logout`, {}, {
                withCredentials: true
            });
            console.log(response.data);
            toast.success(response.data.msg);
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong!");
            console.log(error);
        }
    }
    const handleDelete = async (categoryId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}category/deleteByCategory/${categoryId}`, {
                withCredentials: true
            });
            console.log(response.data);
            toast.success(response.data.msg);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong!");
            console.log(error);
        }
    }
    const handleUpdate = async (categoryId) => {
        setCategoryId(categoryId);
        setUpdateModal(true);
    }

    const handleCategoryClick = (categoryId) => {
        setCategoryId(categoryId);
        navigate(`/category/${categoryId}`);
    }
    return (
        <div className="min-h-screen w-full bg-blue-100">
            <nav className="flex justify-between items-center p-4 bg-blue-200">
                <h1 className = "font-extrabold">Notes App</h1> 
                <div className="flex gap-4 items-baseline">
                <button className="btn-cancel" onClick={handleLogout}>Logout</button>
                <button className="btn" onClick={() => setCreateModal(true)}>Create Category</button>
                </div>
            </nav>
            <section className="mt-8 px-24">
                {categories.map((category) => {
                    return (
                        <div key={category._id} className="bg-white px-4 py-8 rounded-md border border-blue-300 flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-4 flex-1" onClick={() => handleCategoryClick(category._id)}>
                                <p className="text-xl font-bold">{category.name}</p>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <button className="btn-cancel" onClick={() => handleDelete(category._id)}>Delete</button>
                                <button className="btn" onClick={() => handleUpdate(category._id)}>Update</button>
                            </div>
                        </div>
                    )
                })}
            </section>
            {updateModal && <UpdateCategoryModel setUpdateModal={setUpdateModal} categoryId={categoryId} />}
            {createModal && <AddCategoryModel setCreateModal={setCreateModal} />}
        </div>
    )
}

export default Home;