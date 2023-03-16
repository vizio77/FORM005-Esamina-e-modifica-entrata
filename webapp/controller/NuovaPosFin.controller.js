sap.ui.define([
	'zsap/com/r3/cobi/s4/esamodModEntrPosFin/controller/BaseController',
	"sap/ui/core/syncStyleClass",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/MatchCode",

], function(BaseController, syncStyleClass, Fragment, MessageBox, MatchCode, ResourceModel) {
	"use strict";

	return BaseController.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.controller.NuovaPosFin", {
		MatchCode: MatchCode,
		onInit: function() {

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		onHelp: function(oEvent, inputRef) {
			this.MatchCode.onValueHelpRequest(oEvent, inputRef, this);
		},

		onChangeMC: function(oEvent, inputRef) {
			this.MatchCode.onChange(oEvent, inputRef, this);
		},
		onPressOpenMenu: function(oEvent, sIdF) {

			// if (this.getView().byId("idCapitoloNPF").getValue()) {
			// 	//alert("Cambiare N. Capitolo? Se si il numero attualmente bloccato viene sbloccato.");
			// 	//MESSAGGIO DI AVVISO SBLOCCO DEL CAPITOLO
			// 	/*sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("SbloccoNumCap"), {
			// 		duration: 4000,
			// 		width: "35em",
			// 		my: "center center",
			// 		at: "center center",
			// 		autoClose: false
			// 	});*/
			// 	//INSERIRE CODICE PER GESTIRE LO SBLOCCO DEL CAPITOLO
			// }
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var that = this;
			// create menu only once
			if (!this._menuCap) {
				this._menuCap = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.MenuCapitoloNPF",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
					return oDialog;
				});
			}
			// ACTIONS REPEATED EVERY TIME
			this._menuCap.then(function(oDialog) {

				var eDock = sap.ui.core.Popup.Dock;
				oDialog.open(that._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);

				var oItemMenuItemScegliCapitolo = oDialog.getAggregation("items")[0];
				var text = that.recuperaTestoI18n(sIdF);
				oDialog.getAggregation("items")[0].setText(text);

				oItemMenuItemScegliCapitolo.setVisible(true);

				oDialog.open(oButton);
			});
		},
		handleMenuItemPressCapitolo: function(oEvent) {
			var sText = oEvent.getSource().getProperty("text");
			if (sText.includes("Articolo")) {
				sText = "Articolo";
			
			}
			else if (sText.includes("Capitolo")) {
				sText = "Capitolo";
			}
			 else if (sText.includes("proposta")) {
				sText = "Proposta";
			}
			this._oDialogCapitolo = sap.ui.xmlfragment(
				"zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.PopUpScegliCapitoloNPF",
				this);
			this._oDialogCapitolo.setTitle("Scegli" + " " + sText);
			sap.ui.getCore().byId("idCapitoloNPFPoP").setPlaceholder("Scegli" + " " + sText);
			this._oDialogCapitolo.open();

		},
		onPressCloseScegliCapitoloNPF: function() {
			this._oDialogCapitolo.close();
			this._oDialogCapitolo.destroy();
		}
	});
});