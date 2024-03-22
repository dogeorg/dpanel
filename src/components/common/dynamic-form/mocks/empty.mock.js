export const empty = {
  type: 'inline',
  fields: [
    {
      "type": "text",
      "name": "nodeName",
      "label": "Node Name",
      "placeholder": "Enter your node's name",
      "help": "A memorable name for your Dogecoin Node",
      "required": true
    },
    {
      "type": "email",
      "name": "adminEmail",
      "label": "Admin Email",
      "placeholder": "Enter your email address",
      "required": true
    },
    {
      "type": "password",
      "name": "adminPassword",
      "label": "Admin Password",
      "placeholder": "Set a secure password",
      "required": true,
      "passwordToggle": true
    },
    {
      "type": "number",
      "name": "maxConnections",
      "label": "Max Connections",
      "help": "Maximum number of peer connections",
      "min": 1,
      "max": 150,
      "required": true
    },
    {
      "type": "toggle",
      "name": "enableCrawling",
      "label": "Enable Crawling",
      "checked": false
    },
    {
      "type": "range",
      "name": "crawlingIntensity",
      "label": "Crawling Intensity",
      "min": 1,
      "max": 100,
      "value": 20,
      "showTooltip": true
    },
    {
      "type": "select",
      "name": "networkSpeed",
      "label": "Network Speed",
      "options": [
        { "value": "low", "label": "Low" },
        { "value": "medium", "label": "Medium" },
        { "value": "high", "label": "High" }
      ],
      "required": true
    },
    {
      "type": "radio",
      "name": "dataSync",
      "label": "Data Synchronization Mode",
      "options": [
        { "value": "full", "label": "Full" },
        { "value": "pruned", "label": "Pruned" }
      ],
      "required": true
    },
    {
      "type": "date",
      "name": "maintenanceWindow",
      "label": "Maintenance Window",
      "placeholder": "Select a date"
    },
    {
      "type": "textarea",
      "name": "nodeDescription",
      "label": "Node Description",
      "placeholder": "Describe your node's purpose",
      "rows": 4
    },
    {
      "type": "checkbox",
      "name": "acceptTerms",
      "label": "I accept the terms and conditions",
      "required": true
    },
    {
      "type": "rating",
      "name": "userExperienceRating",
      "label": "Rate Your Experience",
      "max": 5
    },
    {
      "type": "radioButton",
      "name": "backupFrequency",
      "label": "Backup Frequency",
      "options": [
        { "value": "daily", "label": "Daily" },
        { "value": "weekly", "label": "Weekly" },
        { "value": "monthly", "label": "Monthly" }
      ],
      "required": true
    },
    {
      "hidden": true,
      "type": "color",
      "name": "uiThemeColor",
      "label": "UI Theme Color",
    }
  ]
};