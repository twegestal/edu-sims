import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom';

export default function ShowAllCases(props) {
    const [allCases, setAllCases] = useState([]);
    const [medicalFields, setMedicalFields] = useState([]);

    useEffect(() => {
        const fetchCases = async () => {
            const headers = {
                "Content-type": "application/json",
            };

            const cases = await props.getCallToApi('http://localhost:5173/api/case/GetAllCases', headers);
            const fields = await props.getCallToApi('http://localhost:5173/api/case/getMedicalFields', headers);

            setAllCases(cases);
            setMedicalFields(fields);
        };

        fetchCases();
    }, []); // Empty dependency array runs the effect once when the component mounts

    const groupedCases = allCases.reduce((acc, caseItem) => {
        const medicalFieldId = caseItem.medical_field_id;
        if (!acc[medicalFieldId]) {
        acc[medicalFieldId] = [];
        }
        acc[medicalFieldId].push(caseItem);
        return acc;
    }, {});

    function getMedicalFieldName(medicalFieldId) {
        const medicalField = medicalFields.find((field) => field.id === medicalFieldId);
        return medicalField ? medicalField.name : 'Unknown';
    }


    return (
        <div>
            <Accordion allowToggle>
                {Object.keys(groupedCases).map((medicalFieldId) => (
                    <AccordionItem key={medicalFieldId}>
                            <AccordionButton>
                                <h2>{getMedicalFieldName(medicalFieldId)} </h2>
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                    {groupedCases[medicalFieldId].map((caseItem) => (
                                    <div key={caseItem.id}>
                                        <p>Name: {caseItem.name}</p>
                                        <Link to={"/case/caseid=" + caseItem.id}>
                                            <button>Starta fallet</button>
                                        </Link>
                                    </div>
                                    ))}
                            </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}