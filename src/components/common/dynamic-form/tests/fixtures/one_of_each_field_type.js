export const ONE_OF_EACH_FIELD_TYPE = [
  // Text (sl-input)
  { name: 'displayName', label: 'Display name', type: 'text' },
  // Email (sl-input)
  { name: 'emailAddress', label: 'Email address', type: 'email' },
  // Password (sl-input)
  { name: 'password', label: 'Password', type: 'password' },
  // Date (sl-input)
  { name: 'dob', label: 'Date of birth', type: 'date' },
  // Number (sl-input)
  { name: 'lucky_number', label: 'Lucky number?', type: 'number' },
  // Checkbox (sl-checkbox)
  { name: 'enableAwesome', label: 'Enable awesome?', type: 'checkbox' },
  // Toggle (sl-switch)
  { name: 'enableExtraAwesome', label: 'Enable extra awesome?', type: 'toggle' },
  // Select (sl-select)
  { name: 'fave_color', label: 'Favourite colour?', type: 'select', options: [
    { name: 'blue', label: 'Blue' },
    { name: 'green', label: 'Green' },
    { name: 'red', label: 'Red' }]
  },
  // Radio (sl-radio-group)
  { name: 'fave_cuisine', label: 'Favourite cuisine?', type: 'radio', options: [
    { name: 'italian', label: 'Italian' },
    { name: 'mexican', label: 'Mexican' },
    { name: 'asian', label: 'Asian' }]
  },
  // Radio Button (sl-radio-group)
  { name: 'fave_music_genre', label: 'Favourite music genre?', type: 'radioButton', options: [
    { name: 'classical', label: 'Classical' },
    { name: 'jazz', label: 'Jazz' },
    { name: 'rock', label: 'Rock' }]
  },
  // Textarea
  { name: 'bio', label: 'Bio', type: 'textarea' },
  // Color
  { name: 'bannerColour', label: 'Banner Colour', type: 'color' },
  // Range
  { name: 'handicap', label: 'Handicap (0 - 100)', type: 'range' },
  // Rating
  { name: 'score', label: 'Score (out of 5)', type: 'rating' },
  // Seedphrase
  { name: 'twelve-words', label: 'Recovery Phrase', type: 'seedphrase' },
]