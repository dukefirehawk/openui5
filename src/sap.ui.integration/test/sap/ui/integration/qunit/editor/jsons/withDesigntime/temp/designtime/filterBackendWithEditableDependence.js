// add your copyright here

sap.ui.define(["sap/ui/integration/Designtime"], function (
	Designtime
) {
	"use strict";
	return function () {
		return new Designtime({
			"form": {
				"items": {
					"booleanVisualization": {
						"manifestpath": "/temp/configuration/parameters/boolean/value",
						"type": "boolean",
						"label": "Boolean Label using Switch",
						"visualization": {
							"type": "Switch",
							"settings": {
								"state": "{currentSettings>value}",
								"customTextOn": "Yes",
								"customTextOff": "No",
								"enabled": "{currentSettings>editable}"
							}
						}
					},
					"CustomerWithEditableDependent": {
						"manifestpath": "/temp/configuration/parameters/CustomerWithEditableDependent/value",
						"type": "string",
						"editable": "{items>booleanVisualization/value}",
						"values": {
							"data": {
								"request": {
									"url": "{{destinations.mock_request}}/Customers?$filter=startswith(CompanyName,'{currentSettings>suggestValue}')"
								},
								"path": "/value"
							},
							"item": {
								"text": "{CompanyName}",
								"key": "{CustomerID}",
								"additionalText": "{= ${CustomerID} !== undefined ? ${Country} + ', ' +  ${City} + ', ' + ${Address} : ''}"
							}
						}
					},
					"CustomersWithEditableDependent": {
						"manifestpath": "/temp/configuration/parameters/CustomersWithEditableDependent/value",
						"type": "string[]",
						"editable": "{items>booleanVisualization/value}",
						"values": {
							"data": {
								"request": {
									"url": "{{destinations.mock_request}}/Customers?$filter=startswith(CompanyName,'{currentSettings>suggestValue}')"
								},
								"path": "/value"
							},
							"item": {
								"text": "{CompanyName}",
								"key": "{CustomerID}",
								"additionalText": "{= ${CustomerID} !== undefined ? ${Country} + ', ' +  ${City} + ', ' + ${Address} : ''}"
							}
						}
					},
					"CustomersInMultiInputWithEditableDependent": {
						"manifestpath": "/temp/configuration/parameters/CustomersInMultiInputWithEditableDependent/value",
						"type": "string[]",
						"editable": "{items>booleanVisualization/value}",
						"values": {
							"data": {
								"request": {
									"url": "{{destinations.mock_request}}/Customers?$filter=startswith(CompanyName,'{currentSettings>suggestValue}')"
								},
								"path": "/value"
							},
							"item": {
								"text": "{CompanyName}",
								"key": "{CustomerID}",
								"additionalText": "{= ${CustomerID} !== undefined ? ${Country} + ', ' +  ${City} + ', ' + ${Address} : ''}"
							}
						},
						"visualization": {
							"type": "MultiInput"
						}
					}
				}
			},
			"preview": {
				"modes": "LiveAbstract"
			}
		});
	};
});
