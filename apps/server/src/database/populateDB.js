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
    const endokrina = await db.models.medical_field.create({
        name: 'Endokrina sjukdomar'
    })

    //diagnosis_list
    const primar = await db.models.diagnosis_list.create({
        name: 'Primär Aldesteronism',
        medical_field_id: endokrina.id
    })

    //diagnosis
    const diagnos = await db.models.diagnosis.create({
        promt: 'Vad är din diagnos?',
        diagnosis_id: primar.id,
        feedback_correct: 'A/R-kvoten är förhöjd vilket talar för primär aldosteronism n/ Saltbelastning är ett bekräftande test för primär aldosteronism',
        feedback_incorrect: 'A/R-kvoten är förhöjd vilket talar för primär aldosteronism n/ Saltbelastning är ett bekräftande test för primär aldosteronism'
    })

    //introduction
    const intro = await db.models.introduction.create({
        description: 'En 50-årig man kommer på vårdcentralen för hälsokontroll. Har flyttat från Iran till Sverige för 40 år sedan. Är gift och har två biologiska barn. Han är frisk sedan tidigare och tar inte några mediciner. Har aldrig rökt och dricker inte alkohol. Jobbar som apotekare. Han tränar bara sporadiskt. Patientens far har drabbats av en mindre hjärnblödning i 39 års ålder och modern är frisk. Han är välmående och har inte några klagomål men vill bli kontrollerad i och med han fyllde 50 i år. Vid undersökning: hjärtat slår regelbundet utan några blåsljud, lungor utan anmärkning. Ser frisk ut, dock något överviktig med BMI 29. Har inte några utan dysendokrina drag. Man tar ett blodtryck som ligger på 165/105. Man har inför besöket tagit Hb 145 g/L (134–170), Na 143 mmol/l (137–145), K 3.2 mmol/l (3.6-4.6), kreatinin 97 µmol/L (60-105)',
        prompt: 'Finns det anledning att utreda denna patient vidare?',
        feedback_correct: 'A/R-kvoten är förhöjd vilket talar för primär aldosteronism n/ Saltbelastning är ett bekräftande test för primär aldosteronism',
        feedback_incorrect: 'A/R-kvoten är förhöjd vilket talar för primär aldosteronism n/ Saltbelastning är ett bekräftande test för primär aldosteronism'
    })

    //summary

    //module_type

    //medical_case

    //step
    //attempt??


    


}


