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

  const produce = (array) => {
    return array.map((name) => ({
      package: name,
      version: randomSemver(),
      hash: Math.random().toString(36).substring(2, 15),
      command: {
        path: `/path/to/${name}`,
        args: '',
        cwd: `/current/working/directory/${name}`,
        env: null,
        // status: generateRandomStatus(),
        status: name === 'Core' ? 'running' : 'stopped',
        stats: generateRandomStats(),
        config: generateRandomConfig(),
        configFiles: null,
      },
      docs: mockDocs[name] || mockDocs.lorem,
    }))
  }

  // 'Mock a hardcoded set'
  if (!input) {
    return {
      local: {
        installed: produce(['Core']),
        available: produce(['Identity', 'GigaWallet', 'ShibeShop'])
      }
    }
  }

  // Mock a dynamic set that considers the input.
  return {
    local: {
      available: produce(names),
      installed: []
    }
  }

}

const mockDocs = {
  GigaWallet: {
    about: `<h1>GigaWallet</h1>
      <h2>The Ultimate Dogecoin Payment Solution</h2>
      <p>Introducing GigaWallet, a powerful backend service that enables seamless integration of Dogecoin transactions into your application. With GigaWallet, online stores, exchanges, and social media platforms can easily incorporate Dogecoin payments, providing users with a convenient and secure payment option.</p>
      `
  },
  lorem: {
    about: `<h1>Such Package</h1>
      <h2>Much useful</h2>
      <p>In esse do tempor commodo cupidatat ullamco deserunt deserunt dolore ullamco consectetur et esse incididunt do ad veniam fugiat non pariatur nulla cillum laborum tempor excepteur. Laquis dolore et mollit est aliqua velit dolor id magna tempor sed ex irure eu officia proident sed aliqua nisi ut dolor excepteur adipisicing reprehenderit excepteur dolor laborum proident voluptate quis.</p>
      <p>Labore eiusmod anim do culpa non reprehenderit do sint anim proident aliqua do commodo dolore reprehenderit dolor fugiat elit irure enim mollit ut magna in tempor ex pariatur ullamco</p>`
  }
}