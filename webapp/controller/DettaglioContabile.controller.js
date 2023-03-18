sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	'zsap/com/r3/cobi/s4/esamodModEntrPosFin/controller/BaseController',
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/formatter",
], function(Controller, MessageBox, BaseController, formatter) {
	"use strict";

	return BaseController.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.controller.DettaglioContabile", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zsap.com.r3.cobi.s4.Z_ESA_MODZ_ESA_MOD.view.DettaglioContabile
		 */
		onInit: function() {
			this.oRouter = this.getRouter();
			this.oResourceBundle = this.getResourceBundle();
			// this.oRouter.getRoute("DettaglioContabile").attachPatternMatched(this._onObjectMatched, this);

			this.oRouter.getRoute("DettaglioContabile").attachMatched(this._onRouteMatched, this);

		},

		onNavBack: function() {
			//this.getView().byId("idLinkPosFinSnap").setText('');
			//this.getView().byId("idLinkPosFin").setText('');
			var oFrame = this.getView().byId("linkSac");
			var oFrameContent = oFrame.$()[0];
			oFrameContent.setAttribute("src", "");

			
				this.oRouter.navTo("PosizioneFinanziaria");
			
		},

		onPressInformationsLocal: function(event) {
		 
				this.onPressInformations(event, 'dettContPosFin');
		 
		},

		_onRouteMatched: function(e) {

			this._dettaglioContPosFin();

		},

	 

		_dettaglioContPosFin: async function() {
			var oRow = this.getOwnerComponent().getModel("modelDettaglioContabile").getData()[0];

			var oselectedPosFinSel = this.getView().getModel("modelPosFinSelected").getData();
			//CREAZIONE STRUTTURA AMMINISTRATIVA
			var sNewAmm = oRow.CodiceAmmin.slice(1)
			var sStrutAmm = "E" + sNewAmm + oRow.CodiceCdr + oRow.CodiceRagioneria + "000"

			//LOGICA APERTURA SCHEDA SAC

			this.sNewUrl = "";
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oGlobalModel = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV");
			//lt recupero i dati direttamente dalla riga
			var sPosfin = oRow.Fipex;
			var sAut = oRow.Autorizzazioni;

			var sEsamina_ModE = "ESAMINA_MOD";
			var sSchermata = "E_DETT_POSFIN";
			var sReon = "SI";

			this.getView().setBusy(true);
			var aResult = await this._readFromDb("2", "/SacUrlSet(SemanticObject='" + sEsamina_ModE + "',Schermata='" + sSchermata + "')", []);
			this.getView().setBusy(false);
			sPosfin = sPosfin.replaceAll(".", "");
			var sUrl = aResult.URL;
			var oFrame = this.getView().byId("linkSac");
			var oFrameContent = oFrame.$()[0];
			this.sNewUrl = sUrl + "&p_PosizioneURL=" + sPosfin + "&p_StruttAmmURL=" + sStrutAmm;
			oFrameContent.setAttribute("src", this.sNewUrl);

			//this.setLinkSac(sNewUrl, "linkSac");
			this._refresh(sNewUrl);

		},

		_refresh: function() {
			var urlSac = this.sNewUrl;
			window.frames[0].location = urlSac + (new Date());
		},

	
	

	

	});

});