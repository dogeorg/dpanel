export function generatePackageList(input) {
  const randomChoice = (choices) => choices[Math.floor(Math.random() * choices.length)];

  const generateRandomConfig = () => {
    const sectionNames = ['Identity', 'Connection'];
    const fieldTypes = ['text', 'textarea', 'number'];
    const field1 = randomChoice(fieldTypes)
    const field2 = randomChoice(fieldTypes)
    const field3 = randomChoice(fieldTypes)

    return {
      sections: [
        {
          name: sectionNames[0],
          fields: [
            {
              label: `${field1.charAt(0).toUpperCase() + field1.slice(1)} Field`,
              name: `${field1}_1`,
              type: field1,
              required: randomChoice[true, false]
            },
            {
              label: `${field2.charAt(0).toUpperCase() + field2.slice(1)} Field`,
              name: `${field2}_2`,
              type: field2,
              required: randomChoice[true, false]
            },
            {
              label: `${field3.charAt(0).toUpperCase() + field3.slice(1)} Field`,
              name: `${field3}_3`,
              type: field3,
              required: randomChoice[true, false]
            },
          ],
        },
        {
          name: sectionNames[1],
          fields: [
            {
              label: `${field1.charAt(0).toUpperCase() + field1.slice(1)} Field`,
              name: `${field1}_1`,
              type: field1,
              required: randomChoice[true, false]
            },
          ],
        },
      ],
    };
  };

  const generateRandomStats = () => {
    return {
      CPU_PERCENT_30: Array.from({ length: 6 }, () => Math.random()),
      MEM_PERCENT_30: Array.from({ length: 6 }, () => Math.random()),
    };
  };

  const generateRandomStatus = () => {
    const statuses = ['running', 'stopped'];
    return randomChoice(statuses);
  };

  const randomSemver = () => Array
    .from({ length: 3 }, () => Math.floor(Math.random() * 10))
    .join('.');

  const names = Array.isArray(input) ? input : Array.from({ length: input }, (_, index) => `Package_${index + 1}`);
  return names.map((name) => ({
    package: name,
    version: randomSemver(),
    hash: Math.random().toString(36).substring(2, 15),
    command: {
      path: `/path/to/${name}`,
      args: '',
      cwd: `/current/working/directory/${name}`,
      env: null,
      status: generateRandomStatus(),
      stats: generateRandomStats(),
      config: generateRandomConfig(),
      configFiles: null,
    },
  }));
}