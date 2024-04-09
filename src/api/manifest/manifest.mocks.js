export function generateManifests(input) {
  const randomChoice = (choices) => choices[Math.floor(Math.random() * choices.length)];

  const generateRandomConfig = () => {
    const sectionNames = ['Identity', 'Connection'];
    const field1 = 'number'
    const field2 = 'text'
    const field3 = 'textarea'
    const field4 = 'checkbox'
    const field5 = 'toggle'
    const field6 = 'select'
    const field7 = 'rating'
    const field8 = 'range'
    const field9 = 'radio'
    const field10 = 'radioButton'
    const field11 = 'date'
    const field12 = 'color'

    return {
      sections: [
        {
          name: sectionNames[0],
          fields: [
            {
              label: toFormLabel(field1),
              name: `${field1}_a1`,
              type: field1,
              required: randomChoice([true, false])
            },
            {
              label: toFormLabel(field2),
              name: `${field2}_a2`,
              type: field2,
              required: randomChoice([true, false])
            },
            {
              label: toFormLabel(field3),
              name: `${field3}_a3`,
              type: field3,
              required: randomChoice([true, false])
            },
            {
              label: toFormLabel(field3),
              name: `${field4}_a4`,
              type: field4,
              required: false
            },
          ],
        },
        {
          name: sectionNames[1],
          fields: [
            {
              label: toFormLabel(field1),
              name: `${field1}_b1`,
              type: field1,
              required: randomChoice([true, true])
            },
            {
              label: toFormLabel(field5),
              name: `${field5}_b5`,
              type: field5,
              required: false
            },
            {
              label: toFormLabel(field6),
              name: `${field6}_b6`,
              type: field6,
              options: [
                { value: 'yellow', label: 'Yellow' },
                { value: 'blue', label: 'Blue' },
                { value: 'green', label: 'Green' },
                { value: 'purple', label: 'Purple' },
              ],
              required: randomChoice([true, true])
            },
            {
              label: toFormLabel(field7),
              name: `${field7}_b7`,
              type: field7,
              required: false
            },
            {
              label: toFormLabel(field8),
              name: `${field8}_b8`,
              type: field8,
              min: 1,
              max: 69,
              step: 1,
              required: true
            },
            {
              label: toFormLabel(field9),
              name: `${field9}_b9`,
              type: field9,
              options: [
                { value: 'burger', label: 'Burger' },
                { value: 'nuggets', label: 'Nuggets' },
                { value: 'salad', label: 'Salad' },
              ],
              required: randomChoice([true, true])
            },
            {
              label: toFormLabel(field10),
              name: `${field10}_b10`,
              type: field10,
              options: [
                { value: 'orange', label: 'Orange' },
                { value: 'lemon', label: 'Lemon' },
                { value: 'lime', label: 'Lime' },
              ],
              required: randomChoice([true, true])
            },
            {
              label: toFormLabel(field11),
              name: `${field11}_b11`,
              type: field11,
              required: randomChoice([true, true])
            },
            {
              label: toFormLabel(field12),
              name: `${field12}_b12`,
              type: field12,
              required: randomChoice([true, true])
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
      docs: mockDocs[name] || mockDocs.lorem,
      command: {
        path: `/path/to/${name}`,
        args: '',
        cwd: `/current/working/directory/${name}`,
        env: null,
        config: generateRandomConfig(),
        configFiles: null,
      },
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

function toFormLabel(field) {
  return `${field.charAt(0).toUpperCase() + field.slice(1)}`
}