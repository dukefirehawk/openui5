/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/fl/apply/_internal/flexObjects/States",
	"sap/ui/fl/apply/_internal/flexState/changes/DependencyHandler",
	"sap/ui/fl/apply/_internal/flexState/changes/UIChangesState",
	"sap/ui/fl/apply/_internal/flexState/controlVariants/VariantManagementState",
	"sap/ui/fl/apply/_internal/flexState/DataSelector",
	"sap/ui/fl/apply/_internal/flexState/FlexObjectState",
	"sap/ui/fl/apply/_internal/flexState/FlexState",
	"sap/ui/fl/initial/api/Version",
	"sap/ui/fl/registry/Settings",
	"sap/ui/fl/write/_internal/condenser/Condenser",
	"sap/ui/fl/write/_internal/flexState/FlexObjectManager",
	"sap/ui/fl/write/_internal/Storage",
	"sap/ui/fl/Layer",
	"sap/ui/fl/LayerUtils"
], function(
	Log,
	States,
	DependencyHandler,
	UIChangesState,
	VariantManagementState,
	DataSelector,
	FlexObjectState,
	FlexState,
	Version,
	Settings,
	Condenser,
	FlexObjectManager,
	Storage,
	Layer,
	LayerUtils
) {
	"use strict";

	const oVariantIndependentUIChangesDataSelector = new DataSelector({
		id: "variantIndependentUIChanges",
		parentDataSelector: FlexState.getFlexObjectsDataSelector(),
		executeFunction(aFlexObjects) {
			return aFlexObjects.filter(function(oFlexObject) {
				const bIsUIChange = oFlexObject.isA("sap.ui.fl.apply._internal.flexObjects.UIChange");
				const bIsControllerExtension = oFlexObject.isA("sap.ui.fl.apply._internal.flexObjects.ControllerExtensionChange");
				const bCorrectFileType = oFlexObject.getFileType() === "change" || oFlexObject.getFileType() === "codeExt";
				return (bIsUIChange || bIsControllerExtension)
					&& bCorrectFileType
					&& !oFlexObject.getVariantReference()
					&& !oFlexObject.getSelector().persistencyKey;
			});
		}
	});

	/**
	 * Helper object to access a change from the back end. Access helper object for each change (and variant) which was fetched from the back end
	 *
	 * @constructor
	 * @author SAP SE
	 * @version ${version}
	 * @since 1.25.0
	 * @private
	 * @param {object} mComponent - Component data to initiate <code>ChangePersistence</code> instance
	 * @param {string} mComponent.name - Name of the component this instance is responsible for
	 */
	var ChangePersistence = function(mComponent) {
		this._mComponent = mComponent;

		if (!this._mComponent || !this._mComponent.name) {
			Log.error("The Control does not belong to an SAPUI5 component. Personalization and changes for this control might not work as expected.");
			throw new Error("Missing component name.");
		}

		this._oMessagebundle = undefined;
		oVariantIndependentUIChangesDataSelector.clearCachedResult({reference: this._mComponent.name});
	};

	async function getChangesFromFlexState(sReference, mPropertyBag, bInvalidateCache) {
		try {
			if (bInvalidateCache) {
				await FlexState.update(mPropertyBag);
			}

			await FlexState.getStorageResponse(sReference);
		} catch (oError) {
			Log.warning("Problem during ChangePersistence.prototype.getChangesForComponent");
		}
	}

	/**
	 * Calls the back end asynchronously and fetches all changes for the component
	 * New changes (dirty state) that are not yet saved to the back end won't be returned.
	 * @param {object} [mPropertyBag] Contains additional data needed for reading changes
	 * @param {object} [mPropertyBag.appDescriptor] Manifest that belongs to the current running component
	 * @param {string} [mPropertyBag.siteId] ID of the site belonging to the current running component
	 * @param {string} [mPropertyBag.currentLayer] Specifies a single layer for loading changes. If this parameter is set, the max layer filtering is not applied
	 * @param {boolean} [mPropertyBag.ignoreMaxLayerParameter] Indicates that changes shall be loaded without layer filtering
	 * @param {boolean} [mPropertyBag.includeCtrlVariants] - Indicates that control variant changes shall be included
	 * @param {string} [mPropertyBag.cacheKey] Key to validate the cache entry stored on client side
	 * @param {string} [mPropertyBag.version] Number of the version to retrieve changes for
	 * @param {boolean} bInvalidateCache - should the cache be invalidated
	 * @returns {Promise} Promise resolving with an array of changes
	 * @public
	 */
	ChangePersistence.prototype.getChangesForComponent = async function(mPropertyBag, bInvalidateCache) {
		mPropertyBag ||= {};
		await getChangesFromFlexState(this._mComponent.name, mPropertyBag, bInvalidateCache);

		const aAllChanges = FlexState.getFlexObjectsDataSelector().get({reference: this._mComponent.name});
		if (!aAllChanges.length) {
			return [];
		}

		// TODO: remove and use UIChangesState
		let aRelevantUIChanges = oVariantIndependentUIChangesDataSelector.get({reference: this._mComponent.name});

		if (!mPropertyBag.includeCtrlVariants) {
			aRelevantUIChanges = aRelevantUIChanges.concat(
				VariantManagementState.getInitialUIChanges({reference: this._mComponent.name})
			);
		} else {
			aRelevantUIChanges = aRelevantUIChanges.concat(
				VariantManagementState.getVariantDependentFlexObjects(this._mComponent.name)
			);
		}

		if (mPropertyBag.currentLayer) {
			aRelevantUIChanges = LayerUtils.filterChangeOrChangeDefinitionsByCurrentLayer(aRelevantUIChanges, mPropertyBag.currentLayer);
		}
		return aRelevantUIChanges;
	};

	ChangePersistence.prototype._deleteNotSavedChanges = function(aChanges, aCondensedChanges, bAlreadyDeletedViaCondense) {
		aChanges.filter(function(oChange) {
			return !aCondensedChanges.some(function(oCondensedChange) {
				return oChange.getId() === oCondensedChange.getId();
			});
		}).forEach(function(oChange) {
			if (bAlreadyDeletedViaCondense) {
				this.removeChange(oChange);
				// Remove also from Cache if the persisted change is still there (e.g. navigate away and back to the app)
				FlexState.updateStorageResponse(this._mComponent.name, [{flexObject: oChange.convertToFileContent(), type: "delete"}]);
			} else {
				this.deleteChange(oChange);
			}
		}.bind(this));
	};

	function checkIfOnlyOne(aChanges, sFunctionName) {
		var aProperties = aChanges.map(function(oChange) {
			return oChange[sFunctionName]();
		});
		var aUniqueProperties = aProperties.filter(function(sValue, iIndex, aProperties) {
			return aProperties.indexOf(sValue) === iIndex;
		});

		return aUniqueProperties.length === 1;
	}

	function canGivenChangesBeCondensed(oAppComponent, aChanges, bCondenseAnyLayer) {
		var bCondenserEnabled = false;

		if (!oAppComponent || aChanges.length < 2 || !checkIfOnlyOne(aChanges, "getLayer")) {
			return false;
		}

		if (bCondenseAnyLayer) {
			bCondenserEnabled = true;
		} else {
			var sLayer = aChanges[0].getLayer();
			if ([Layer.CUSTOMER, Layer.USER].includes(sLayer)) {
				bCondenserEnabled = true;
			}
		}

		var oUriParameters = new URLSearchParams(window.location.search);
		if (oUriParameters.has("sap-ui-xx-condense-changes")) {
			bCondenserEnabled = oUriParameters.get("sap-ui-xx-condense-changes") === "true";
		}

		return bCondenserEnabled;
	}

	function isBackendCondensingEnabled(aChanges) {
		var bEnabled = Settings.getInstanceOrUndef() && Settings.getInstanceOrUndef().isCondensingEnabled();
		if (bEnabled && !checkIfOnlyOne(aChanges, "getNamespace")) {
			bEnabled = false;
		}

		return bEnabled;
	}

	function updateCacheAndDeleteUnsavedChanges(aAllChanges, aCondensedChanges, bSkipUpdateCache, bAlreadyDeletedViaCondense) {
		this._massUpdateCacheAndDirtyState(aCondensedChanges, bSkipUpdateCache);
		this._deleteNotSavedChanges(aAllChanges, aCondensedChanges, bAlreadyDeletedViaCondense);
	}

	function getAllRelevantChangesForCondensing(aDirtyChanges, aDraftFilenames, bCondenseAnyLayer, sLayer) {
		if (!aDirtyChanges.length && !bCondenseAnyLayer) {
			return [];
		}
		var aPersistedAndSameLayerChanges = UIChangesState.getAllUIChanges(this._mComponent.name).filter(function(oChange) {
			if (sLayer === Layer.CUSTOMER && aDraftFilenames) {
				return oChange.getState() === States.LifecycleState.PERSISTED && aDraftFilenames.includes(oChange.getId());
			}
			return oChange.getState() === States.LifecycleState.PERSISTED
				&& LayerUtils.compareAgainstCurrentLayer(oChange.getLayer(), sLayer) === 0;
		});
		return aPersistedAndSameLayerChanges.concat(aDirtyChanges);
	}

	function checkLayerAndSingleTransportRequest(aDirtyChanges) {
		if (aDirtyChanges.length) {
			var aRequests = getRequests(aDirtyChanges);
			var bCheckLayer = true;
			if (Settings.getInstanceOrUndef() && Settings.getInstanceOrUndef().hasPersoConnector()) {
				// Created public fl-Variant as default variant will created public and user changes
				// no single request can be used, because CF needs PersoConnector and KeyuserConntector
				var aLayers = getLayers(aDirtyChanges);
				bCheckLayer = aLayers.length === 1;
			}
			return aRequests.length === 1 && bCheckLayer;
		}
		return true;
	}

	function executeWriteAndRemoveCalls(sCurrentLayer, sRequest, sParentVersion, bSkipUpdateCache, aAllChanges, aCondensedChanges) {
		var aCondensedDeleteChanges = [];
		var pRemoveCallsPromise = Promise.resolve();
		var aNewChanges = aCondensedChanges.filter(function(oCondensedChange) {
			if (oCondensedChange.getState() === States.LifecycleState.DELETED) {
				aCondensedDeleteChanges.push(oCondensedChange);
				return false;
			}
			return true;
		});

		// "remove" only supports a single change; multiple calls are required
		if (aCondensedDeleteChanges.length) {
			pRemoveCallsPromise = this.saveSequenceOfDirtyChanges(aCondensedDeleteChanges, bSkipUpdateCache, sParentVersion);
		}

		// "write" supports multiple changes at once
		return pRemoveCallsPromise.then(function() {
			if (aNewChanges.length) {
				return Storage.write({
					layer: sCurrentLayer,
					flexObjects: prepareDirtyChanges(aNewChanges),
					transport: sRequest,
					isLegacyVariant: false,
					parentVersion: sParentVersion
				}).then(function(oResponse) {
					updateCacheAndDeleteUnsavedChanges.call(this, aAllChanges, aNewChanges, bSkipUpdateCache);
					return oResponse;
				}.bind(this));
			}
			return this._deleteNotSavedChanges(aAllChanges, aCondensedChanges);
		}.bind(this));
	}

	/**
	 * Saves the passed or all dirty changes by calling the appropriate back-end method
	 * (create for new changes, deleteChange for deleted changes);
	 * to ensure the correct order, the methods are called sequentially;
	 * after a change was saved successfully, it is removed from the dirty changes and the cache is updated.
	 * If all changes are new they are condensed before they are passed to the Storage. For this the App Component is necessary.
	 * Condensing is enabled by default for CUSTOMER and USER layers,
	 * but can be overruled with the URL Parameter 'sap-ui-xx-condense-changes'
	 *
	 * @param {sap.ui.core.UIComponent} [oAppComponent] - AppComponent instance
	 * @param {boolean} [bSkipUpdateCache] - If true, then the dirty change shall be saved for the new created app variant, but not for the current app;
	 * therefore, the cache update of the current app is skipped because the dirty change is not saved for the running app.
	 * @param {sap.ui.fl.apply._internal.flexObjects.FlexObject} [aChanges] - If passed only those changes are saved
	 * @param {string} sParentVersion - Parent version
	 * @param {string[]} [aDraftFilenames] - Filenames from persisted changes draft version
	 * @param {boolean} [bCondenseAnyLayer] - This will enable condensing regardless of the current layer
	 * @param {string} [sLayer] - Layer for which the changes should be saved
	 * @returns {Promise<object>} Resolving with the storage response after all changes have been saved
	 */
	ChangePersistence.prototype.saveDirtyChanges = function(
		oAppComponent,
		bSkipUpdateCache,
		aChanges,
		sParentVersion,
		aDraftFilenames,
		bCondenseAnyLayer,
		sLayer
	) {
		var aDirtyChanges = aChanges || FlexObjectState.getDirtyFlexObjects(this._mComponent.name);
		var sCurrentLayer = aDirtyChanges.length && aDirtyChanges[0].getLayer() || sLayer;
		var aRelevantChangesForCondensing = getAllRelevantChangesForCondensing.call(
			this,
			aDirtyChanges,
			aDraftFilenames,
			bCondenseAnyLayer,
			sCurrentLayer
		);
		var bIsCondensingEnabled = (
			isBackendCondensingEnabled(aRelevantChangesForCondensing)
			&& canGivenChangesBeCondensed(oAppComponent, aRelevantChangesForCondensing, bCondenseAnyLayer)
		);
		var aAllChanges = bIsCondensingEnabled ? aRelevantChangesForCondensing : aDirtyChanges;
		var aChangesClone = aAllChanges.slice(0);
		var aRequests = getRequests(aDirtyChanges);

		// Condensing is only allowed if all dirty changes belong to the same Transport Request
		if (checkLayerAndSingleTransportRequest(aDirtyChanges)) {
			var oCondensedChangesPromise = Promise.resolve(aChangesClone);
			if (canGivenChangesBeCondensed(oAppComponent, aChangesClone, bCondenseAnyLayer)) {
				oCondensedChangesPromise = Condenser.condense(oAppComponent, aChangesClone);
			}
			return oCondensedChangesPromise.then(function(aCondensedChanges) {
				var sRequest = aRequests[0];
				if (bIsCondensingEnabled) {
					return Storage.condense({
						allChanges: aAllChanges,
						condensedChanges: aCondensedChanges,
						layer: sCurrentLayer,
						transport: sRequest,
						isLegacyVariant: false,
						parentVersion: sParentVersion
					}).then(function(oResponse) {
						updateCacheAndDeleteUnsavedChanges.call(this, aAllChanges, aCondensedChanges, bSkipUpdateCache, true);
						return oResponse;
					}.bind(this));
				}
				// Non-condensing route
				return executeWriteAndRemoveCalls.call(
					this,
					sCurrentLayer,
					sRequest,
					sParentVersion,
					bSkipUpdateCache,
					aAllChanges,
					aCondensedChanges
				);
			}.bind(this));
		}
		return this.saveSequenceOfDirtyChanges(aDirtyChanges, bSkipUpdateCache, sParentVersion);
	};

	/**
	 * Saves a sequence of dirty changes by calling the appropriate back-end method
	 * (create for new changes, deleteChange for deleted changes);
	 * to ensure the correct order, the methods are called sequentially;
	 * after a change was saved successfully, it is removed from the dirty changes and the cache is updated.
	 *
	 * @param {sap.ui.fl.apply._internal.flexObjects.FlexObject[]} aDirtyChanges - Array of dirty changes to be saved
	 * @param {boolean} [bSkipUpdateCache] If true, then the dirty change shall be saved for the new created app variant, but not for the current app;
	 * therefore, the cache update of the current app is skipped because the dirty change is not saved for the running app.
	 * @param {string} [sParentVersion] - Indicates if changes should be written as a draft and on which version the changes should be based on
	 * @returns {Promise<object>} resolving with the collected storage response after all changes have been saved
	 */
	ChangePersistence.prototype.saveSequenceOfDirtyChanges = async function(aDirtyChanges, bSkipUpdateCache, sParentVersion) {
		var oFirstNewChange;
		if (sParentVersion) {
			// in case of changes saved for a draft only the first writing operation must have the parentVersion targeting the basis
			// followup changes must point the the existing draft created with the first request
			var aNewChanges = aDirtyChanges.filter(function(oChange) {
				return oChange.getState() === States.LifecycleState.NEW;
			});
			oFirstNewChange = [].concat(aNewChanges).shift();
		}

		// A successful save operation returns the flexObject in the response
		// The flexObjects are returned to the calling function where they will be set to persisted
		const oCollectedResponse = {
			response: []
		};

		for (const oDirtyChange of aDirtyChanges) {
			const oResponse = await performSingleSaveAction(oDirtyChange, oFirstNewChange, sParentVersion);
			this._updateCacheAndDirtyState(oDirtyChange, bSkipUpdateCache);
			if (oResponse?.response) {
				oCollectedResponse.response.push(...oResponse.response);
			}
		}
		return oCollectedResponse;
	};

	function performSingleSaveAction(oDirtyChange, oFirstChange, sParentVersion) {
		switch (oDirtyChange.getState()) {
			case States.LifecycleState.NEW:
				if (sParentVersion !== undefined) {
					sParentVersion = oDirtyChange === oFirstChange ? sParentVersion : Version.Number.Draft;
				}
				return Storage.write({
					layer: oDirtyChange.getLayer(),
					flexObjects: [oDirtyChange.convertToFileContent()],
					transport: oDirtyChange.getRequest(),
					parentVersion: sParentVersion
				});
			case States.LifecycleState.DELETED:
				return Storage.remove({
					flexObject: oDirtyChange.convertToFileContent(),
					layer: oDirtyChange.getLayer(),
					transport: oDirtyChange.getRequest(),
					parentVersion: sParentVersion
				});
			default:
				return Promise.resolve();
		}
	}

	/**
	 * Updates the cache with the dirty change passed and removes it from the array of dirty changes if present.
	 * @param {sap.ui.fl.apply._internal.flexObjects.FlexObject} oDirtyChange Dirty change which was saved
	 * @param {boolean} [bSkipUpdateCache] If true, then the dirty change shall be saved for the new created app variant, but not for the current app
	 * therefore, the cache update of the current app is skipped
	 */
	ChangePersistence.prototype._updateCacheAndDirtyState = function(oDirtyChange, bSkipUpdateCache) {
		if (!bSkipUpdateCache) {
			switch (oDirtyChange.getState()) {
				case States.LifecycleState.NEW:
					FlexState.updateStorageResponse(this._mComponent.name, [{
						type: "add",
						flexObject: oDirtyChange.convertToFileContent()
					}]);
					break;
				case States.LifecycleState.DELETED:
					FlexState.updateStorageResponse(this._mComponent.name, [{
						type: "delete",
						flexObject: oDirtyChange.convertToFileContent()
					}]);
					break;
				case States.LifecycleState.DIRTY:
					FlexState.updateStorageResponse(this._mComponent.name, [{
						type: "update",
						flexObject: oDirtyChange.convertToFileContent()
					}]);
					break;
				default:
			}
			oDirtyChange.setState(States.LifecycleState.PERSISTED);
			FlexState.getFlexObjectsDataSelector().checkUpdate({reference: this._mComponent.name});
		}
	};

	/**
	 * @param {sap.ui.fl.apply._internal.flexObjects.FlexObject[]} aDirtyChanges - Array of dirty changes
	 * @param {boolean} [bSkipUpdateCache]-  If <code>true</code>, then the dirty change shall be saved for the newly created app variant, but not for the current app;
	 * therefore, the cache update of the current app is skipped because the dirty change is not saved for the running app.
	 */
	ChangePersistence.prototype._massUpdateCacheAndDirtyState = function(aDirtyChanges, bSkipUpdateCache) {
		aDirtyChanges.forEach(function(oDirtyChange) {
			this._updateCacheAndDirtyState(oDirtyChange, bSkipUpdateCache);
		}, this);
	};

	function getRequests(aDirtyChanges) {
		var aRequests = [];

		aDirtyChanges.forEach(function(oChange) {
			var sRequest = oChange.getRequest();
			if (aRequests.indexOf(sRequest) === -1) {
				aRequests.push(sRequest);
			}
		});

		return aRequests;
	}

	function getLayers(aDirtyChanges) {
		var aLayers = [];

		aDirtyChanges.forEach(function(oChange) {
			var sLayer = oChange.getLayer();
			if (aLayers.indexOf(sLayer) === -1) {
				aLayers.push(sLayer);
			}
		});

		return aLayers;
	}

	function prepareDirtyChanges(aDirtyChanges) {
		var aChanges = [];

		aDirtyChanges.forEach(function(oChange) {
			aChanges.push(oChange.convertToFileContent());
		});

		return aChanges;
	}

	/**
	 * Prepares a change to be deleted with the next call to
	 * @see {ChangePersistence#saveDirtyChanges};
	 *
	 * If the given change is already in the dirty changes and
	 * has the 'NEW' state it will be removed, assuming,
	 * it has just been created in the current session;
	 *
	 * Otherwise it will be marked for deletion.
	 *
	 * @param {sap.ui.fl.apply._internal.flexObjects.FlexObject} oChange the change to be deleted
	 * @param {boolean} [bRunTimeCreatedChange] set if the change was created at runtime
	 * @param {boolean} [bSkipRemoveFromFlexState] set if the change should not be removed from the FlexState
	 */
	ChangePersistence.prototype.deleteChange = function(oChange, bRunTimeCreatedChange, bSkipRemoveFromFlexState) {
		const nIndexInDirtyChanges = FlexObjectState.getDirtyFlexObjects(this._mComponent.name).indexOf(oChange);

		if (nIndexInDirtyChanges > -1) {
			if (oChange.getState() === States.LifecycleState.DELETED) {
				return;
			}
			if (!bSkipRemoveFromFlexState) {
				FlexState.removeDirtyFlexObject(this._mComponent.name, oChange);
			}
			this._deleteChangeInMap(oChange, bRunTimeCreatedChange);
			return;
		}

		oChange.markForDeletion();
		FlexObjectManager.addDirtyFlexObjects(this._mComponent.name, [oChange]);
		this._deleteChangeInMap(oChange, bRunTimeCreatedChange);
	};

	/**
	 * Prepares multiple changes to be deleted with the next call to
	 * @see {ChangePersistence#saveDirtyChanges};
	 *
	 * Removal from the FlexState happens in one go to trigger only one invalidation.
	 *
	 * @param {sap.ui.fl.apply._internal.flexObjects.FlexObject[]} aChanges the changes to be deleted
	 * @param {boolean} [bRunTimeCreatedChanges] set if the change was created at runtime
	 */
	ChangePersistence.prototype.deleteChanges = function(aChanges, bRunTimeCreatedChanges) {
		aChanges.forEach(function(oChange) {
			this.deleteChange(oChange, bRunTimeCreatedChanges, true);
		}.bind(this));
		FlexState.removeDirtyFlexObjects(this._mComponent.name, aChanges);
	};

	ChangePersistence.prototype.removeChange = function(oChange) {
		FlexState.removeDirtyFlexObject(this._mComponent.name, oChange);
		this._deleteChangeInMap(oChange);
	};

	/**
	 * Deletes a change object from the dependency map.
	 *
	 * @param {sap.ui.fl.apply._internal.flexObjects.FlexObject} oChange change which has to be removed from the mapping
	 * @param {boolean} [bRunTimeCreatedChange] set if the change was created at runtime
	 * @private
	 */
	ChangePersistence.prototype._deleteChangeInMap = function(oChange, bRunTimeCreatedChange) {
		var sChangeKey = oChange.getId();
		DependencyHandler.removeChangeFromMap(FlexObjectState.getLiveDependencyMap(this._mComponent.name), sChangeKey);
		if (!bRunTimeCreatedChange) {
			DependencyHandler.removeChangeFromDependencies(FlexObjectState.getLiveDependencyMap(this._mComponent.name), sChangeKey);
		}
	};

	function isLocalAndInLayer(sLayer, oObject) {
		return (oObject.getRequest() === "$TMP" || oObject.getRequest() === "") && oObject.getLayer() === sLayer;
	}

	function getAllCompVariantsEntities() {
		var aCompVariantEntities = [];
		var mCompVariantsMap = FlexState.getCompVariantsMap(this._mComponent.name);
		for (var sPersistencyKey in mCompVariantsMap) {
			for (var sId in mCompVariantsMap[sPersistencyKey].byId) {
				aCompVariantEntities.push(mCompVariantsMap[sPersistencyKey].byId[sId]);
			}
		}
		return aCompVariantEntities;
	}
	/**
	 * Transports all the UI changes and app variant descriptor (if exists) to the target system
	 *
	 * @param {object} oRootControl - the root control of the running application
	 * @param {string} sStyleClass - RTA style class name
	 * @param {string} sLayer - Working layer
	 * @param {array} [aAppVariantDescriptors] - an array of app variant descriptors which needs to be transported
	 * @returns {Promise} promise that resolves when all the artifacts are successfully transported
	 */
	ChangePersistence.prototype.transportAllUIChanges = function(oRootControl, sStyleClass, sLayer, aAppVariantDescriptors) {
		return this.getChangesForComponent({currentLayer: sLayer, includeCtrlVariants: true}).then(function(aLocalChanges) {
			var aCompVariantEntities = getAllCompVariantsEntities.call(this);

			aLocalChanges = aLocalChanges.concat(
				aCompVariantEntities.filter(isLocalAndInLayer.bind(this, sLayer)));

			return Storage.publish({
				transportDialogSettings: {
					styleClass: sStyleClass
				},
				layer: sLayer,
				reference: this._mComponent.name,
				localChanges: aLocalChanges,
				appVariantDescriptors: aAppVariantDescriptors
			});
		}.bind(this));
	};

	return ChangePersistence;
});