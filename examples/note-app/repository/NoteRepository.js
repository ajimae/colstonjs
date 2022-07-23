/**
 * NoteRepository class
 * @class NotRepositorye
 * @methods getNotes
 * @methods postNote
 */
class NoteRepository {
  constructor(noteModels) {
    this.noteModels = noteModels;
  }

  /**
   * retrieve all available notes
   * @param {*} ctx 
   * @returns bun Response instance
   */
  async getNotes(ctx) {
    const { id } = await ctx.request.params;
    return this.noteModels.find(id) ?? {};
  }

  async getAllNotes() {
    return this.noteModels.findAll();
  }

  /**
   * post a single note data
   * @param {*} ctx 
   * @returns bun Response instance
   */
  async postNote(ctx) {
    const note = await ctx.request.body;
    const notes = await this.noteModels.save(note);

    return notes;
  }

  /**
   * delete a single note data
   * @param {*} ctx
   * @returns bun Reponse instance
   */
  async deleteNote(ctx) {
    const { id } = await ctx.request.query;
    return this.noteModels.Delete(id);
  }
}

export default NoteRepository;
