sap.ui.define(['sap/ui/webc/common/thirdparty/base/renderer/LitRenderer'], function (litRender) { 'use strict';

	const block0 = (context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-responsive-popover", tags, suffix)} placement-type="Bottom" horizontal-align="Stretch" class="${litRender.classMap(context.classes.popover)}" hide-arrow _disable-initial-focus @ui5-selection-change=${litRender.ifDefined(context._listSelectionChange)} @ui5-after-close=${litRender.ifDefined(context._afterClosePicker)} @ui5-before-open=${litRender.ifDefined(context._beforeOpen)} @ui5-after-open=${litRender.ifDefined(context._afterOpenPicker)}>${ context._isPhone ? block1(context, tags, suffix) : undefined }${ !context._isPhone ? block6(context, tags, suffix) : undefined }${ context.filterSelected ? block11(context, tags, suffix) : block13(context, tags, suffix) }${ context._isPhone ? block15(context, tags, suffix) : undefined }</${litRender.scopeTag("ui5-responsive-popover", tags, suffix)}>${ context.hasValueStateMessage ? block16(context, tags, suffix) : undefined } `;
	const block1 = (context, tags, suffix) => litRender.html`<div slot="header" class="ui5-responsive-popover-header" style="${litRender.styleMap(context.styles.popoverHeader)}"><div class="row"><span>${litRender.ifDefined(context._headerTitleText)}</span><${litRender.scopeTag("ui5-button", tags, suffix)} class="ui5-responsive-popover-close-btn" icon="decline" design="Transparent" @click="${context.handleCancel}"></${litRender.scopeTag("ui5-button", tags, suffix)}></div><div class="row"><div slot="header" class="input-root-phone" value-state="${litRender.ifDefined(context.valueState)}"><input .value="${litRender.ifDefined(context.value)}" inner-input placeholder="${litRender.ifDefined(context.placeholder)}" value-state="${litRender.ifDefined(context.valueState)}" @input="${context._inputLiveChange}" @change=${context._inputChange} aria-autocomplete="both" aria-labelledby="${litRender.ifDefined(context._id)}-hiddenText-nMore" aria-describedby="${litRender.ifDefined(context._id)}-valueStateDesc" /></div><${litRender.scopeTag("ui5-toggle-button", tags, suffix)} slot="header" class="ui5-multi-combobox-toggle-button" icon="multiselect-all" design="Transparent" ?pressed=${context._showAllItemsButtonPressed} @click="${context.filterSelectedItems}"></${litRender.scopeTag("ui5-toggle-button", tags, suffix)}></div>${ context.hasValueStateMessage ? block2(context, tags, suffix) : undefined }</div></div>`;
	const block2 = (context, tags, suffix) => litRender.html`<div class="${litRender.classMap(context.classes.popoverValueState)}" style="${litRender.styleMap(context.styles.popoverValueStateMessage)}"><${litRender.scopeTag("ui5-icon", tags, suffix)} class="ui5-input-value-state-message-icon" name="${litRender.ifDefined(context._valueStateMessageIcon)}"></${litRender.scopeTag("ui5-icon", tags, suffix)}>${ context.shouldDisplayDefaultValueStateMessage ? block3(context) : block4(context) }</div>`;
	const block3 = (context, tags, suffix) => litRender.html`${litRender.ifDefined(context.valueStateText)}`;
	const block4 = (context, tags, suffix) => litRender.html`${ litRender.repeat(context.valueStateMessageText, (item, index) => item._id || index, (item, index) => block5(item)) }`;
	const block5 = (item, index, context, tags, suffix) => litRender.html`${litRender.ifDefined(item)}`;
	const block6 = (context, tags, suffix) => litRender.html`${ context.hasValueStateMessage ? block7(context, tags, suffix) : undefined }`;
	const block7 = (context, tags, suffix) => litRender.html`<div slot="header" @keydown="${context._onValueStateKeydown}" tabindex="0" class="ui5-responsive-popover-header ${litRender.classMap(context.classes.popoverValueState)}" style=${litRender.styleMap(context.styles.popoverValueStateMessage)}><${litRender.scopeTag("ui5-icon", tags, suffix)} class="ui5-input-value-state-message-icon" name="${litRender.ifDefined(context._valueStateMessageIcon)}"></${litRender.scopeTag("ui5-icon", tags, suffix)}>${ context.shouldDisplayDefaultValueStateMessage ? block8(context) : block9(context) }</div>`;
	const block8 = (context, tags, suffix) => litRender.html`${litRender.ifDefined(context.valueStateText)}`;
	const block9 = (context, tags, suffix) => litRender.html`${ litRender.repeat(context.valueStateMessageText, (item, index) => item._id || index, (item, index) => block10(item)) }`;
	const block10 = (item, index, context, tags, suffix) => litRender.html`${litRender.ifDefined(item)}`;
	const block11 = (context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-list", tags, suffix)} separators="None" mode="MultiSelect" class="ui5-multi-combobox-all-items-list">${ litRender.repeat(context.selectedItems, (item, index) => item._id || index, (item, index) => block12(item, index, context, tags, suffix)) }</${litRender.scopeTag("ui5-list", tags, suffix)}>`;
	const block12 = (item, index, context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-li", tags, suffix)} type="${litRender.ifDefined(context._listItemsType)}" additional-text=${litRender.ifDefined(item.additionalText)} ?selected=${item.selected} data-ui5-token-id="${litRender.ifDefined(item._id)}" data-ui5-stable="${litRender.ifDefined(item.stableDomRef)}" @keydown="${context._onItemKeydown}">${litRender.ifDefined(item.text)}</${litRender.scopeTag("ui5-li", tags, suffix)}>`;
	const block13 = (context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-list", tags, suffix)} separators="None" mode="MultiSelect" class="ui5-multi-combobox-all-items-list">${ litRender.repeat(context._filteredItems, (item, index) => item._id || index, (item, index) => block14(item, index, context, tags, suffix)) }</${litRender.scopeTag("ui5-list", tags, suffix)}>`;
	const block14 = (item, index, context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-li", tags, suffix)} type="${litRender.ifDefined(context._listItemsType)}" additional-text=${litRender.ifDefined(item.additionalText)} ?selected=${item.selected} data-ui5-token-id="${litRender.ifDefined(item._id)}" data-ui5-stable="${litRender.ifDefined(item.stableDomRef)}" @keydown="${context._onItemKeydown}">${litRender.ifDefined(item.text)}</${litRender.scopeTag("ui5-li", tags, suffix)}>`;
	const block15 = (context, tags, suffix) => litRender.html`<div slot="footer" class="ui5-responsive-popover-footer"><${litRender.scopeTag("ui5-button", tags, suffix)} design="Transparent" @click="${context.handleOK}">${litRender.ifDefined(context._dialogOkButton)}</${litRender.scopeTag("ui5-button", tags, suffix)}></div>`;
	const block16 = (context, tags, suffix) => litRender.html`<${litRender.scopeTag("ui5-popover", tags, suffix)} skip-registry-update _disable-initial-focus prevent-focus-restore hide-arrow class="ui5-valuestatemessage-popover" placement-type="Bottom" horizontal-align="${litRender.ifDefined(context._valueStatePopoverHorizontalAlign)}"><div slot="header" class="${litRender.classMap(context.classes.popoverValueState)}" style="${litRender.styleMap(context.styles.popoverHeader)}"><${litRender.scopeTag("ui5-icon", tags, suffix)} class="ui5-input-value-state-message-icon" name="${litRender.ifDefined(context._valueStateMessageIcon)}"></${litRender.scopeTag("ui5-icon", tags, suffix)}>${ context.shouldDisplayDefaultValueStateMessage ? block17(context) : block18(context) }</div></${litRender.scopeTag("ui5-popover", tags, suffix)}>`;
	const block17 = (context, tags, suffix) => litRender.html`${litRender.ifDefined(context.valueStateText)}`;
	const block18 = (context, tags, suffix) => litRender.html`${ litRender.repeat(context.valueStateMessageText, (item, index) => item._id || index, (item, index) => block19(item)) }`;
	const block19 = (item, index, context, tags, suffix) => litRender.html`${litRender.ifDefined(item)}`;

	return block0;

});
