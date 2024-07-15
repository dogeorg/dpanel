export const CONDITIONAL_FIELD = {
  sections: [
    {
      name: "Select Network",
      submitLabel: "Much Connect",
      fields: [
        {
          name: "device",
          label: "Set device name",
          labelAction: { name: "generate-name", label: "Randomize" },
          type: "text",
          required: true,
          breakline: true,
        },
        {
          name: "network",
          label: "Select Network",
          labelAction: { name: "refresh", label: "Refresh" },
          type: "select",
          required: true,
          options: [
            { type: "ethernet", value: "ethernet", label: "Ethernet" },
            { type: "wifi", value: "hidden", label: "Hidden Network" },
          ],
        },
        {
          name: "network-ssid",
          label: "Network SSID",
          type: "text",
          required: true,
          revealOn: ["network", "=", "hidden"],
        },
        {
          name: "network-pass",
          label: "Network Password",
          type: "password",
          required: true,
          passwordToggle: true,
          revealOn: ["network", "!=", "ethernet"],
        },
      ],
    },
  ],
};