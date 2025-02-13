import { listAllMedications, getUsMedById, uploadMed, deleteMedicationById, changingDosage } from "../models/medication-model.js";

const getMedications = async (req, res) => {
    const result = await listAllMedications();

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

const addNewMedication = async (req, res) => {
    const body = req.body;
    const result = await uploadMed(body);

    

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

const findUsersMedications = async (req, res) => {
    const id = req.params.id;
    const result = await getUsMedById(id);

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

const deleteMedication = async (req, res) => {
    const id = req.params.id;
    const result = await deleteMedicationById(id);

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

const changeMedDosage = async (req, res) => {
    const id = req.params.id;
    const note = req.body.dosage;

    console.log('note:', note);
    console.log('id:', id);

    const result = await changingDosage(id, note);

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

export { getMedications, findUsersMedications, addNewMedication, deleteMedication, changeMedDosage };