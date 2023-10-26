import { DataTypes, Sequelize } from 'sequelize';
import { attempt } from "./attempt.js";
import { diagnosis_list } from "./diagnosis_list.js";
import { diagnosis } from "./diagnosis.js";
import { end_user } from "./end_user.js";
import { examination_list } from "./examination_list.js";
import { examination_subtype } from "./examination_subtype.js";
import { examination_type } from "./examination_type.js";
import { examination } from "./examination.js";
import { introduction } from "./introduction.js";
import { medical_case } from "./medical_case.js";
import { medical_field } from "./medical_field.js";
import { module_type } from "./module_type.js";
import { step_specific_treatment } from "./step_specific_treatment.js";
import { step_specific_values } from "./step_specific_values.js";
import { step } from "./step.js";
import { summary } from "./summary.js";
import { treatment_list } from "./treatment_list.js";
import { treatment_subtype } from "./treatment_subtype.js";
import { treatment_type } from "./treatment_type.js";
import { treatment } from "./treatment.js";

/*
Defines the relations between all objects and initializes them
*/

attempt.belongsTo(end_user, {
  foreignKey: {
    name: 'user_id',
    type: DataTypes.UUID,
    allowNull: false
  }
});


attempt.belongsTo(medical_case, {
  foreignKey: {
    name: 'case_id',
    type: DataTypes.UUID,
    allowNull: false
  }
});

diagnosis_list.belongsTo(medical_field, {
  foreignKey: {
    name: 'medical_field_id',
    type: DataTypes.UUID,
  }
});

/*
diagnosis.hasOne(diagnosis_list, {
  foreignKey: {
    name: 'diagnosis_id',
    type: DataTypes.UUID,
  }
});
*/

examination_list.belongsTo(examination_type, {
  foreignKey: {
    name: 'examination_type_id',
    type: DataTypes.UUID,
    allowNull: false
  }
});


examination_list.belongsTo(examination_subtype, {
  foreignKey: {
    name: 'examination_subtype_id',
    type: DataTypes.UUID
  }
});



examination_subtype.belongsTo(examination_type, {
  foreignKey: {
    name: 'examination_type_id',
    type: DataTypes.UUID
  }
});


medical_case.belongsTo(end_user, {
  foreignKey: {
    name: 'creator_user_id',
    type: DataTypes.UUID,
  }
});

medical_case.belongsTo(medical_field, {
  foreignKey: {
    name: 'medical_field_id',
    type: DataTypes.UUID,
  }
});



step_specific_treatment.belongsTo(treatment, {
  foreignKey: {
    name: 'treatment_step_id',
    type: DataTypes.UUID,
    allowNull: false
  }
});

//step_specific_treatment.hasOne(treatment_list)

step_specific_values.belongsTo(examination, {
  foreignKey: {
    name: 'examination_step_id',
    type: DataTypes.UUID,
    allowNull: false
  }
});

//step_specific_values.hasOne(examination_list)

step.belongsTo(medical_case, {
  foreignKey: {
    name: 'case_id',
    type: DataTypes.UUID,
    allowNull: false
  }
});

step.belongsTo(module_type, {
  foreignKey: {
    name: 'module_type_identifier',
    type: DataTypes.INTEGER,
    allowNull: false
  }
});


treatment_list.belongsTo(treatment_type, {
  foreignKey: {
    name: 'treatment_type_id',
    type: DataTypes.UUID,
    allowNull: false
  }
});


treatment_list.belongsTo(treatment_subtype, {
  foreignKey: {
    name: 'treatment_subtype_id',
    type: DataTypes.UUID
  }
});

treatment_subtype.belongsTo(treatment_type, {
  foreignKey: {
    name: 'treatment_type_id',
    type: DataTypes.UUID
  }
});


export { attempt,
    diagnosis_list, 
    diagnosis,
    end_user,
    examination_list,
    examination_subtype,
    examination_type,
    examination,
    introduction,
    medical_case,
    medical_field,
    module_type,
    step_specific_treatment,
    step_specific_values,
    step,
    summary,
    treatment_list,
    treatment_subtype,
    treatment_type,
    treatment
}