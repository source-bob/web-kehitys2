import { getAllExercises, getUsExById, uploadEx, deleteExerciseById, changingType } from "../models/exercises-model.js";

const getExercises = async (req, res) => {
    const result = await getAllExercises();

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

const findUsersExercises = async (req, res) => {
    const id = req.params.id;
    const result = await getUsExById(id);

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

const uploadNewExercise = async (req, res) => {
    const body = req.body;
    const result = await uploadEx(body);

    

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

const delExById = async (req, res) => {
    const id = req.params.id;
    const result = await deleteExerciseById(id);

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

const changeType = async (req, res) => {
    const id = req.params.id;
    const type = req.body.type;

    console.log('type:', type);
    console.log('id:', id);

    const result = await changingType(id, type);

    if (!result.error) {
        res.json(result);
    } else {
        res.status(500);
        res.json(result);
    }
};

export { getExercises, findUsersExercises, uploadNewExercise, delExById, changeType };