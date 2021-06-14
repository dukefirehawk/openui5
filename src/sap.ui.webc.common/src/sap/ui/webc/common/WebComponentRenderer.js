/*!
 * ${copyright}
 */

// Provides default renderer for all web components
sap.ui.define([
		"sap/ui/core/Element",
		"sap/ui/core/Control",
		"sap/base/strings/hyphenate",
		"sap/base/strings/camelize"
	],
	function(Element, Control, hyphenate, camelize) {
		"use strict";

		/**
		 * WebComponent renderer.
		 * @namespace
		 * @experimental Since 1.92.0 Do not base your productive code on this renderer as its API may change.
		 */
		var WebComponentRenderer = {
			apiVersion: 2
		};

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
		 * @param {sap.ui.core.Control} oWebComponent an object representation of the control that should be rendered
		 */
		WebComponentRenderer.render = function(oRm, oWebComponent){
			var sTag = oWebComponent.getMetadata().getTag();

			// Opening custom element tag
			oRm.openStart(sTag, oWebComponent);

			// Properties with mapping="attribute"
			this.renderAttributeProperties(oRm, oWebComponent);
			// Properties with mapping="style"
			this.renderStyleProperties(oRm, oWebComponent);
			// Hook for customization
			this.customRenderInOpeningTag(oRm, oWebComponent);
			// Attributes/Styles that the component sets internally
			this.preserveUnmanagedAttributes(oRm, oWebComponent);
			// Styles that the component sets internally
			this.preserveUnmanagedStyles(oRm, oWebComponent);

			oRm.openEnd();

			// Properties with mapping="textContent"
			this.renderTextContentProperties(oRm, oWebComponent);
			// Properties with mapping="slot"
			this.renderSlotProperties(oRm, oWebComponent);
			// Aggregations
			this.renderAggregations(oRm, oWebComponent);
			// Hook for customization (additional children)
			this.customRenderInsideTag(oRm, oWebComponent);

			// Closing custom element tag
			oRm.close(sTag);
		};

		/**
		 * Renders attributes, based on the control's properties
		 * @private
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.renderAttributeProperties = function(oRm, oWebComponent) {
			var oAttrProperties = oWebComponent.getMetadata().getPropertiesByMapping("attribute");
			for (var sPropName in oAttrProperties) {
				var oPropData = oAttrProperties[sPropName];
				var sAttrName = oPropData._sMapTo ? oPropData._sMapTo : hyphenate(sPropName);
				var vPropValue = oPropData.get(oWebComponent);
				if (oPropData._fnMappingFormatter) {
					vPropValue = oWebComponent[oPropData._fnMappingFormatter].call(oWebComponent, vPropValue);
				}

				if (oPropData.type === "boolean") {
					if (vPropValue) {
						oRm.attr(sAttrName, "");
					}
				} else {
					if (vPropValue != null) {
						oRm.attr(sAttrName, vPropValue);
					}
				}
			}
		};

		/**
		 * Preserves attributes that the component set on itself internally (such as private attributes and the attribute that mimics the tag, e.g. "ui5-button")
		 * This is necessary as otherwise Patcher.js will remove them upon each re-rendering
		 * @private
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.preserveUnmanagedAttributes = function(oRm, oWebComponent) {
			var oDomRef = oWebComponent.getDomRef();
			if (!oDomRef) {
				return; // First rendering - the unmanaged attributes haven't been set yet
			}

			var aAttributes = oDomRef.getAttributeNames();
			var mProperties = oWebComponent.getMetadata().getAllProperties();
			var aSkipList = ["id", "data-sap-ui", "style", "class"];
			aAttributes.forEach(function(sAttr) {
				if (aSkipList.indexOf(sAttr) !== -1) {
					return; // Skip attributes, set by the framework
				}
				var sProp = camelize(sAttr);
				if (mProperties[sProp] !== undefined) {
					return; // Skip managed attributes/properties
				}

				var sValue = oDomRef.getAttribute(sAttr); // Repeat the value from DOM
				if (sValue !== null) {
					oRm.attr(sAttr, sValue);
				}
			});
		};

		/**
		 * Preserves styles that the component set on itself internally (such as position top, left and CSS Variables)
		 * This is necessary as otherwise Patcher.js will remove them upon each re-rendering
		 * @private
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.preserveUnmanagedStyles = function(oRm, oWebComponent) {
			var oDomRef = oWebComponent.getDomRef();
			if (!oDomRef) {
				return; // First rendering - the unmanaged styles haven't been set yet
			}
			var aSetStyles = Array.prototype.slice.apply(oDomRef.style);
			if (aSetStyles.length === 0) {
				return; // No styles set at all
			}

			var oStyleProperties = oWebComponent.getMetadata().getPropertiesByMapping("style");
			var aManagedStyles = [];
			for (var sPropName in oStyleProperties) {
				var oPropData = oStyleProperties[sPropName];
				var sStyleName = oPropData._sMapTo ? oPropData._sMapTo : hyphenate(sPropName);
				aManagedStyles.push(sStyleName);
			}

			aSetStyles.forEach(function(sStyle) {
				if (aManagedStyles.indexOf(sStyle) !== -1) {
					return; // Do not preserve any managed styles
				}
				var sValue = sStyle.startsWith("--") ? window.getComputedStyle(oDomRef).getPropertyValue(sStyle) : oDomRef.style[sStyle]; // CSS Values can only be read from getComputedStyle
				oRm.style(sStyle, sValue);
			});
		};

		/**
		 * Renders styles, based on the control's properties
		 * @private
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.renderStyleProperties = function(oRm, oWebComponent) {
			var oStyleProperties = oWebComponent.getMetadata().getPropertiesByMapping("style");
			for (var sPropName in oStyleProperties) {
				var oPropData = oStyleProperties[sPropName];
				var sStyleName = oPropData._sMapTo ? oPropData._sMapTo : hyphenate(sPropName);
				var vPropValue = oPropData.get(oWebComponent);
				if (oPropData._fnMappingFormatter) {
					vPropValue = oWebComponent[oPropData._fnMappingFormatter].call(oWebComponent, vPropValue);
				}

				if (vPropValue != null) {
					oRm.style(sStyleName, vPropValue);
				}
			}
		};

		/**
		 * Renders text inside the component, if it has a property of type textContent
		 * Normally a single property of this type is expected (such as button text), but if more than one are set, they are all rendered
		 * @private
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.renderTextContentProperties = function(oRm, oWebComponent) {
			var oTextContentProperties = oWebComponent.getMetadata().getPropertiesByMapping("textContent");
			for (var sPropName in oTextContentProperties) {
				var oPropData = oTextContentProperties[sPropName];
				var vPropValue = oPropData.get(oWebComponent);
				if (oPropData._fnMappingFormatter) {
					vPropValue = oWebComponent[oPropData._fnMappingFormatter].call(oWebComponent, vPropValue);
				}

				oRm.text(vPropValue);
			}
		};

		/**
		 * Renders properties as slotted text inside a div/span or another tag
		 * This is mostly useful for value state message as UI5 Web Components get the value state message as slotted text
		 * @private
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.renderSlotProperties = function(oRm, oWebComponent) {
			var oSlotProperties = oWebComponent.getMetadata().getPropertiesByMapping("slot");
			for (var sPropName in oSlotProperties) {
				var oPropData = oSlotProperties[sPropName];
				var vPropValue = oPropData.get(oWebComponent);
				if (oPropData._fnMappingFormatter) {
					vPropValue = oWebComponent[oPropData._fnMappingFormatter].call(oWebComponent, vPropValue);
				}
				var sTag = oPropData._sMapTo ? oPropData._sMapTo : "span";

				if (vPropValue) {
					oRm.openStart(sTag);
					oRm.attr("slot", sPropName);
					oRm.openEnd();
					oRm.text(vPropValue);
					oRm.close(sTag);
				}
			}
		};

		/**
		 * Render children.
		 * Note: for each child, RenderManager.js will set the "slot" attribute automatically
		 * @private
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.renderAggregations = function(oRm, oWebComponent) {
			var oAggregations = oWebComponent.getMetadata().getAllAggregations();
			for (var sAggName in oAggregations) {
				if (Element.getMetadata().getAggregations().hasOwnProperty(sAggName) || Control.getMetadata().getAggregations().hasOwnProperty(sAggName)) {
					continue; // Skip aggregations, derived from Element.js / Control.js such as dependents and layoutData
				}

				var aggData = oAggregations[sAggName];
				var aggValue = aggData.get(oWebComponent);

				if (aggData.multiple) {
					aggValue.forEach(oRm.renderControl, oRm);
				} else {
					if (aggValue) {
						oRm.renderControl(aggValue);
					}
				}
			}
		};

		/**
		 * Hook. For future use.
		 * @protected
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.customRenderInOpeningTag = function(oRm, oWebComponent) {};

		/**
		 * Hook. For future use.
		 * @param oRm
		 * @param oWebComponent
		 */
		WebComponentRenderer.customRenderInsideTag = function(oRm, oWebComponent) {};

		return WebComponentRenderer;

	});
