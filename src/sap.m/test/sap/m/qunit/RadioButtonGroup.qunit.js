/*global QUnit, sinon */

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/thirdparty/jquery",
	"sap/ui/util/Mobile",
	"sap/ui/core/library",
	"sap/ui/events/KeyCodes",
	"sap/m/RadioButtonGroup",
	"sap/m/RadioButton",
	"sap/ui/core/Core"
], function(
	qutils,
	jQuery,
	Mobile,
	coreLibrary,
	KeyCodes,
	RadioButtonGroup,
	RadioButton,
	Core
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	// shortcut for sap.ui.core.TextDirection
	var TextDirection = coreLibrary.TextDirection;

	Mobile.init();

	QUnit.module("Rendering");


	/* --------------------------------------- */
	/* Test: Default Values                    */
	/* --------------------------------------- */

	QUnit.test("Default Values", function(assert){

		var bEnabled = true;
		var bEditable = true;
		var bVisible = true;
		var nColumns = 1;
		var oValueState = ValueState.None;
		var nSelectedIndex = 0;

		// system under test
		var oRBGroup = new RadioButtonGroup();
		var oRadioButton = new RadioButton("option1");
		oRadioButton.setText("Option 1");
		oRadioButton.setTooltip("Tooltip 1");
		oRBGroup.addButton(oRadioButton);

		oRadioButton = new RadioButton("option2");
		oRadioButton.setText("Option 2");
		oRadioButton.setTooltip("Tooltip 2");
		oRBGroup.addButton(oRadioButton);

		// arrange
		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assertions
		assert.strictEqual(oRBGroup.getColumns(), nColumns, "Property 'columns': Default value should be '" + nColumns + "'");
		assert.strictEqual(oRBGroup.getVisible(), bVisible, "Property 'visible': Default value should be '" + bVisible + "'");
		assert.strictEqual(oRBGroup.getEditable(), bEditable, "Property 'editable': Default value should be '" + bEditable + "'");
		assert.strictEqual(oRBGroup.getValueState(), oValueState, "Property 'valueState': Default value should be '" + oValueState + "'");
		assert.strictEqual(oRBGroup.getSelectedIndex(), nSelectedIndex, "Property 'selectedIndex': Default value should be '" + nSelectedIndex + "'");
		assert.strictEqual(oRBGroup.getEnabled(), bEnabled, "Property 'enabled': Default value should be '" + bEnabled + "'");

		// cleanup
		oRBGroup.destroyButtons();
		oRBGroup.destroy();
	});

	/* ----------------------------------------------- */
	/* Test: 'visible=false'                           */
	/* ----------------------------------------------- */

	QUnit.test("'visible=false'", function(assert){

		// system under test
		var oRBGroup = new RadioButtonGroup({visible: false});
		var oRadioButton = new RadioButton("option1");
		oRadioButton.setText("Option 1");
		oRadioButton.setTooltip("Tooltip 1");
		oRBGroup.addButton(oRadioButton);

		oRadioButton = new RadioButton("option2");
		oRadioButton.setText("Option 2");
		oRadioButton.setTooltip("Tooltip 2");
		oRBGroup.addButton(oRadioButton);

		// arrange
		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assertions
		assert.ok(!oRBGroup.getDomRef(), "visible=true: RadioButtonGroup should not have been rendered");

		// cleanup
		oRBGroup.destroyButtons();
		oRBGroup.destroy();
	});

	/* ----------------------------------------------- */
	/* Test: 'enabled=false'                            */
	/* ----------------------------------------------- */

	QUnit.test("'enabled=false'", function(assert){

		// system under test
		var bEnabled = false;
		var oRBGroup = new RadioButtonGroup({enabled: bEnabled});
		var oRadioButton = new RadioButton("option1");
		oRadioButton.setText("Option 1");
		oRadioButton.setTooltip("Tooltip 1");
		oRBGroup.addButton(oRadioButton);

		oRadioButton = new RadioButton("option2");
		oRadioButton.setText("Option 2");
		oRadioButton.setTooltip("Tooltip 2");
		oRBGroup.addButton(oRadioButton);

		var aRadioButtons = oRBGroup.getButtons();

		// arrange
		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assertions
		for (var i = 0; i < aRadioButtons.length; i++) {
			bEnabled = bEnabled || aRadioButtons[i].getEnabled();
		}
		assert.ok(!oRBGroup.getEnabled(), "enabled=" + bEnabled + ": RadioButtonGroup should be disabled");
		assert.strictEqual(oRBGroup.$().find(".sapMRbDis").length, oRBGroup.getButtons().length, "Disabled radios count should equal all items count");

		// cleanup
		oRBGroup.destroyButtons();
		oRBGroup.destroy();
	});

	/* -------------------------------- */
	/* 	   tests for setSelectedIndex() */
	/* -------------------------------- */

	QUnit.test("setSelectedIndex()", function(assert) {

		var oRBGroup = new RadioButtonGroup("RBG");
		var iSelectedIndex = 1;

		// arrange
		var oRadioButton1 = new RadioButton("option1");
		oRadioButton1.setText("Option 1");
		oRadioButton1.setTooltip("Tooltip 1");
		oRBGroup.addButton(oRadioButton1);

		var oRadioButton2 = new RadioButton("option2");
		oRadioButton2.setText("Option 2");
		oRadioButton2.setTooltip("Tooltip 2");
		oRBGroup.addButton(oRadioButton2);

		Core.applyChanges();


		oRBGroup.placeAt("qunit-fixture");
		oRBGroup.setSelectedIndex(iSelectedIndex);

		// assertions
		assert.equal(oRBGroup.getSelectedIndex(), iSelectedIndex, "The selectedIndex should be " + iSelectedIndex);
		assert.equal(oRBGroup.getSelectedButton(), oRadioButton2, "The second Radio Button should be selected");

		// cleanup
		oRBGroup.destroyButtons();
		oRBGroup.destroy();
	});

	/*	--------------------------------------- 	*/
	/*			tests for keyboard handling			*/
	/*	--------------------------------------- 	*/
	QUnit.test("'keyboard handling'", function(assert) {
		//setup RadioButtonGroups
		var iRadiosCount = 4;
		var columnsCount = 2;
		var oRBGroup = new RadioButtonGroup("RBG1", {
			columns : columnsCount
		});

		for (var i = 0; i < iRadiosCount; i++) {
			var oRadioButton = new RadioButton("option1-" + i);
			oRadioButton.setText("Option " + i);
			oRadioButton.setTooltip("Tooltip " + i);
			oRBGroup.addButton(oRadioButton);
		}

		Core.applyChanges();

		// Focus first radio
		oRBGroup.placeAt("qunit-fixture");
		qutils.triggerMouseEvent("RBG1-0", "click");
		Core.applyChanges();

		assert.equal(oRBGroup.getSelectedIndex(), 0, "Selected index should be 0");

		// Test arrow pressing
		qutils.triggerKeydown("RBG1", KeyCodes.ARROW_RIGHT);
		Core.applyChanges();
		assert.equal(oRBGroup.getSelectedIndex(), 1, "Selected index should be 1");

		qutils.triggerKeydown("RBG1", KeyCodes.ARROW_DOWN);
		Core.applyChanges();
		assert.equal(oRBGroup.getSelectedIndex(), 3, "Selected index should be 3");

		qutils.triggerKeydown("RBG1", KeyCodes.ARROW_LEFT);
		Core.applyChanges();
		assert.equal(oRBGroup.getSelectedIndex(), 2, "Selected index should be 2");

		qutils.triggerKeydown("RBG1", KeyCodes.ARROW_UP);
		Core.applyChanges();
		assert.equal(oRBGroup.getSelectedIndex(), 0, "Selected index should be 0");

		qutils.triggerKeydown("RBG1", KeyCodes.END);
		Core.applyChanges();
		assert.equal(oRBGroup.getSelectedIndex(), 3, "Selected index should be 3");

		qutils.triggerKeydown("RBG1", KeyCodes.HOME);
		Core.applyChanges();
		assert.equal(oRBGroup.getSelectedIndex(), 0, "Selected index should be 0");

		qutils.triggerKeydown("RBG1", KeyCodes.ARROW_LEFT);
		Core.applyChanges();
		assert.equal(oRBGroup.getSelectedIndex(), 3, "Selected index should be 3");

		assert.strictEqual(oRBGroup.getDomRef().querySelectorAll(".sapMRb[tabindex='0']").length, 1, "only one button has tabindex='0'");
		assert.strictEqual(oRBGroup.getDomRef().querySelectorAll(".sapMRb[tabindex='-1']").length, 3, "the other buttons have tabIndex='-1' set has tabindex='0'");

		// cleanup
		oRBGroup.destroyButtons();
		oRBGroup.destroy();
	});

	QUnit.test("tabIndex is correct after initially selected button is selected again (programmatically) - BCP 2380027793", function(assert) {
		var oRBGroup = new RadioButtonGroup("RBG1", {
			selectedIndex: 0,
			buttons: [
				new RadioButton({ text: "First"}),
				new RadioButton({ text: "Second"})
			]
		});

		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		assert.strictEqual(oRBGroup.getButtons()[0].getDomRef().tabIndex, 0, "tabindex='0' for the initially selected radio button");

		// select again the same radio button
		oRBGroup.setSelectedIndex(0);
		Core.applyChanges();

		assert.strictEqual(oRBGroup.getButtons()[0].getDomRef().tabIndex, 0, "tabindex='0' after initially selected radio button is selected again");

		// cleanup
		oRBGroup.destroy();
	});

	/*	--------------------------------------- 	*/
	/*	        tests textDirection	            	*/
	/*	--------------------------------------- 	*/

	QUnit.test("textDirection set to RTL", function(assert) {
		// arrange
		var oRBGroup = new RadioButtonGroup({
			textDirection: TextDirection.RTL,
			columns: 2,
			buttons: [
				new RadioButton({text: "Option 1, First Column"}),
				new RadioButton({text: "Option 2, Second Column"})
			]
		});

		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assertions
		assert.equal(jQuery(oRBGroup.getDomRef()).attr("dir"), "rtl", "Control has 'dir' property set to right to left");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.test("textDirection set to LTR", function(assert) {
		// arrange
		var oRBGroup = new RadioButtonGroup({
			textDirection: TextDirection.LTR,
			columns: 2,
			buttons: [
				new RadioButton({text: "Option 1, First Column"}),
				new RadioButton({text: "Option 2, Second Column"})
			]
		});

		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assertions
		assert.equal(jQuery(oRBGroup.getDomRef()).attr("dir"), "ltr", "Control has 'dir' property set to left to right");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.test("Invisible buttons", function(assert) {
		var oRBGroup = new RadioButtonGroup({
			buttons: [
				new RadioButton({
					text: "1"
				}),
				new RadioButton({
					text: "2"
				}),
				new RadioButton({
					text: "3",
					selected: true,
					visible: false
				})
			]
		}).placeAt("qunit-fixture");
		Core.applyChanges();

		// assertions
		assert.strictEqual(oRBGroup.getSelectedIndex(), 0, "selectedIndex=0");

		oRBGroup.getButtons()[0].setVisible(false);
		Core.applyChanges();

		assert.strictEqual(oRBGroup.getSelectedIndex(), 0, "selectedIndex=0");
		assert.strictEqual(oRBGroup.getButtons()[1].getDomRef().tabIndex, 0, "tabIndex=0");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.test("Invisible buttons - selected index", function(assert) {
		var oRBGroup = new RadioButtonGroup({
			selectedIndex: 2,
			buttons: [
				new RadioButton({
					text: "1"
				}),
				new RadioButton({
					text: "2",
					visible: false
				}),
				new RadioButton({
					text: "3"
				})
			]
		}).placeAt("qunit-fixture");
		Core.applyChanges();

		assert.ok(oRBGroup.getButtons()[2].getSelected(), "correct button is selected");
		assert.strictEqual(oRBGroup._oItemNavigation.getFocusedIndex(), 1, "item navigation focused index is correct");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.test("Invisible buttons - chaning focus", function(assert) {
		var oRBGroup = new RadioButtonGroup({
			buttons: [
				new RadioButton({
					text: "1"
				}),
				new RadioButton({
					text: "2",
					visible: false
				}),
				new RadioButton({
					text: "3"
				})
			]
		}).placeAt("qunit-fixture");
		Core.applyChanges();

		// act
		oRBGroup.getButtons()[0].focus();

		// assert
		assert.strictEqual(document.activeElement, oRBGroup.getButtons()[0].getDomRef(), "First button should be focused");

		// act
		oRBGroup.setSelectedIndex(2);

		// assert
		assert.strictEqual(document.activeElement, oRBGroup.getButtons()[2].getDomRef(), "Third button should be focused");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.module("Setters", {
		beforeEach : function() {
			this.rbg = new RadioButtonGroup({
				buttons: [
					new RadioButton({enabled: false, text: "Option 1"}),
					new RadioButton({editable: false, text: "Option 2"}),
					new RadioButton({text: "Option 3"})
				]
			});

			this.rbg.placeAt("qunit-fixture");
			Core.applyChanges();
		},
		afterEach : function() {
			this.rbg.destroy();
		}
	});

	QUnit.test("setEnabled doesn't modify RadioButton state", function(assert) {
		var aButtons = this.rbg.getButtons();

		// act
		this.rbg.setEnabled(false);
		Core.applyChanges();

		// assert
		assert.equal(aButtons[0].getEnabled(), false, "First RadioButton is disabled");
		assert.equal(aButtons[1].getEnabled(), false, "Second RadioButton is enabled due to EnabledPropagator");
		assert.equal(aButtons[1].getProperty("enabled"), true, "Second RadioButton keeps enabled=true in mProperties");
		assert.equal(aButtons[2].getEnabled(), false, "Third RadioButton is enabled due to EnabledPropagator");
		assert.equal(aButtons[1].getProperty("enabled"), true, "Third RadioButton keeps enabled=true in mProperties");

		// act
		this.rbg.setEnabled(true);

		// assert
		assert.equal(aButtons[0].getEnabled(), false, "First RadioButton is disabled");
		assert.equal(aButtons[1].getEnabled(), true, "Second RadioButton is enabled");
		assert.equal(aButtons[2].getEnabled(), true, "Third RadioButton is enabled");
	});

	QUnit.test("setEditable doesn't modify RadioButton state", function(assert) {
		var aButtons = this.rbg.getButtons();
		var oPropagateStateStub = this.stub(RadioButton.prototype, "_setEditableParent");

		// act
		this.rbg.setEditable(false);
		Core.applyChanges();

		// assert
		assert.ok(oPropagateStateStub.called, "Propagation should be called");
		assert.ok(oPropagateStateStub.alwaysCalledWith(false), "Editable should be propagated to all buttons");
		assert.strictEqual(oPropagateStateStub.callCount, 3, "Propagation should be called 3 times");
		assert.equal(aButtons[0].getEditable(), true, "First RadioButton is editable");
		assert.equal(aButtons[1].getEditable(), false, "Second RadioButton is read only");
		assert.equal(aButtons[2].getEditable(), true, "Third RadioButton is editable");

		// act
		this.rbg.setEditable(true);

		// assert
		assert.equal(aButtons[0].getEditable(), true, "First RadioButton is editable");
		assert.equal(aButtons[1].getEditable(), false, "Second RadioButton is read only");
		assert.equal(aButtons[2].getEditable(), true, "Third RadioButton is editable");
	});

	QUnit.test("setSelectedButton", function (assert) {
		var oFirstButton = this.rbg.getButtons()[1];

		// act
		this.rbg.setSelectedButton(null);

		// assert
		assert.strictEqual(this.rbg.getSelectedIndex(), -1, "Selected index should be -1 when no button is provided");

		// act
		this.rbg.setSelectedButton(oFirstButton);

		// assert
		assert.strictEqual(this.rbg.getSelectedIndex(), 1, "Selected index should be properly set");
	});

	QUnit.test("setValueState", function (assert) {
		var aButtons = this.rbg.getButtons(),
			oDisabledRB = aButtons[0],
			oReadOnlyRB = aButtons[1],
			oNormalRB = aButtons[2];

		// act
		this.rbg.setValueState(ValueState.Error);
		Core.applyChanges();

		// assert
		assert.notOk(oDisabledRB.$().hasClass("sapMRbErr"), "Setting state to the group doesn't modify disabled buttons");
		assert.notOk(oReadOnlyRB.$().hasClass("sapMRbErr"), "Setting state to the group doesn't modify read-only buttons");
		assert.ok(oNormalRB.$().hasClass("sapMRbErr"), "Setting state to the group also sets state to normal buttons");
	});

	QUnit.module("Methods", {
		beforeEach: function() {
			this.rbg = new RadioButtonGroup({
				buttons: [
					new RadioButton("firstRadioButton", {enabled: false, text: "Option 1"})
				]
			});

			this.rbg.placeAt("qunit-fixture");
			Core.applyChanges();
		},
		afterEach: function() {
			this.rbg.destroy();
		}
	});

	QUnit.test("InsertRadioButton", function(assert) {

		// insert a button at out of bounds indexes

		var oNewButton = new RadioButton({text: 'radio200'});
		this.rbg.insertButton(oNewButton, 200);

		oNewButton = new RadioButton({text: 'radio-200'});
		this.rbg.insertButton(oNewButton, -200);

		Core.applyChanges();

		// assert
		assert.equal(this.rbg.$().find('.sapMRb').length, 3, "Buttons are rendered correctly");
	});

	QUnit.test("RemoveAllButtons", function(assert) {
		var aButtons = this.rbg.removeAllButtons();
		Core.applyChanges();

		// assert
		assert.equal(this.rbg.$().find('.sapMRb').length, 0, "All buttons are removed");

		// clean up
		aButtons.forEach(function (oButton) {
			oButton.destroy();
		});
	});

	QUnit.test("Remove single button", function(assert) {
		var oFirstButton = this.rbg.getButtons()[0],
			oRadioButton = new RadioButton(),
			iLength = this.rbg.getButtons().length,
			oRemovedButton;

		// act
		this.rbg.removeButton(oRadioButton);

		// assert
		assert.strictEqual(this.rbg.getButtons().length, iLength, "Should NOT change buttons when non-member button is given.");

		// act
		oRemovedButton = this.rbg.removeButton("firstRadioButton");

		// assert
		assert.strictEqual(this.rbg.indexOfButton(oFirstButton), -1, "Should be able to remove button by given ID.");

		// clean up
		oRemovedButton.destroy();

	});

	QUnit.test("#destroyButtons should NOT modify the 'selectedIndex'", function (assert) {
		// arrange
		var iSelectedIndex = 1;
		this.rbg.insertButton(new RadioButton({text: "radio 2"}));
		this.rbg.setSelectedIndex(iSelectedIndex);

		// act
		this.rbg.destroyButtons();
		Core.applyChanges();

		// assert
		assert.strictEqual(this.rbg.getSelectedIndex(), iSelectedIndex, "Selected index is preserved after destroying buttons");
	});

	QUnit.test("#_getSelectedIndexInRange", function (assert) {
		assert.strictEqual(this.rbg._getSelectedIndexInRange(), 0, "Returns the actual selected button index");
	});

	QUnit.test("#_getSelectedIndexInRange", function (assert) {
		// act
		this.rbg.setSelectedIndex(5000);

		// assert
		assert.strictEqual(this.rbg._getSelectedIndexInRange(), -1, "Returns -1 when no button is selected");
	});

	QUnit.module("Events", {
		beforeEach: function() {
			this.rbg = new RadioButtonGroup({
				buttons: [
					new RadioButton("firstRadioButton"),
					new RadioButton(),
					new RadioButton()
				]
			});

			this.rbg.placeAt("qunit-fixture");
			Core.applyChanges();
		},
		afterEach: function() {
			this.rbg.destroy();
		}
	});

	QUnit.test("Button selection", function (assert) {
		var fnSpy = sinon.spy(),
			oFirstButton = this.rbg.getButtons()[1];

		this.rbg.attachSelect(fnSpy);

		// act
		qutils.triggerEvent("tap", oFirstButton.getId());
		this.clock.tick(300);

		// assert
		assert.strictEqual(fnSpy.callCount, 1, "Click on a radio button should fire 'select'.");
	});

	QUnit.module("Buttons selection");

	QUnit.test("setSelected should check RadioButton and uncheck all other RadioButtons from the same group", function (assert) {

		// arrange
		var oRBGroup =  new RadioButtonGroup("RBG1"),
			oRadioButton1 = new RadioButton(),
			oRadioButton2 = new RadioButton();

		oRBGroup.addButton(oRadioButton1);
		oRBGroup.addButton(oRadioButton2);

		oRadioButton2.setSelected(true);

		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assert
		assert.ok(!oRadioButton1.getSelected(), "RadioButton should not be selected");
		assert.ok(oRadioButton2.getSelected(), "RadioButton should be selected");

		// cleanup
		oRadioButton1.destroy();
		oRadioButton2.destroy();
		oRBGroup.destroy();
	});

	QUnit.test("'selectedIndex' should NOT be modified onBeforeRendering", function (assert) {
		// arrange

		var oRBGroup =  new RadioButtonGroup({
			buttons: [
				new RadioButton(),
				new RadioButton()
			]
		});

		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assert
		assert.ok(oRBGroup.getButtons()[0].getSelected(), "First radio button of the group should be selected");
		// act
		oRBGroup.setSelectedIndex(100);

		// assert
		assert.strictEqual(oRBGroup.getSelectedIndex(), 100, "'selectedIndex' is set on the group");

		// act
		Core.applyChanges();

		// assert
		assert.strictEqual(oRBGroup.getSelectedIndex(), 100, "'selectedIndex' is kept after rendering");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.test("Initially selected button in the group should be the last whose setSelected(true) was called", function (assert) {
		// arrange
		var oButton1 = new RadioButton("RB1"),
			oButton2 = new RadioButton("RB2"),
			oButton3 = new RadioButton("RB3");
		var oRBGroup =  new RadioButtonGroup({
			buttons: [
				oButton1,
				oButton2,
				oButton3
			]
		});

		// act before rendering of the group
		oButton1.setSelected(true);
		oButton3.setSelected(true);
		oButton2.setSelected(true);
		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assert
		assert.notOk(oButton1.getSelected(), "'RB1' shouldn't be selected");
		assert.notOk(oButton3.getSelected(), "'RB3' shouldn't be selected");
		assert.ok(oButton2.getSelected(), "'RB2' should be selected");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.test("Selected button in the group should be the last whose setSelected(true) was called", function (assert) {
		// arrange
		var oButton1 = new RadioButton("RB1"),
			oButton2 = new RadioButton("RB2"),
			oButton3 = new RadioButton("RB3");
		var oRBGroup =  new RadioButtonGroup({
			buttons: [
				oButton1,
				oButton2,
				oButton3
			]
		});

		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// act - after rendering of the group
		oButton1.setSelected(true);
		oButton3.setSelected(true);
		oButton2.setSelected(true);
		oButton1.setSelected(false);
		Core.applyChanges();

		// assert
		assert.notOk(oButton1.getSelected(), "'RB1' shouldn't be selected");
		assert.notOk(oButton3.getSelected(), "'RB3' shouldn't be selected");
		assert.ok(oButton2.getSelected(), "'RB2' should be selected");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.test("Selected button and selectedIndex combination", function (assert) {
		// arrange
		var oRBGroup =  new RadioButtonGroup({
			selectedIndex: 2
		});

		oRBGroup.addButton(new RadioButton("RB1"));
		oRBGroup.addButton(new RadioButton("RB2", {
			selected: true
		}));
		oRBGroup.addButton(new RadioButton("RB3"));

		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assert
		assert.notOk(oRBGroup.getButtons()[0].getSelected(), "'RB1' shouldn't be selected");
		assert.notOk(oRBGroup.getButtons()[2].getSelected(), "'RB3' shouldn't be selected");
		assert.ok(oRBGroup.getButtons()[1].getSelected(), "'RB2' should be selected");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.test("No Preselection by Default", function(assert) {
		// arrange
		var oRBGroup = new RadioButtonGroup("RBG1"),
			oRadioButton1 = new RadioButton(),
			oRadioButton2 = new RadioButton();

		oRBGroup.addButton(oRadioButton1);
		oRBGroup.addButton(oRadioButton2);

		oRadioButton1.setSelected(false);
		oRadioButton2.setSelected(false);

		oRBGroup.placeAt("qunit-fixture");
		Core.applyChanges();

		// assert
		assert.ok(!oRadioButton1.getSelected(), "RadioButton should not be selected");
		assert.ok(!oRadioButton2.getSelected(), "RadioButton should not be selected");

		// cleanup
		oRBGroup.destroy();
	});

	QUnit.module("Navigation through Radio Button Groups");

	QUnit.test("After mouse selection tab focus should be on the last pressed item.", function (assert) {

		this.clock.restore();
		// arrange
		var oRBGroup = new RadioButtonGroup("RBG1"),
			oRadioButton1 = new RadioButton("RB1"),
			oRadioButton2 = new RadioButton("RB2"),
			oRBGroup2 = new RadioButtonGroup("RBG2"),
			oRadioButton3 = new RadioButton("RB3"),
			oRadioButton4 = new RadioButton("RB4");

		var done = assert.async();

		oRBGroup.addButton(oRadioButton1);
		oRBGroup.addButton(oRadioButton2);

		oRBGroup2.addButton(oRadioButton3);
		oRBGroup2.addButton(oRadioButton4);

		oRadioButton1.setSelected(true);
		oRadioButton3.setSelected(true);

		oRBGroup.placeAt("qunit-fixture");
		oRBGroup2.placeAt("qunit-fixture");

		Core.applyChanges();

		oRBGroup2.attachEventOnce("select", function() {
			// assert 1
			assert.strictEqual(oRadioButton4.$().attr("tabIndex"), "0", "TabIndex of currently selected element is 0");
			assert.strictEqual(oRadioButton3.$().attr("tabIndex"), "-1", "TabIndex of previously selected element is -1");

			oRBGroup.attachEventOnce("select", function() {
				// assert 2
				assert.strictEqual(oRadioButton2.$().attr("tabIndex"), "0", "TabIndex of currently selected element is '0'");
				assert.strictEqual(oRadioButton1.$().attr("tabIndex"), "-1", "TabIndex of previously selected element is '-1'");
				// cleanup
				oRBGroup.destroy();
				oRBGroup2.destroy();
				done();
			});
			// act 2
			qutils.triggerEvent("tap", "RB2");
		});
		// act 1
		qutils.triggerEvent("tap", "RB4" );
	});
});
