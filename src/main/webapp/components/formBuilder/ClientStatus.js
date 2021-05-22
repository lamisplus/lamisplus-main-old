export const data = {
  "display": "",
  "components": [
    {
      "label": "Client Status Update",
      "tag": "p",
      "className": "",
      "attrs": [
        {
          "attr": "",
          "value": ""
        }
      ],
      "content": "<span style=\"color:#B87108\">CLIENT STATUS UPDATE</span>\n<hr>",
      "refreshOnChange": false,
      "customClass": "",
      "hidden": false,
      "tableView": false,
      "modalEdit": false,
      "key": "client_status_update",
      "tags": [],
      "properties": {},
      "conditional": {
        "show": null,
        "when": null,
        "eq": "",
        "json": ""
      },
      "customConditional": "",
      "logic": [],
      "attributes": {},
      "overlay": {
        "style": "",
        "page": "",
        "left": "",
        "top": "",
        "width": "",
        "height": ""
      },
      "type": "htmlelement",
      "input": false,
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "multiple": false,
      "defaultValue": null,
      "protected": false,
      "unique": false,
      "persistent": false,
      "clearOnHide": true,
      "refreshOn": "",
      "redrawOn": "",
      "labelPosition": "top",
      "description": "",
      "errorLabel": "",
      "tooltip": "",
      "hideLabel": false,
      "tabindex": "",
      "disabled": false,
      "autofocus": false,
      "dbIndex": false,
      "customDefaultValue": "",
      "calculateValue": "",
      "widget": null,
      "validateOn": "change",
      "validate": {
        "required": false,
        "custom": "",
        "customPrivate": false,
        "strictDateValidation": false,
        "unique": false,
        "multiple": false
      },
      "allowCalculateOverride": false,
      "encrypted": false,
      "showCharCount": false,
      "showWordCount": false,
      "allowMultipleMasks": false,
      "id": "eh7qm2"
    },
    {
      "label": "Columns",
      "columns": [
        {
          "components": [
            {
              "label": "New Status",
              "labelPosition": "top",
              "widget": "choicesjs",
              "placeholder": "",
              "description": "",
              "tooltip": "",
              "customClass": "",
              "tabindex": "",
              "hidden": false,
              "hideLabel": false,
              "autofocus": false,
              "disabled": false,
              "tableView": true,
              "modalEdit": false,
              "multiple": false,
              "dataSrc": "url",
              "data": {
                "resource": "",
                "json": "",
                "url": "https://lp-base-app.herokuapp.com/api/application-codesets/codesetGroup?codesetGroup=NEW%20STATUS",
                "custom": "",
                "headers": [
                  {
                    "key": "",
                    "value": ""
                  }
                ],
                "values": []
              },
              "valueProperty": "",
              "dataType": "",
              "template": "<span>{{ item.display}}</span>",
              "searchEnabled": true,
              "selectThreshold": 0.3,
              "readOnlyValue": false,
              "customOptions": {},
              "persistent": true,
              "protected": false,
              "dbIndex": false,
              "encrypted": false,
              "clearOnHide": true,
              "customDefaultValue": "",
              "calculateValue": "",
              "allowCalculateOverride": false,
              "validateOn": "change",
              "validate": {
                "required": false,
                "customMessage": "",
                "custom": "",
                "customPrivate": false,
                "json": "",
                "strictDateValidation": false,
                "unique": false,
                "multiple": false
              },
              "unique": false,
              "errorLabel": "",
              "key": "current_status",
              "tags": [],
              "properties": {
                "1": "Stopped Treatment",
                "2": "Died(Confirmed)",
                "3": "Previously Undocumented Patient Transfer(Confirmed)",
                "4": "Traced Patient(Unable to locate)",
                "5": "Traced Patient and agreed to return to care",
                "6": "Did Not Attempt to Trace Patient"
              },
              "conditional": {
                "show": null,
                "when": null,
                "eq": "",
                "json": ""
              },
              "customConditional": "",
              "logic": [
                {
                  "name": "onchanged",
                  "trigger": {
                    "type": "javascript",
                    "javascript": "document.getElementById(‘current_status’).onchange = function () {\n     alert(\"selected value = \"+this.value);\n     if(this.value == “Stopped Treatment”)\n     {\n            document.getElementById(‘reason_Interruption’).removeAttribute('disabled');\ndocument.getElementById(‘date_agreed’).removeAttribute('disabled');\n\n     }\n     else\n     {\n            document.getElementById('Stopped Treatment').setAttribute('disabled', true);\n                    document.getElementById('date_agreed').setAttribute('disabled', true);\n\n     }\n      }"
                  },
                  "actions": []
                }
              ],
              "attributes": {},
              "overlay": {
                "style": "",
                "page": "",
                "left": "",
                "top": "",
                "width": "",
                "height": ""
              },
              "type": "select",
              "indexeddb": {
                "filter": {}
              },
              "minSearch": 0,
              "limit": 100,
              "input": true,
              "prefix": "",
              "suffix": "",
              "refreshOn": "",
              "redrawOn": "",
              "showCharCount": false,
              "showWordCount": false,
              "allowMultipleMasks": false,
              "clearOnRefresh": false,
              "lazyLoad": true,
              "filter": "",
              "searchField": "",
              "authenticate": false,
              "selectFields": "",
              "searchThreshold": 0.3,
              "fuseOptions": {
                "include": "score",
                "threshold": 0.3
              },
              "id": "e3c3mls",
              "defaultValue": "",
              "selectValues": "",
              "disableLimit": false,
              "sort": "",
              "hideOnChildrenHidden": false
            }
          ],
          "width": 6,
          "offset": 0,
          "push": 0,
          "pull": 0
        },
        {
          "components": [
            {
              "label": "Date of New Status",
              "labelPosition": "top",
              "displayInTimezone": "viewer",
              "useLocaleSettings": true,
              "allowInput": false,
              "format": "yyyy-MM-dd",
              "placeholder": "",
              "description": "",
              "tooltip": "",
              "customClass": "",
              "tabindex": "",
              "hidden": false,
              "hideLabel": false,
              "autofocus": false,
              "disabled": false,
              "tableView": false,
              "modalEdit": false,
              "enableDate": true,
              "datePicker": {
                "minDate": null,
                "maxDate": null,
                "disable": "",
                "disableFunction": "",
                "disableWeekends": false,
                "disableWeekdays": false,
                "showWeeks": true,
                "startingDay": 0,
                "initDate": "",
                "minMode": "day",
                "maxMode": "year",
                "yearRows": 4,
                "yearColumns": 5
              },
              "enableTime": true,
              "timePicker": {
                "showMeridian": true,
                "hourStep": 1,
                "minuteStep": 1,
                "readonlyInput": false,
                "mousewheel": true,
                "arrowkeys": true
              },
              "multiple": false,
              "defaultValue": "",
              "defaultDate": "new Date();",
              "customOptions": {},
              "persistent": true,
              "protected": false,
              "dbIndex": false,
              "encrypted": false,
              "redrawOn": "",
              "clearOnHide": true,
              "customDefaultValue": "",
              "calculateValue": "",
              "allowCalculateOverride": false,
              "validate": {
                "required": true,
                "customMessage": "",
                "custom": "",
                "customPrivate": false,
                "json": "",
                "strictDateValidation": false,
                "unique": false,
                "multiple": false
              },
              "unique": false,
              "validateOn": "change",
              "errorLabel": "",
              "key": "date_current_status",
              "tags": [],
              "properties": {},
              "conditional": {
                "show": null,
                "when": null,
                "eq": "",
                "json": ""
              },
              "customConditional": "",
              "logic": [],
              "attributes": {},
              "overlay": {
                "style": "",
                "page": "",
                "left": "",
                "top": "",
                "width": "",
                "height": ""
              },
              "type": "datetime",
              "input": true,
              "prefix": "",
              "suffix": "<i ref=\"icon\" class=\"fa fa-calendar\" style=\"\"></i>",
              "refreshOn": "",
              "widget": {
                "type": "calendar",
                "displayInTimezone": "viewer",
                "language": "en",
                "useLocaleSettings": true,
                "allowInput": false,
                "mode": "single",
                "enableTime": true,
                "noCalendar": false,
                "format": "yyyy-MM-dd",
                "hourIncrement": 1,
                "minuteIncrement": 1,
                "time_24hr": false,
                "minDate": null,
                "disabledDates": "",
                "disableWeekends": false,
                "disableWeekdays": false,
                "disableFunction": "",
                "maxDate": null
              },
              "showCharCount": false,
              "showWordCount": false,
              "allowMultipleMasks": false,
              "timezone": "",
              "datepickerMode": "day",
              "id": "egt4z5",
              "hideOnChildrenHidden": false
            }
          ],
          "width": 6,
          "offset": 0,
          "push": 0,
          "pull": 0
        }
      ],
      "autoAdjust": false,
      "hideOnChildrenHidden": false,
      "customClass": "",
      "hidden": false,
      "hideLabel": false,
      "tableView": false,
      "modalEdit": false,
      "key": "columns",
      "tags": [],
      "properties": {},
      "conditional": {
        "show": null,
        "when": null,
        "eq": "",
        "json": ""
      },
      "customConditional": "",
      "logic": [],
      "attributes": {},
      "overlay": {
        "style": "",
        "page": "",
        "left": "",
        "top": "",
        "width": "",
        "height": ""
      },
      "type": "columns",
      "input": false,
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "multiple": false,
      "defaultValue": null,
      "protected": false,
      "unique": false,
      "persistent": false,
      "clearOnHide": false,
      "refreshOn": "",
      "redrawOn": "",
      "labelPosition": "top",
      "description": "",
      "errorLabel": "",
      "tooltip": "",
      "tabindex": "",
      "disabled": false,
      "autofocus": false,
      "dbIndex": false,
      "customDefaultValue": "",
      "calculateValue": "",
      "widget": null,
      "validateOn": "change",
      "validate": {
        "required": false,
        "custom": "",
        "customPrivate": false,
        "strictDateValidation": false
      },
      "allowCalculateOverride": false,
      "encrypted": false,
      "showCharCount": false,
      "showWordCount": false,
      "allowMultipleMasks": false,
      "tree": false,
      "id": "eegnvpa",
      "path": "columns"
    },
    {
      "label": "Columns",
      "columns": [
        {
          "components": [
            {
              "label": "Date of Tracked",
              "labelPosition": "top",
              "displayInTimezone": "viewer",
              "useLocaleSettings": true,
              "allowInput": false,
              "format": "yyyy-MM-dd",
              "placeholder": "",
              "description": "",
              "tooltip": "",
              "customClass": "",
              "tabindex": "",
              "hidden": false,
              "hideLabel": false,
              "autofocus": false,
              "disabled": false,
              "tableView": false,
              "modalEdit": false,
              "enableDate": true,
              "datePicker": {
                "minDate": null,
                "maxDate": null,
                "disable": "",
                "disableFunction": "",
                "disableWeekends": false,
                "disableWeekdays": false,
                "showWeeks": true,
                "startingDay": 0,
                "initDate": "",
                "minMode": "day",
                "maxMode": "year",
                "yearRows": 4,
                "yearColumns": 5
              },
              "enableTime": true,
              "timePicker": {
                "showMeridian": true,
                "hourStep": 1,
                "minuteStep": 1,
                "readonlyInput": false,
                "mousewheel": true,
                "arrowkeys": true
              },
              "multiple": false,
              "defaultValue": "",
              "defaultDate": "new Date();",
              "customOptions": {},
              "persistent": true,
              "protected": false,
              "dbIndex": false,
              "encrypted": false,
              "redrawOn": "",
              "clearOnHide": true,
              "customDefaultValue": "",
              "calculateValue": "",
              "allowCalculateOverride": false,
              "validate": {
                "required": false,
                "customMessage": "",
                "custom": "",
                "customPrivate": false,
                "json": "",
                "strictDateValidation": false,
                "unique": false,
                "multiple": false
              },
              "unique": false,
              "validateOn": "change",
              "errorLabel": "",
              "key": "date_tracked",
              "tags": [],
              "properties": {},
              "conditional": {
                "show": null,
                "when": null,
                "eq": "",
                "json": ""
              },
              "customConditional": "",
              "logic": [],
              "attributes": {},
              "overlay": {
                "style": "",
                "page": "",
                "left": "",
                "top": "",
                "width": "",
                "height": ""
              },
              "type": "datetime",
              "input": true,
              "prefix": "",
              "suffix": "<i ref=\"icon\" class=\"fa fa-calendar\" style=\"\"></i>",
              "refreshOn": "",
              "widget": {
                "type": "calendar",
                "displayInTimezone": "viewer",
                "language": "en",
                "useLocaleSettings": true,
                "allowInput": false,
                "mode": "single",
                "enableTime": true,
                "noCalendar": false,
                "format": "yyyy-MM-dd",
                "hourIncrement": 1,
                "minuteIncrement": 1,
                "time_24hr": false,
                "minDate": null,
                "disabledDates": "",
                "disableWeekends": false,
                "disableWeekdays": false,
                "disableFunction": "",
                "maxDate": null
              },
              "showCharCount": false,
              "showWordCount": false,
              "allowMultipleMasks": false,
              "timezone": "",
              "datepickerMode": "day",
              "id": "ele0uav",
              "hideOnChildrenHidden": false
            }
          ],
          "width": 6,
          "offset": 0,
          "push": 0,
          "pull": 0
        },
        {
          "components": [
            {
              "label": "Date Agreed to Return",
              "labelPosition": "top",
              "displayInTimezone": "viewer",
              "useLocaleSettings": true,
              "allowInput": false,
              "format": "yyyy-MM-dd",
              "placeholder": "",
              "description": "",
              "tooltip": "",
              "customClass": "",
              "tabindex": "",
              "hidden": false,
              "hideLabel": false,
              "autofocus": false,
              "disabled": false,
              "tableView": false,
              "modalEdit": false,
              "enableDate": true,
              "datePicker": {
                "minDate": null,
                "maxDate": null,
                "disable": "",
                "disableFunction": "",
                "disableWeekends": false,
                "disableWeekdays": false,
                "showWeeks": true,
                "startingDay": 0,
                "initDate": "",
                "minMode": "day",
                "maxMode": "year",
                "yearRows": 4,
                "yearColumns": 5
              },
              "enableTime": true,
              "timePicker": {
                "showMeridian": true,
                "hourStep": 1,
                "minuteStep": 1,
                "readonlyInput": false,
                "mousewheel": true,
                "arrowkeys": true
              },
              "multiple": false,
              "defaultValue": "",
              "defaultDate": "new Date();",
              "customOptions": {},
              "persistent": true,
              "protected": false,
              "dbIndex": false,
              "encrypted": false,
              "redrawOn": "",
              "clearOnHide": true,
              "customDefaultValue": "",
              "calculateValue": "",
              "allowCalculateOverride": false,
              "validate": {
                "required": false,
                "customMessage": "",
                "custom": "",
                "customPrivate": false,
                "json": "",
                "strictDateValidation": false,
                "unique": false,
                "multiple": false
              },
              "unique": false,
              "validateOn": "change",
              "errorLabel": "",
              "key": "date_agreed_return",
              "tags": [],
              "properties": {},
              "conditional": {
                "show": null,
                "when": null,
                "eq": "",
                "json": ""
              },
              "customConditional": "",
              "logic": [],
              "attributes": {},
              "overlay": {
                "style": "",
                "page": "",
                "left": "",
                "top": "",
                "width": "",
                "height": ""
              },
              "type": "datetime",
              "input": true,
              "prefix": "",
              "suffix": "<i ref=\"icon\" class=\"fa fa-calendar\" style=\"\"></i>",
              "refreshOn": "",
              "widget": {
                "type": "calendar",
                "displayInTimezone": "viewer",
                "language": "en",
                "useLocaleSettings": true,
                "allowInput": false,
                "mode": "single",
                "enableTime": true,
                "noCalendar": false,
                "format": "yyyy-MM-dd",
                "hourIncrement": 1,
                "minuteIncrement": 1,
                "time_24hr": false,
                "minDate": null,
                "disabledDates": "",
                "disableWeekends": false,
                "disableWeekdays": false,
                "disableFunction": "",
                "maxDate": null
              },
              "showCharCount": false,
              "showWordCount": false,
              "allowMultipleMasks": false,
              "timezone": "",
              "datepickerMode": "day",
              "id": "eflm5bo",
              "hideOnChildrenHidden": false
            }
          ],
          "width": 6,
          "offset": 0,
          "push": 0,
          "pull": 0
        }
      ],
      "autoAdjust": false,
      "hideOnChildrenHidden": false,
      "customClass": "",
      "hidden": false,
      "hideLabel": false,
      "tableView": false,
      "modalEdit": false,
      "key": "columns1",
      "tags": [],
      "properties": {},
      "conditional": {
        "show": null,
        "when": null,
        "eq": "",
        "json": ""
      },
      "customConditional": "",
      "logic": [],
      "attributes": {},
      "overlay": {
        "style": "",
        "page": "",
        "left": "",
        "top": "",
        "width": "",
        "height": ""
      },
      "type": "columns",
      "input": false,
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "multiple": false,
      "defaultValue": null,
      "protected": false,
      "unique": false,
      "persistent": false,
      "clearOnHide": false,
      "refreshOn": "",
      "redrawOn": "",
      "labelPosition": "top",
      "description": "",
      "errorLabel": "",
      "tooltip": "",
      "tabindex": "",
      "disabled": false,
      "autofocus": false,
      "dbIndex": false,
      "customDefaultValue": "",
      "calculateValue": "",
      "widget": null,
      "validateOn": "change",
      "validate": {
        "required": false,
        "custom": "",
        "customPrivate": false,
        "strictDateValidation": false
      },
      "allowCalculateOverride": false,
      "encrypted": false,
      "showCharCount": false,
      "showWordCount": false,
      "allowMultipleMasks": false,
      "tree": false,
      "id": "enej3p8",
      "path": "columns1"
    },
    {
      "label": "Columns",
      "columns": [
        {
          "components": [
            {
              "label": "Cause of Death",
              "labelPosition": "top",
              "widget": "choicesjs",
              "placeholder": "",
              "description": "",
              "tooltip": "Give reason if client new status is 'Died(Confirmed)'",
              "customClass": "",
              "tabindex": "",
              "hidden": false,
              "hideLabel": false,
              "autofocus": false,
              "disabled": false,
              "tableView": true,
              "modalEdit": false,
              "multiple": false,
              "dataSrc": "url",
              "data": {
                "values": [
                  {
                    "label": "",
                    "value": ""
                  }
                ],
                "resource": "",
                "json": "",
                "url": "https://lp-base-app.herokuapp.com/api/application-codesets/codesetGroup?codesetGroup=CAUSE%20OF%20DEATH",
                "custom": "",
                "headers": [
                  {
                    "key": "",
                    "value": ""
                  }
                ]
              },
              "valueProperty": "",
              "dataType": "",
              "template": "<span>{{item.display}}</span>",
              "searchEnabled": true,
              "selectThreshold": 0.3,
              "readOnlyValue": false,
              "customOptions": {},
              "persistent": true,
              "protected": false,
              "dbIndex": false,
              "encrypted": false,
              "clearOnHide": true,
              "customDefaultValue": "",
              "calculateValue": "",
              "allowCalculateOverride": false,
              "validateOn": "change",
              "validate": {
                "required": false,
                "customMessage": "",
                "custom": "",
                "customPrivate": false,
                "json": "",
                "unique": false,
                "multiple": false,
                "strictDateValidation": false
              },
              "unique": false,
              "errorLabel": "",
              "key": "cause_death",
              "tags": [],
              "properties": {},
              "conditional": {
                "show": null,
                "when": null,
                "eq": "",
                "json": ""
              },
              "customConditional": "",
              "logic": [],
              "attributes": {},
              "overlay": {
                "style": "",
                "page": "",
                "left": "",
                "top": "",
                "width": "",
                "height": ""
              },
              "type": "select",
              "indexeddb": {
                "filter": {}
              },
              "minSearch": 0,
              "limit": 100,
              "input": true,
              "hideOnChildrenHidden": false,
              "prefix": "",
              "suffix": "",
              "refreshOn": "",
              "redrawOn": "",
              "showCharCount": false,
              "showWordCount": false,
              "allowMultipleMasks": false,
              "clearOnRefresh": false,
              "lazyLoad": true,
              "filter": "",
              "searchField": "",
              "authenticate": false,
              "selectFields": "",
              "searchThreshold": 0.3,
              "fuseOptions": {
                "include": "score",
                "threshold": 0.3
              },
              "id": "eqaqgo",
              "defaultValue": "",
              "selectValues": "",
              "disableLimit": false,
              "sort": ""
            }
          ],
          "width": 6,
          "offset": 0,
          "push": 0,
          "pull": 0
        },
        {
          "components": [
            {
              "label": "Reason for Interruption",
              "labelPosition": "top",
              "widget": "choicesjs",
              "placeholder": "",
              "description": "",
              "tooltip": "Give reason if client new status is 'Stopped Treatment'.",
              "customClass": "",
              "tabindex": "",
              "hidden": false,
              "hideLabel": false,
              "autofocus": false,
              "disabled": false,
              "tableView": true,
              "modalEdit": false,
              "multiple": false,
              "dataSrc": "url",
              "data": {
                "resource": "",
                "json": "",
                "url": "https://lp-base-app.herokuapp.com/api/application-codesets/codesetGroup?codesetGroup=REASON%20FOR%20INTERRUPTION",
                "custom": "",
                "headers": [
                  {
                    "key": "",
                    "value": ""
                  }
                ],
                "values": []
              },
              "valueProperty": "",
              "dataType": "",
              "template": "<span>{{ item.display }}</span>",
              "searchEnabled": true,
              "selectThreshold": 0.3,
              "readOnlyValue": false,
              "customOptions": {},
              "persistent": true,
              "protected": false,
              "dbIndex": false,
              "encrypted": false,
              "clearOnHide": true,
              "customDefaultValue": "",
              "calculateValue": "",
              "allowCalculateOverride": false,
              "validateOn": "change",
              "validate": {
                "required": false,
                "customMessage": "",
                "custom": "",
                "customPrivate": false,
                "json": "",
                "strictDateValidation": false,
                "unique": false,
                "multiple": false
              },
              "unique": false,
              "errorLabel": "",
              "key": "reason_interrupt",
              "tags": [],
              "properties": {},
              "conditional": {
                "show": null,
                "when": null,
                "eq": "",
                "json": ""
              },
              "customConditional": "",
              "logic": [],
              "attributes": {},
              "overlay": {
                "style": "",
                "page": "",
                "left": "",
                "top": "",
                "width": "",
                "height": ""
              },
              "type": "select",
              "indexeddb": {
                "filter": {}
              },
              "minSearch": 0,
              "limit": 100,
              "input": true,
              "prefix": "",
              "suffix": "",
              "refreshOn": "",
              "redrawOn": "",
              "showCharCount": false,
              "showWordCount": false,
              "allowMultipleMasks": false,
              "clearOnRefresh": false,
              "lazyLoad": true,
              "filter": "",
              "searchField": "",
              "authenticate": false,
              "selectFields": "",
              "searchThreshold": 0.3,
              "fuseOptions": {
                "include": "score",
                "threshold": 0.3
              },
              "id": "eq00sxr",
              "defaultValue": "",
              "selectValues": "",
              "disableLimit": false,
              "sort": "",
              "hideOnChildrenHidden": false
            }
          ],
          "width": 6,
          "offset": 0,
          "push": 0,
          "pull": 0
        }
      ],
      "autoAdjust": false,
      "hideOnChildrenHidden": false,
      "customClass": "",
      "hidden": false,
      "hideLabel": false,
      "tableView": false,
      "modalEdit": false,
      "key": "columns2",
      "tags": [],
      "properties": {},
      "conditional": {
        "show": null,
        "when": null,
        "eq": "",
        "json": ""
      },
      "customConditional": "",
      "logic": [],
      "attributes": {},
      "overlay": {
        "style": "",
        "page": "",
        "left": "",
        "top": "",
        "width": "",
        "height": ""
      },
      "type": "columns",
      "input": false,
      "placeholder": "",
      "prefix": "",
      "suffix": "",
      "multiple": false,
      "defaultValue": null,
      "protected": false,
      "unique": false,
      "persistent": false,
      "clearOnHide": false,
      "refreshOn": "",
      "redrawOn": "",
      "labelPosition": "top",
      "description": "",
      "errorLabel": "",
      "tooltip": "",
      "tabindex": "",
      "disabled": false,
      "autofocus": false,
      "dbIndex": false,
      "customDefaultValue": "",
      "calculateValue": "",
      "widget": null,
      "validateOn": "change",
      "validate": {
        "required": false,
        "custom": "",
        "customPrivate": false,
        "strictDateValidation": false
      },
      "allowCalculateOverride": false,
      "encrypted": false,
      "showCharCount": false,
      "showWordCount": false,
      "allowMultipleMasks": false,
      "tree": false,
      "id": "espybqh",
      "path": "columns2"
    },
    {
      "type": "button",
      "label": "Submit",
      "key": "submit",
      "size": "md",
      "block": false,
      "action": "submit",
      "disableOnInvalid": true,
      "theme": "primary",
      "input": true,
      "placeholder": "",
      "prefix": "",
      "customClass": "",
      "suffix": "",
      "multiple": false,
      "defaultValue": null,
      "protected": false,
      "unique": false,
      "persistent": false,
      "hidden": false,
      "clearOnHide": true,
      "refreshOn": "",
      "redrawOn": "",
      "tableView": false,
      "modalEdit": false,
      "labelPosition": "top",
      "description": "",
      "errorLabel": "",
      "tooltip": "",
      "hideLabel": false,
      "tabindex": "",
      "disabled": false,
      "autofocus": false,
      "dbIndex": false,
      "customDefaultValue": "",
      "calculateValue": "",
      "widget": {
        "type": "input"
      },
      "attributes": {},
      "validateOn": "change",
      "validate": {
        "required": false,
        "custom": "",
        "customPrivate": false,
        "strictDateValidation": false,
        "unique": false,
        "multiple": false
      },
      "conditional": {
        "show": null,
        "when": null,
        "eq": ""
      },
      "overlay": {
        "style": "",
        "left": "",
        "top": "",
        "width": "",
        "height": ""
      },
      "allowCalculateOverride": false,
      "encrypted": false,
      "showCharCount": false,
      "showWordCount": false,
      "properties": {},
      "allowMultipleMasks": false,
      "leftIcon": "",
      "rightIcon": "",
      "dataGridLabel": true,
      "id": "e547zv"
    }
  ]
}