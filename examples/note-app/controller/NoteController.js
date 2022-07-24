/**
 * NoteController class
 * @class NoteController
 * @methods getNotes
 * @methods postNotes
 */
class NoteController {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }

  /**
   * retrieve all available notes
   * @param {*} ctx 
   * @returns bun Response instance
   */
  async getNotes(ctx) {
    const notes = await this.noteRepository.getNotes(ctx);

    return ctx.status(200).json({
      success: true,
      data: notes
    });
  }

  /**
   * retrieve all available notes
   * @param {*} ctx 
   * @returns bun Response instance
   */
  async getAllNotes(ctx) {
    const notes = await this.noteRepository.getAllNotes();

    return ctx.status(200).json({
      success: true,
      data: notes
    });
  }

  /**
   * post a single note data
   * @param {*} ctx 
   * @returns bun Response instance
   */
  async postNote(ctx) {
    const notes = await this.noteRepository.postNote(ctx);

    return ctx.status(201).json({
      success: true,
      data: notes
    });
  }

  /**
   * delte a sinlge note data
   * @param {*} ctx
   * @returns bun Response instance
   */
  async deleteNote(ctx) {
    await this.noteRepository.deleteNote(ctx);
    return ctx.status(204).head();
  }
}

export default NoteController
