sap.ui.define(['sap/ui/webc/common/thirdparty/base/asset-registries/Themes', 'sap/ui/webc/common/thirdparty/theme-base/generated/themes/sap_fiori_3/parameters-bundle.css', './sap_fiori_3/parameters-bundle.css'], function (Themes, defaultThemeBase, parametersBundle_css) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

	var defaultThemeBase__default = /*#__PURE__*/_interopDefaultLegacy(defaultThemeBase);

	Themes.registerThemePropertiesLoader("@ui5/webcomponents-theme-base", "sap_fiori_3", () => defaultThemeBase__default);
	Themes.registerThemePropertiesLoader("@ui5/webcomponents", "sap_fiori_3", () => parametersBundle_css);
	var treeListItemCss = ".ui5-hidden-text{position:absolute;clip:rect(1px,1px,1px,1px);user-select:none;left:-1000px;top:-1000px;pointer-events:none}:host(:not([hidden])){display:block;position:relative}:host([_minimal]) .ui5-li-tree-toggle-box{width:0;min-width:0}:host([_minimal]) .ui5-li-icon{padding:0}:host([_minimal]) .ui5-li-content{justify-content:center}:host([_minimal]) .ui5-li-root-tree{padding:0}:host([_minimal][show-toggle-button]):after{content:\"\";width:0;height:0;border-left:.375rem solid transparent;border-bottom:.375rem solid var(--sapContent_IconColor);position:absolute;right:.1875rem;bottom:.125rem}:host([_minimal]) .ui5-li-tree-text-wrapper{display:none}.ui5-li-root-tree{padding-left:0}:host(:not([level=\"1\"])){border-color:var(--sapList_AlternatingBackground)}:host([_toggle-button-end][selected]:not([level=\"1\"])){border-bottom:var(--ui5-listitem-selected-border-bottom)}:host([_mode]:not([_mode=None]):not([_mode=Delete]):not([selected])) .ui5-li-root-tree:hover,:host([_toggle-button-end]:not([selected])) .ui5-li-root-tree:hover{background:var(--sapList_Hover_Background);cursor:pointer}:host(:not([level=\"1\"]):not([selected])) .ui5-li-root-tree{background:var(--sapList_AlternatingBackground)}:host([_toggle-button-end]:not([level=\"1\"])) .ui5-li-root-tree{background:var(--ui5-listitem-background-color)}:host([_toggle-button-end][selected]:not([level=\"1\"])) .ui5-li-root-tree{background:var(--sapList_SelectionBackgroundColor)}:host([_mode]:not([_mode=None]):not([_mode=Delete])[selected]) .ui5-li-root-tree:hover{background-color:var(--sapList_Hover_SelectionBackground);cursor:pointer}.ui5-li-tree-toggle-box{min-width:var(--_ui5-tree-toggle-box-width);min-height:var(--_ui5-tree-toggle-box-height);display:flex;align-items:center;justify-content:center}.ui5-li-tree-toggle-icon{width:var(--_ui5-tree-toggle-icon-size);height:var(--_ui5-tree-toggle-icon-size);color:var(--sapContent_IconColor);cursor:pointer}:host([actionable]) .ui5-li-tree-toggle-icon{color:var(--sapButton_TextColor)}:host([active][actionable]) .ui5-li-tree-toggle-icon{color:var(--sapList_Active_TextColor)}.ui5-li-tree-text-wrapper{display:flex;justify-content:space-between;width:100%}";

	return treeListItemCss;

});
