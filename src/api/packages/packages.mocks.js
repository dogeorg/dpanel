export function generatePackageList(input) {
  const randomChoice = (choices) => choices[Math.floor(Math.random() * choices.length)];

  const generateRandomConfig = () => {
    const sectionNames = ['identity', 'connection'];
    const fieldTypes = ['text', 'textarea', 'number'];
    const section = randomChoice(sectionNames);
    const field = randomChoice(fieldTypes)

    return {
      sections: [
        {
          name: section,
          fields: [
            {
              label: `${field.charAt(0).toUpperCase() + section.slice(1)} Field`,
              name: field,
              type: randomChoice(fieldTypes),
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