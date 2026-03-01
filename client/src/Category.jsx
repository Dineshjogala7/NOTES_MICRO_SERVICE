import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Notes from "./Notes";
import { useNavigate, useParams } from "react-router-dom";
import AddNotesModel from "../Modals/AddNotesModel";
const Category = () => {
    const { categoryId } = useParams();
    const [notes, setNotes] = useState([]);
    const [addNote, setAddNote] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        async function getNotes() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}notes/getNotesByCategory/${categoryId}`, {
                    withCredentials: true
                });
                console.log(response.data);
                setNotes(response.data.userNotesByCategory);
            } catch (error) {
                toast.error(error.response?.data?.msg || "Something went wrong!");
                console.log(error);
            }
        }
        getNotes();
    }, [categoryId])
    const handleNoteClick = (noteId) => {
        navigate(`/note/${noteId}`);
    }
    const handleDelete = async (noteId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}notes/deleteNote/${noteId}`, {
                withCredentials: true
            });
            toast.success(response.data?.msg || "Note deleted");
            setNotes(notes.filter(n => n._id !== noteId));
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong!");
        }
    }
    const handleUpdate = (noteId) => {
        navigate(`/note/${noteId}`);
    }
    return (
        <div className="min-h-screen w-full bg-blue-100">
            <div className="flex justify-evenly items-baseline  bg-blue-200 px-8 gap-8 ">
                <button onClick={() => navigate(-1)} className="mb-6 btn-cancel">← Back</button>
                <h1 className="flex-1">Category</h1>
               <button onClick={() => setAddNote(true)} className="py-6 px-8 rounded-full bg-blue-300 hover:bg-blue-500 transistion mb-4">Add Note</button>
            </div>
            <div className="flex justify-between items-center gap-8 mt-4 px-24">
                {notes.map((note) => {
                return (
                    <div key={note._id} className=" w-full bg-white px-4 py-8 rounded-md border border-blue-300 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-4 flex-1" onClick={() => handleNoteClick(note._id)}>
                            <p className="text-xl font-bold">{note.title}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="btn-cancel" onClick={() => handleDelete(note._id)}>Delete</button>
                            <button className="btn" onClick={() => handleUpdate(note._id)}>Update</button>
                        </div>
                    </div>
                )
                })}
            </div>
            {addNote && <AddNotesModel setAddNote={setAddNote} catId={categoryId} />}
        </div>
    )
}

export default Category;    