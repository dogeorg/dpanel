export const populated = {
  sections: [
    {
      fields: [
        {
          "type": "text",
          "name": "nodeName",
          "label": "Node Name",
          "placeholder": "Enter your node's name",
          "help": "A memorable name for your Dogecoin Node",
          "required": true,
          "minlength": 3,
          "value": "MyDogecoinNode"
        },
        {
          "type": "email",
          "name": "adminEmail",
          "label": "Admin Email",
          "placeholder": "Enter your email address",
          "required": true,
          "value": "admin@example.com"
        },
        {
          "type": "password",
          "name": "adminPassword",
          "label": "Admin Password",
          "placeholder": "Set a secure password",
          "required": true,
          "passwordToggle": true,
          "value": "S3cureP@ssw0rd!"
        },
        {
          "type": "number",
          "name": "maxConnections",
          "label": "Max Connections",
          "help": "Maximum number of peer connections",
          "min": 1,
          "max": 150,
          "required": true,
          "value": 75
        },
        {
          "type": "toggle",
          "name": "enableCrawling",
          "label": "Enable Crawling",
          "checked": true,
          "value": true
        },
        {
          "type": "range",
          "name": "crawlingIntensity",
          "label": "Crawling Intensity",
          "min": 1,
          "max": 100,
          "value": 80,
          "showTooltip": true
        },
        {
          "type": "select",
          "name": "networkSpeed",
          "label": "Network Speed",
          "required": true,
          "value": "medium",
          "options": [
            { "value": "low", "label": "Low" },
            { "value": "medium", "label": "Medium" },
            { "value": "high", "label": "High" }
          ],
        },
        {
          "type": "radio",
          "name": "dataSync",
          "label": "Data Synchronization Mode",
          "value": "pruned",
          "required": true,
          "options": [
            { "value": "full", "label": "Full" },
            { "value": "pruned", "label": "Pruned" }
          ],
        },
        {
          "type": "date",
          "name": "maintenanceWindow",
          "label": "Maintenance Window",
          "placeholder": "Select a date",
          "value": "2023-04-01"
        },
        {
          "type": "textarea",
          "name": "nodeDescription",
          "label": "Node Description",
          "placeholder": "Describe your node's purpose",
          "rows": 4,
          "value": "This node is dedicated to maintaining a stable, secure, and efficient Dogecoin network."
        },
        {
          "type": "checkbox",
          "name": "acceptTerms",
          "label": "I accept the terms and conditions",
          "required": true,
          "checked": true,
          "value": true
        },
        {
          "type": "rating",
          "name": "userExperienceRating",
          "label": "Rate Your Experience",
          "max": 5,
          "value": 4
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
          "required": true,
          "value": "weekly"
        },
        {
          "hidden": true,
          "type": "color",
          "name": "uiThemeColor",
          "label": "UI Theme Color",
          "value": "#00b9f1"
        }
      ]
    }
  ]
};