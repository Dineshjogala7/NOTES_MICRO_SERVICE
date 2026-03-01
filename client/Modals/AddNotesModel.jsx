import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const AddNotesModel = ({ setAddNote, catId }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const handleAddNote = async () => {
        try {
            if(!catId){
                toast.error("Please select a category!");
                return;
            }
            const response = await axios.post(`${import.meta.env.VITE_API_URL}notes/createNote`, { title, content, categoryId:catId }, {
                withCredentials: true
            });
            console.log(response.data);
            toast.success(response.data.msg);
            setAddNote(false);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong!");
            console.log(error);
        }
    }
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setAddNote(false); }}>
            <div className="bg-white p-6 rounded-md max-w-md w-full flex flex-col gap-4">
                <h1 className="font-black text-2xl">Add Note</h1>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-black px-4 py-2 rounded-md" />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="border border-black px-4 py-2 rounded-md h-32"></textarea>
                <button onClick={handleAddNote} className="btn">Add Note</button>
                <button onClick={() => setAddNote(false)} className="btn-cancel">Cancel</button>
            </div>
        </div>
    )
}

export default AddNotesModel;       