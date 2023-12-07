import {
  validateCaseInProgress,
  validateCaseToPublish,
  validateIntroductionModule,
  validateExaminationModule,
  validateDiagnosisModule,
  validateTreatmentModule,
  validateSummaryModule,
} from 'api';
import { describe, expect } from 'vitest';

describe('Validation of case tests', () => {
  it('should result in a successful validation of a case in progress', () => {
    const medicalCase = {
      name: 'Fallet Görel',
      creator_user_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateCaseInProgress(medicalCase);
    expect(result.success).toEqual(true);
  });

  it('should throw an error du to name of case not being a string', () => {
    const medicalCase = {
      name: 2,
      creator_user_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateCaseInProgress(medicalCase);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw error due to name of case in progress being to short', () => {
    const medicalCase = {
      name: '',
      creator_user_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateCaseInProgress(medicalCase);
    expect(result.errors[0].message).toEqual('Fallets namn behöver vara minst ett tecken långt');
  });

  it('should throw an error due to creator_user_id not being a string', () => {
    const medicalCase = {
      name: 'Fallet Görel',
      creator_user_id: 2,
    };
    const result = validateCaseInProgress(medicalCase);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });
  it('should throw an error due to creator_user_id not being uuid', () => {
    const medicalCase = {
      name: 'Fallet Görel',
      creator_user_id: 'hej',
    };
    const result = validateCaseInProgress(medicalCase);
    expect(result.success).toEqual(false);
  });

  it('should result in a successful validation of a case to publish', () => {
    const medicalCase = {
      name: 'Fallet Görel',
      creator_user_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
      steps: [{ name: 'introduction', stepData: { moduleMockData: 2 } }],
      medical_field_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateCaseToPublish(medicalCase);
    expect(result.success).toEqual(true);
  });

  it('should throw an error due to steps property being of length 0', () => {
    const medicalCase = {
      name: 'Fallet Görel',
      creator_user_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
      steps: [],
      medical_field_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };

    const result = validateCaseToPublish(medicalCase);
    expect(result.errors[0].message).toEqual('Fallet måste innehålla steg');
  });

  it('should throw an error due to medical_field_id not being a string', () => {
    const medicalCase = {
      name: 'Fallet Görel',
      creator_user_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
      steps: [{ name: 'introduction', stepData: { moduleMockData: 2 } }],
      medical_field_id: 2,
    };
    const result = validateCaseToPublish(medicalCase);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to medical_field_id not being a uuid', () => {
    const medicalCase = {
      name: 'Fallet Görel',
      creator_user_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
      steps: [{ name: 'introduction', stepData: { moduleMockData: 2 } }],
      medical_field_id: 'hej',
    };
    const result = validateCaseToPublish(medicalCase);

    expect(result.errors[0].message).toEqual('Invalid uuid');
  });
});

describe('validation of base module schema tests', () => {
  //(uses validateDiagnosisModule since that schema extends baseModuleSchema):
  it('should result in a successful validation of base module', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.success).toEqual(true);
  });

  it('should throw an error due to prompt not being a string', () => {
    const stepData = {
      prompt: 2,
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to prompt being too short', () => {
    const stepData = {
      prompt: '',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Uppmaning till användaren får inte vara tom');
  });

  it('should throw an error due to prompt containing the default value', () => {
    const stepData = {
      prompt: 'Fyll i din uppmaning till användaren   ',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Uppmaning till användaren är inte ifyllt');
  });

  it('should throw an error due to feedback_correct not being a string', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 2,
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to feedback_correct being too short', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: '',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Feedback för korrekt svar får inte vara tom');
  });

  it('should throw an error du to feedback_correct containing the default value', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Fyll i feedback för korrekt svar   ',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };

    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Feedback för korrekt svar har inte fyllts i');
  });

  it('should throw an error due to feedback_incorrect not being a string', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 2,
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to feedback_incorrect being too short', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: '',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Feedback för inkorrekt svar får inte vara tom');
  });

  it('should throw an error due to feedback_incorrect containing the default value', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: '   6Fyll i feedback för inkorrekt svar',
      diagnosis_id: 'ca50ee50-d9b6-44c7-a5ae-bb7167809ccf',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Feedback för inkorrekt svar är inte ifyllt');
  });
});

describe('validation of introduction module tests', () => {
  it('should result in a successful validation of introduction module', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.success).toEqual(true);
  });

  it('should throw an exception due to description not being a string', () => {
    const stepData = {
      description: 2,
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an exception due to description being too short', () => {
    const stepData = {
      description: '',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Beskrivning av patientmötet får inte vara tom');
  });

  it('should throw an exception due to description containing the default value', () => {
    const stepData = {
      description: '   askdjfgFyll i din beskrivning av ett patientmöte',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Beskrivning av patientmötet är inte ifyllt');
  });

  it('should throw an exception due to prompt not being a string', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 2,
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to prompt being too short', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: '',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Uppmaning till användaren får inte vara tom');
  });

  it('should throw an error due to prompt containing the default value', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 'Fyll i din uppmaning till användaren som en Ja/Nej-fråga+',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Uppmaning till användaren är inte ifyllt');
  });

  it('should throw an error due to feedback_correct not being a string', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 2,
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to feedback_correct being too short', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: '',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Feedback för korrekt svar får inte vara tom');
  });

  it('should throw an error due to feedback_correct containing the default value', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 'Fyll i feedback för korrekt svaro',
      feedback_incorrect: 'Inkorrekt feedback',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Feedback för korrekt svar har inte fyllts i');
  });

  it('should throw an error du to feedback_incorrect not being a string', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 2,
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to feedback_incorrect being too short', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: '',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Feedback för inkorrekt svar får inte vara tom');
  });

  it('should throw an error due to feedback_incorrect containing the default value', () => {
    const stepData = {
      description: 'En patient kommer in, ska den få vård?',
      prompt: 'Vill du utreda patienten vidare?',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Fyll i feedback för inkorrekt svarasugfdag7t0',
    };
    const result = validateIntroductionModule(stepData);
    expect(result.errors[0].message).toEqual('Feedback för inkorrekt svar är inte ifyllt');
  });
});

describe('validation of examination module tests', () => {
  it('should return a successful validation', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.success).toEqual(true);
  });

  it('should throw an error due to examination_to_display not having a key of type uuid', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        false: ['cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e', '95e3500d-7871-4c19-8c81-a7342c5b6fcb'],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Invalid uuid');
  });

  it('should throw an error due to examination_to_display having a property where the value is not an array', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': false,
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Expected array, received boolean');
  });

  it('should throw an error due to examination_to_display having a property where the value is an array of the wrong type', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [true, false],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received boolean');
  });

  it('should throw an error due to examination_to_display having a property where the value is an array of invalid uuids', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8',
          '95e3500d-7871-4c19-8c81-a7342c5b6fc',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdce',
          '95e3500d-7871-4c19-8c81-a7342c5b6cb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Invalid uuid');
  });

  it('should throw an error due to step_specific_values not being of type array', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: true,
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Expected array, received boolean');
  });

  it('should throw an error due to step_specific_values not being an array of type object', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [true, false],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Expected object, received boolean');
  });

  it('should throw an error due to the examination_id property in the array of step_specific_values not being of type string', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: true,
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received boolean');
  });

  it('should throw an error due to the examination_id property of the object in the array of step_specific_values not being a valid uuid', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d08041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Invalid uuid');
  });

  it('should throw an errror du to the is_normal property of the object in the array of step_specific_values not being of type boolean', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: 2,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Expected boolean, received number');
  });

  it('should throw an error due to the value property of the object in the array of step_specific_values not being of type string', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: true,
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received boolean');
  });

  it('should throw an error due to the value property of the object in the array of step_specific_values is too short', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: '',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Svarsvärdet på utredningen får inte vara tomt');
  });

  it('should throw an error due to the value property of the object in the array of step_specific_values containing the default value', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'Fyll i värde här ',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Svarsvärdet för utredning är inte ifyllt');
  });

  it('should throw an error due to step_specific_values being an array of length 0', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 4,
      step_specific_values: [],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual(
      'Korrekta utredningar samt svarsvärden är inte ifyllda',
    );
  });

  it('should throw an error due to max_nbr_tests not being of type number', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: true,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Expected number, received boolean');
  });

  it('should throw an error due to max_nbr_tests being less than 1', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      examination_to_display: {
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
        'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e': [
          'cc9c1cf9-ddc9-4b37-83f5-aeb777bfdc8e',
          '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
        ],
      },
      max_nbr_tests: 0,
      step_specific_values: [
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: true,
          value: 'det är lågt',
        },
        {
          examination_id: 'efae4854-c27e-48d3-8303-9cb14d085041',
          is_normal: false,
          value: 'det är högt',
        },
      ],
    };
    const result = validateExaminationModule(stepData);
    expect(result.errors[0].message).toEqual('Max antal test får inte vara lägre än 1');
  });
});

describe('validation of diagnosis module tests', () => {
  it('should result in a succesful validation of the module', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.success).toEqual(true);
  });

  it('should throw an error due to diagnosis_id not being a string', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: false,
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received boolean');
  });

  it('should throw an error due to diagnosis_id not being a valid uuid', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      diagnosis_id: '95e3500d-7871-4c19-8c81-a7342c5b6fc',
    };
    const result = validateDiagnosisModule(stepData);
    expect(result.errors[0].message).toEqual('Rätt diagnos måste vara vald');
  });
});

describe('validation of treatment module tests', () => {
  it('should result in a successful validation of module', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      module_type_identifier: 3,
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [
        {
          treatment_id: '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
          value: 'ge en sådär fyra piller',
        },
      ],
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.success).toEqual(true);
  });

  it('should throw an error due to step_specific_treatments not being of type array', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: 'hej',
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Expected array, received string');
  });

  it('should throw an error due to the elements of the array of step_specific_treatments not being of type object', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [true, false],
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Expected object, received boolean');
  });

  it('should throw an error due to the treatment_id property of the object in the array of step_specific_treatments not being of type string', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [
        {
          treatment_id: 42,
          value: 'ge en sådär fyra piller',
        },
      ],
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to the treatment_id property of the object in the array of step_specific_treatments not being a valid uuid', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [
        {
          treatment_id: '9e3500d-7871-4c19-8c81-a7342c5b6fcb',
          value: 'ge en sådär fyra piller',
        },
      ],
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Invalid uuid');
  });

  it('should throw an error due to the array in step_specific_treatments being of length 0', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [],
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Korrekta behandlingar är inte ifyllda');
  });

  it('should throw an error due to the object in treatments_to_display not having a key that is a valid uuid', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [
        {
          treatment_id: '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
          value: 'ge en sådär fyra piller',
        },
      ],
      treatments_to_display: {
        false: ['ca001c04-c493-4812-bc46-659368764dd9', 'ca001c04-c493-4812-bc46-659368764dd9'],
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-659368764dd9',
          'ca001c04-c493-4812-bc46-659368764dd9',
        ],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Invalid uuid');
  });

  it('should throw an error due to the value of the properties in the object of treatments_to_display not being of type array', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [
        {
          treatment_id: '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
          value: 'ge en sådär fyra piller',
        },
      ],
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': true,
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Expected array, received boolean');
  });

  it('should throw an error due to the elements of the array in the keys of the treatments_to_display property not being of type string', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [
        {
          treatment_id: '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
          value: 'ge en sådär fyra piller',
        },
      ],
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [true, false],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received boolean');
  });

  it('should throw an error due to the elements of the array in the keys of the treatments_to_display property not being valid uuids', () => {
    const stepData = {
      prompt: 'Generisk uppmaning till användaren',
      feedback_correct: 'Korrekt feedback',
      feedback_incorrect: 'Inkorrekt feedback',
      step_specific_treatments: [
        {
          treatment_id: '95e3500d-7871-4c19-8c81-a7342c5b6fcb',
          value: 'ge en sådär fyra piller',
        },
      ],
      treatments_to_display: {
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-4812-bc46-65936764dd9',
          'ca001c04-c493-4812-bc46-659368764d9',
        ],
        '95e3500d-7871-4c19-8c81-a7342c5b6fcb': [
          'ca001c04-c493-412-bc46-659368764dd9',
          'ca001c04-c4e93-4812-bc46-659368764dd9',
        ],
      },
    };
    const result = validateTreatmentModule(stepData);
    expect(result.errors[0].message).toEqual('Invalid uuid');
  });
});

describe('validation of summary module tests', () => {
  it('should result in a successful validation of the module', () => {
    const stepData = {
      additional_info: 'Här kommer lite övrig information om sjukdomen...',
      additional_links: 'Här kommer lite länkar för vidare läsning...',
      process: 'Här kommer den korrekta proceduren som om ett proffs hade gjort det...',
    };
    const result = validateSummaryModule(stepData);
    expect(result.success).toEqual(true);
  });

  it('should throw an error due to additional_info not being of type string', () => {
    const stepData = {
      additional_info: 42,
      additional_links: 'Här kommer lite länkar för vidare läsning...',
      process: 'Här kommer den korrekta proceduren som om ett proffs hade gjort det...',
    };
    const result = validateSummaryModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should receive an error due to additional_links containing the default value', () => {
    const stepData = {
      additional_info: 'Fyll i övrig information om sjukdomen till studenten ',
      additional_links: 'Här kommer lite länkar för vidare läsning...',
      process: 'Här kommer den korrekta proceduren som om ett proffs hade gjort det...',
    };
    const result = validateSummaryModule(stepData);
    expect(result.errors[0].message).toEqual('Övrig information om sjukdomen är inte ifyllt');
  });

  it('should throw an error du to additional_links not being of type string', () => {
    const stepData = {
      additional_info: 'Här kommer lite övrig information om sjukdomen...',
      additional_links: true,
      process: 'Här kommer den korrekta proceduren som om ett proffs hade gjort det...',
    };
    const result = validateSummaryModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received boolean');
  });

  it('should throw an error due to additional_links containing the default value', () => {
    const stepData = {
      additional_info: 'Här kommer lite övrig information om sjukdomen...',
      additional_links: 'Fyll i länkar till övrig information om sjukdomen   ',
      process: 'Här kommer den korrekta proceduren som om ett proffs hade gjort det...',
    };
    const result = validateSummaryModule(stepData);
    expect(result.errors[0].message).toEqual('Övriga länkar om sjukdomen är inte ifyllda');
  });

  it('should throw an error due to process not being of type string', () => {
    const stepData = {
      additional_info: 'Här kommer lite övrig information om sjukdomen...',
      additional_links: 'Här kommer lite länkar för vidare läsning...',
      process: 22,
    };
    const result = validateSummaryModule(stepData);
    expect(result.errors[0].message).toEqual('Expected string, received number');
  });

  it('should throw an error due to process being too short', () => {
    const stepData = {
      additional_info: 'Här kommer lite övrig information om sjukdomen...',
      additional_links: 'Här kommer lite länkar för vidare läsning...',
      process: '',
    };
    const result = validateSummaryModule(stepData);
    expect(result.errors[0].message).toEqual('Processen får inte vara mindre än ett tecken');
  });

  it('should throw an error due to process containing the default value', () => {
    const stepData = {
      additional_info: 'Här kommer lite övrig information om sjukdomen...',
      additional_links: 'Här kommer lite länkar för vidare läsning...',
      process: 'Hur hade den korrekta processen sett ut om en läkare tagit sig an fallet?  ',
    };
    const result = validateSummaryModule(stepData);
    expect(result.errors[0].message).toEqual('Korrekt procedur är inte ifylld');
  });
});
