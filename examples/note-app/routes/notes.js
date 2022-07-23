import { Router } from '../../../index';
import * as model from '../models';
import NoteRepository from '../repository';
import NoteController from '../controller';

const router = new Router();
const noteRepository = new NoteRepository(model);
const noteController = new NoteController(noteRepository);

router.get('/note/:id', noteController.getNotes.bind(noteController));
router.get('/notes', noteController.getAllNotes.bind(noteController));
router.post('/note', noteController.postNote.bind(noteController));
router.delete('/?id', noteController.deleteNote.bind(noteController));

export default router;
