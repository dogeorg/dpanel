export const password = {
  sections: [
    {
      name: "Change password",
      submitLabel: "Submit",
      fields: [
        {
          name: "password",
          label: "Enter Current Password",
          type: "password",
          passwordToggle: true,
          required: true,
        },
        {
          name: "seedphrase",
          label: "Enter Seed Phrase (12-words)",
          type: "seedphrase",
          required: true,
        },
        {
          name: "field-toggle",
          fields: ["password", "seedphrase"],
          labels: ["Switch to seed-phrase (12 words)", "Switch to current password"]
        },
        {
          name: "new_password",
          label: "Enter New Password",
          type: "password",
          passwordToggle: true,
          requireConfirmation: true,
          required: true,
        },
      ],
    },
  ],
};