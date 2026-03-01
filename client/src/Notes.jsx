import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const Notes = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState({});
    const [update, setUpdate] = useState(false);
    useEffect(() => {
        async function getNote() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}notes/getNote/${noteId}`, {
                    withCredentials: true
                });
                console.log(response.data);
                setNote(response.data.userNote);
            } catch (error) {
                toast.error(error.response?.data?.msg || "Something went wrong!");
                console.log(error);
            }
        }
        getNote();
    }, [noteId])
    const handleUpdate = async () => {
        setUpdate(true);
    }
    const handleUpdateSubmit = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}notes/updateNote/${noteId}`, { title: note.title, content: note.content }, {
                withCredentials: true
            });
            console.log(response.data);
            setNote(response.data.updatedNote);
            setUpdate(false);
            toast.success("Note updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong!");
            console.log(error);
        }
    }
    return (
        <div className="min-h-screen w-full bg-blue-100 p-6">
            <button onClick={() => navigate(-1)} className="mb-6 btn-cancel">← Back</button>
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-blue-300">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">{note.title}</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">{note.content}</p>
                <button onClick={handleUpdate} className="btn">Edit Note</button>
            </div>
            {update && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setUpdate(false);
                    }
                }}  >
                    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Note</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                                <input type="text" value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Content</label>
                                <textarea value={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })} className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-48 resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button onClick={handleUpdateSubmit} className="flex-1 btn">Save</button>
                            <button onClick={() => setUpdate(false)} className="flex-1 btn-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notes;       