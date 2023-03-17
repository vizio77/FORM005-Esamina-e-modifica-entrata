sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.getFaseMacrofaseModel(), "modelFaseAttuale");
			this.setModel(models.getModelPFCapEsistente(), "modelPFCapEsistente");
			this.setModel(models.getHeaderModelNuovaPosFin(), "modelNuovaPosFin");
			this.setModel(models.getModelChangeControlsStatus(), "modelChangeControlsStatus");
			this.setModel(models.getGestTipologicheModel(),"gestTipologicheModel");
		},
		getContentDensityClass: function() {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});
});