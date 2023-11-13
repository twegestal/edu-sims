import { db } from '../database/databaseConnection.js';




export const populateDB = async () => {
    db.models.end_user.bulkCreate([
        {
            email: '1',
            password: '1',
            is_admin: true,
            group_id: 'admin'
        },
        {
           email: '2',
           password: '2',
           is_admin: false,
           group_id: 'user'
        }
    ])

    //examination_type
    //examination_subtype
    //examination_list
    //examination
    //examination_specific_values

    //treatment_type
    //treatment_subtype
    //treatment_list
    //treatment
    //step_specific_treatment

    //medical_field
    //diagnosis_list
    //diagnosis

    //introduction
    //summary

    //module_type

    //medical_case

    //step
    //attempt??


    


}


