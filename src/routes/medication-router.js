import express from 'express';
import {
    getMedications,
    findUsersMedications,
    addNewMedication,
    deleteMedication,
    changeMedDosage,
} from '../controllers/medication-controller.js';

const medicationRouter = express.Router();

medicationRouter.route('/').get(getMedications).post(addNewMedication);

medicationRouter.route('/:id')
    .get(findUsersMedications)
    .delete(deleteMedication)
    .put(changeMedDosage);

export default medicationRouter;