const Note = require("../models/Notes");
const redisClient = require("../config/redisClient");

// Helper: invalidate caches affected by note changes
async function invalidateNoteCaches({ userId, noteId = null, categoryId = null }) {
  const keys = [];

  // single note cache
  if (noteId) keys.push(`note:${userId}:${noteId}`);

  // notes by category cache
  if (categoryId) keys.push(`notesByCategory:${userId}:${categoryId}`);

  
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}

async function createNote(req, res) {
  try {
    const { title, content, categoryId } = req.body;
    const userId = req.user.userId;

    const note = await Note.create({ title, content, categoryId, userId });

   
    await invalidateNoteCaches({ userId, categoryId });

    return res.status(201).json({ msg: "Notes is created", note });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error in creating the notes" });
  }
}

async function getNote(req, res) {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.userId;

    const key = `note:${userId}:${noteId}`;

    // Cache hit
    const cachedData = await redisClient.get(key);
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    // Cache miss - DB (secure)
    const userNote = await Note.findOne({ _id: noteId, userId });
    if (!userNote) return res.status(404).json({ msg: "Notes is not found" });

    const payload = { msg: "Notes fetched successfully", userNote };

    // Store cache
    await redisClient.setEx(key, 60, JSON.stringify(payload));

    return res.status(200).json(payload);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error in getting the notes" });
  }
}

async function getNotesByCategory(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const userId = req.user.userId;

    const key = `notesByCategory:${userId}:${categoryId}`;

    // Cache hit
    const cachedData = await redisClient.get(key);
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    // Cache miss -> DB
    const userNotesByCategory = await Note.find({ categoryId, userId });

    // (Better API design: return [] instead of 404) , we should return the empty List , such that  we can easily return  it by the nxt time cache hit 
    const payload = {
      msg: "user notes by category fetched successfully",
      userNotesByCategory,
    };

    await redisClient.setEx(key, 60, JSON.stringify(payload));

    return res.status(200).json(payload);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Server error in fetching the userNotes by category" });
  }
}

async function deleteNote(req, res) {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.userId;

    // Find note first to get categoryId (needed for cache invalidation)
    const note = await Note.findOne({ _id: noteId, userId }).select("categoryId");
    if (!note) return res.status(404).json({ msg: "Notes not found to delete!" });

    const categoryId = note.categoryId?.toString();

    // Delete (secure)
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

    // Invalidate caches: single note + category list
    await invalidateNoteCaches({ userId, noteId, categoryId });

    return res.json({ msg: "Notes Deleted successfully", deletedNote });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error in deleting notes" });
  }
}

async function updateNote(req, res) {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.userId;

    const { title , content  } = req.body;

    // Whitelist to prevent updating forbidden fields
    

    // Get categoryId first (for invalidating notesByCategory cache)
    const existing = await Note.findOne({ _id: noteId, userId }).select("categoryId");
    if (!existing) return res.status(404).json({ msg: "Unable to update the notes data" });

    const categoryId = existing.categoryId?.toString();

    const update = {title , content };

    // Update (secure)
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      update,
      { new: true }
    );

    // Invalidate caches: single note + category list
    await invalidateNoteCaches({ userId, noteId, categoryId });

    return res.json({ msg: "Updated the notes data", updatedNote });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error in updating the notes data" });
  }
}

module.exports = { createNote, getNote, getNotesByCategory, deleteNote, updateNote };