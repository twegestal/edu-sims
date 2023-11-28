import { useState } from 'react';
import { useCreateCase } from '../hooks/useCreateCase';

const [examinationCategories, setExaminationCategories] = useState();
const [examinationSubcategories, setExaminationSubcategories] = useState();
const [examinationList, setExaminationList] = useState();

const { getAllExaminationTypes, getAllExaminationSubtypes, getExaminationList } = useCreateCase();

export const fetchExaminationCategories = async () => {};
