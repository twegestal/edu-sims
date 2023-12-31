import { db } from '../database/databaseConnection.js';

export const populateDB = async () => {
  db.models.end_user.bulkCreate([
    {
      email: '1',
      password: '1',
      is_admin: true,
      group_id: 'admin',
    },
    {
      email: '2',
      password: '2',
      is_admin: false,
      group_id: 'user',
    },
  ]);

  //examination_type
  const examinationTypes = await db.models.examination_type.bulkCreate([
    {
      name: 'Labbanalyser',
    },
    {
      name: 'Radiologiska Undersökningar',
    },
    {
      name: 'Övriga åtgärder',
    },
  ]);
  //examination_subtype
  const examinationSubTypes = await db.models.examination_subtype.bulkCreate([
    {
      examination_type_id: examinationTypes[0].id,
      name: 'Blod',
    },
    {
      examination_type_id: examinationTypes[0].id,
      name: 'Urin',
    },
    {
      examination_type_id: examinationTypes[0].id,
      name: 'Övriga labbanalyser',
    },
    {
      examination_type_id: examinationTypes[1].id,
      name: 'Övriga Radiologiska Undersökningar',
    },
    {
      examination_type_id: examinationTypes[2].id,
      name: 'Övriga åtgärder',
    },
  ]);
  //examination_list
  db.models.examination_list.bulkCreate([
    {
      name: 'Hb',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'LPK',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Neutrofila',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'TPK',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Elstatus',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Na',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'K',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Krea',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'TSH',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Ft4',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Ft3',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Jon.Kalcium',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Leverstatus',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'ASAT',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'ALAT',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'ALP',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Bilirubin',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Prolaktin',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Kortisol kl.08',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'IGF-1',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'PTH',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'EVF',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Lipidstatus',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Total kolesterol',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'HDL',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'LDL',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Triglycerider',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'FSH',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'LH',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Testosteron',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Östradiol',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Albumin',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'GH',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Aldosteron',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Renin',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'P-metoxiadrenalin',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'P-Metoxinoredrenalin',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Glukos',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'HbA1c',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'TRAK',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'anti-TPO',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'anti-ICA',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Anti-GAD',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'anti-IA-2',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: '21-OH antikroppar',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'c-peptid',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'CRP',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'SR',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'P-osmolalitet',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Blodgas',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'ACTH',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Dexametasonhämningstest',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'Synacthentest',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'SHBG',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: '250H vit D',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: '1,25 dihydroxyvitamin D',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[0].id,
    },
    {
      name: 'U-osmolalitet',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[1].id,
    },
    {
      name: 'Tu-kortisol',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[1].id,
    },
    {
      name: 'Tu-kalcium',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[1].id,
    },
    {
      name: 'Tu-metoxikatekolaminer',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[1].id,
    },
    {
      name: 'Urinsticka',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[1].id,
    },
    {
      name: 'Urin K',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[1].id,
    },
    {
      name: 'Albumin/kreatinin',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[1].id,
    },
    {
      name: 'Saliv kortisol',
      examination_type_id: examinationTypes[0].id,
      examination_subtype_id: examinationSubTypes[2].id,
    },
    {
      name: 'MR sella turcica',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'MR hjärna',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'MR thorax',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'MR buk',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'MR binjure',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'DT binjure',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'DT hjärna',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'DT thorax',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'DT buk',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'ULJ Lever',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'ULJ tyreoida',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'ULJ tyreoida med finnålspunktion',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'Binjurevenskatetesering',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'Lungröntgen',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'Tyeoideasintigrafi',
      examination_type_id: examinationTypes[1].id,
      examination_subtype_id: examinationSubTypes[3].id,
    },
    {
      name: 'Ring endokrinkonsult',
      examination_type_id: examinationTypes[2].id,
      examination_subtype_id: examinationSubTypes[4].id,
    },
    {
      name: 'Ring medicinbakjour',
      examination_type_id: examinationTypes[2].id,
      examination_subtype_id: examinationSubTypes[4].id,
    },
    {
      name: 'Remiss till neuroofthalmologen',
      examination_type_id: examinationTypes[2].id,
      examination_subtype_id: examinationSubTypes[4].id,
    },
    {
      name: 'Remiss endokrinolog',
      examination_type_id: examinationTypes[2].id,
      examination_subtype_id: examinationSubTypes[4].id,
    },
    {
      name: 'Komplettera med ytterligare frågor till patient',
      examination_type_id: examinationTypes[2].id,
      examination_subtype_id: examinationSubTypes[4].id,
    },
    {
      name: 'Remiss till neurokirurgen med önskemål om operation',
      examination_type_id: examinationTypes[2].id,
      examination_subtype_id: examinationSubTypes[4].id,
    },
    {
      name: 'Remiss till endokrinkirurgen med önskemål om operation',
      examination_type_id: examinationTypes[2].id,
      examination_subtype_id: examinationSubTypes[4].id,
    },
  ]);
  //examination
  //examination_specific_values

  //treatment_type
  //treatment_subtype
  //treatment_list
  //treatment
  //step_specific_treatment

  //medical_field
  const endokrina = await db.models.medical_field.create({
    name: 'Endokrina sjukdomar',
  });

  //diagnosis_list
  const primar = await db.models.diagnosis_list.create({
    name: 'Primär Aldesteronism',
    medical_field_id: endokrina.id,
  });

  //diagnosis
  const diagnos = await db.models.diagnosis.create({
    promt: 'Vad är din diagnos?',
    diagnosis_id: primar.id,
    feedback_correct:
      'A/R-kvoten är förhöjd vilket talar för primär aldosteronism n/ Saltbelastning är ett bekräftande test för primär aldosteronism',
    feedback_incorrect:
      'A/R-kvoten är förhöjd vilket talar för primär aldosteronism n/ Saltbelastning är ett bekräftande test för primär aldosteronism',
  });

  //introduction
  const intro = await db.models.introduction.create({
    description:
      'En 50-årig man kommer på vårdcentralen för hälsokontroll. Har flyttat från Iran till Sverige för 40 år sedan. Är gift och har två biologiska barn. Han är frisk sedan tidigare och tar inte några mediciner. Har aldrig rökt och dricker inte alkohol. Jobbar som apotekare. Han tränar bara sporadiskt. Patientens far har drabbats av en mindre hjärnblödning i 39 års ålder och modern är frisk. Han är välmående och har inte några klagomål men vill bli kontrollerad i och med han fyllde 50 i år. Vid undersökning: hjärtat slår regelbundet utan några blåsljud, lungor utan anmärkning. Ser frisk ut, dock något överviktig med BMI 29. Har inte några utan dysendokrina drag. Man tar ett blodtryck som ligger på 165/105. Man har inför besöket tagit Hb 145 g/L (134–170), Na 143 mmol/l (137–145), K 3.2 mmol/l (3.6-4.6), kreatinin 97 µmol/L (60-105)',
    prompt: 'Finns det anledning att utreda denna patient vidare?',
    feedback_correct:
      'A/R-kvoten är förhöjd vilket talar för primär aldosteronism n/ Saltbelastning är ett bekräftande test för primär aldosteronism',
    feedback_incorrect:
      'A/R-kvoten är förhöjd vilket talar för primär aldosteronism n/ Saltbelastning är ett bekräftande test för primär aldosteronism',
  });

  //summary

  //module_type

  //medical_case

  //step
  //attempt??
};
