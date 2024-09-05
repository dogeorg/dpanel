export function generateManifestsV2(input) {
  const randomChoice = (choices) => choices[Math.floor(Math.random() * choices.length)];
  const randomSemver = () => `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;

  const fieldLabels = {
    number: 'Number',
    text: 'Text',
    select: 'Select',
    toggle: 'Toggle',
    checkbox: 'Checkbox',
    radioButton: 'RadioButton',
    radio: 'Radio',
    range: 'Range',
    date: 'Date',
    // rating: 'Rating',
    color: 'Color',
    textarea: 'Textarea',
  };

  const generateRandomConfig = () => {
    const sectionNames = ['Identity', 'Connection'];
    const fields = Object.keys(fieldLabels);
    const options = {
      select: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Purple', value: 'purple' },
      ],
      radio: [
        { label: 'Burger', value: 'burger' },
        { label: 'Nuggets', value: 'nuggets' },
        { label: 'Fries', value: 'fries' },
      ],
      radioButton: [
        { label: 'Orange', value: 'orange' },
        { label: 'Lemon', value: 'lemon' },
        { label: 'Lime', value: 'lime' },
      ]
    };

    // We have 12 field types.
    // We're going to generate a form that has 2 sections
    // with half the fields in the first section, half in the other.
    const halfFieldCount = Math.ceil(fields.length / 2);

    return {
      sections: sectionNames.map((sectionName, sectionIndex) => {
        const sliceStartIndex = sectionIndex * halfFieldCount;
        const sliceEndIndex = sliceStartIndex + halfFieldCount;
        return {
          name: sectionName,
          fields: fields.slice(sliceStartIndex, sliceEndIndex)
            .map((field, fieldIndex) => ({
            label: fieldLabels[field],
            name: `${field}_${sectionIndex}_${fieldIndex}`,
            type: field,
            ...(field === 'checkbox' || field === 'toggle' || field === 'rating' ? { required: false } : { required: randomChoice([true, true]) }),
            ...(field === 'select' || field === 'radio' || field === 'radioButton' ? { options: [...options[field]] } : {}),
            ...(field === 'range' ? { min: 1, max: 69, step: 1 } : {})
          }))
          }
      })
    };
  };

  const names = Array.isArray(input) ? input : Array.from({ length: input }, (_, index) => `Package_${index + 1}`);

  const produce = (array) => array.map(name => ({
    config: generateRandomConfig(),
    container: {
      build: {
        nixFile: `${name.toLowerCase()}.nix`,
        nixFileSha256: "",
      },
      exposes: [
        {
          port: 80,
          trafficType: "http",
          type: "admin",
        },
        {
          port: 81,
          trafficType: "http",
          type: "admin",
        },
      ],
      services: [
        {
          command: {
            cwd: "/bin/",
            env: {},
            exec: `/bin/start-${name.toLowerCase()}1`,
          },
          name: `${name.toLowerCase()}1`,
        },
        {
          command: {
            cwd: "/bin/",
            env: {},
            exec: `/bin/start-${name.toLowerCase()}2`,
          },
          name: `${name.toLowerCase()}2`,
        },
      ],
    },
    dependencies: [],
    manifestVersion: 1,
    meta: {
      logoPath: "",
      name: name,
      version: randomSemver(),
    },
    permissionGroups: [],
  }));

  // 'Mock a hardcoded set'
  if (!input) {
    return produce(['Core', 'Identity', 'GigaWallet', 'ShibeShop', 'Map', 'Tipjar'])
  };

  // Mock a dynamic set that considers the input.
  return produce(names)
}