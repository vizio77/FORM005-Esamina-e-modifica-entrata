sap.ui.define([
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/syncStyleClass",
	"sap/m/MessageBox",
	"../util/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function(BaseController, Fragment, Filter, FilterOperator, syncStyleClass, MessageBox, formatter, History, JSONModel ,BusyIndicator) {
	"use strict";

	return BaseController.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.controller.AssociaProposta", {

		onInit: function() {
			this.oRouter = this.getRouter();
			this.oResourceBundle = this.getResourceBundle();
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.oRouter.getRoute("AssociaProposta").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			this._resetCheckbox("ZSS4_COBI_PREN_ESAMOD_SRV", this);
			this.sRouterParameter = oEvent.getParameters().name;

			this._getAvvioAssociaProposta();
			this._onLoadTreeTable("treeTableID", "ZSS4_COBI_PREN_ESAMOD_SRV>/ZET_AVVIOIDSet");
		},

		_onLoadTreeTable: function(sIdTreeTable, sTreeTableBindingPath) {

			var oTreeTable = this.getView().byId(sIdTreeTable);
			var aFilters = [];
			
			var codAmministrazione = this.amministrazione
			if(!codAmministrazione)codAmministrazione = "A020"
			//lt recupero solo quelle in lavorazione
			aFilters.push( new Filter("Iter", FilterOperator.EQ, "01"))
			aFilters.push( new Filter("CodiceAmmin", FilterOperator.EQ, codAmministrazione))
			// console.log(aFilters);
			this._remove(aFilters, undefined);

			BusyIndicator.show(0);

			oTreeTable.bindRows({
				path: sTreeTableBindingPath,
				parameters: {
					countMode: "Inline",
					collapseRecursive: false,
					operationMode: "Client", // necessario per ricostruire la gerarchia lato client
					// se le annotazioni sono gestite su FE tramite treeAnnotationProperties
					treeAnnotationProperties: {
						hierarchyLevelFor: "HierarchyLevel",
						hierarchyNodeFor: "Node",
						hierarchyParentNodeFor: "ParentNodeId",
						hierarchyDrillStateFor: "DrillState"
					},
					useServersideApplicationFilters: true // necessario in combinazione con operationMode : 'Client' per inviare i filtri al BE ($filter)
				},
				filters: [aFilters],
				events:{
					//dataReceived : this.onDataReceivedAssociazione.bind(this)
					dataReceived: function(oParameters) {
						BusyIndicator.hide();
					}.bind(this)
				}
			});

			//Azzera la selezione delle righe
			//var oItems = oTreeTable.getRows();
			oTreeTable.clearSelection()
		},

		_getAvvioAssociaProposta: function() {
			var oTable = this.getView().byId("tableAssociaProposta");

			//filtri per IDposfin
			var oIdPosFinSel = this.getView().getModel("modelPosFinSelected").getData().IdPosfin;

			if(oIdPosFinSel && oIdPosFinSel.length > 0){
				this.amministrazione = oIdPosFinSel[0].CodiceAmmin

			}else{
				this.amministrazione = "A020";
			}
			//var aPosFinSel = oIdPosFinSel.IdPosfin;
			//var aPosFinSel = oIdPosFinSel.IdPosfin;
			var oModel = new JSONModel(oIdPosFinSel);
			this.getView().setModel(oModel, "modelPosFinToAssociate");
			//var viewModel=this.getView().getModel("modelPosFinToAssociate");
			var tableModel = new sap.ui.model.json.JSONModel();
			tableModel.setData(oIdPosFinSel);
			this.getView().setModel(tableModel);
			oTable.bindRows("/");

		},

		onBack: function() {
			this.oRouter.navTo("GestisciPosizioneFinanziaria");
			//this._resetCheckbox("ZSS4_COBI_PREN_ESAMOD_SRV", "treeTablePFID");
			// window.history.go(-1);
		},

		onPressAssocia: function() {

			var oModelPageAut = this.getView().getModel("modelPageAut");
			this._refreshModel(oModelPageAut);
			//this._rowSelProps();
			// var sPage = this.getView().getModel("i18n").getResourceBundle().getText("subtitlePosFinIdProposta");
			var righeSelezionate = this._getSelPositions();

			if(righeSelezionate.length === 0){
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoCompetenzaPageIDProposta"));
				return;
			}
			if(righeSelezionate.length > 1){
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoCompetenzaPageIDPropostaMax"));
				return;
			}

			this._associaProps(righeSelezionate[0]);

			/* var aRows = oModelPageAut.getData();
			if (aRows.length === 0) {
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoCompetenzaPageIDProposta"));
			} else {
				var sIdProposta = oModelPageAut.getData()[0].IdProposta;
				var sCodIter = oModelPageAut.getData()[0].CodiceIter;
				if (aRows.length === 1 && sIdProposta !== "" && sIdProposta !== undefined && sIdProposta !== "0000000000" && sCodIter === "01") {
					this._resetCheckbox("ZSS4_COBI_PREN_ESAMOD_SRV", this);
					this._associaProps(aRows);
				} else {
					MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoAutPagePosFinId"));
				}
			} */
		},
		_associaProps:function(prop){
			var positions = this.getView().getModel("modelPosFinSelected").getData().IdPosfin;
			this._recursiveUpdateModel(positions,prop);
		},

		associaProposte: async function(arrayPosizioni,prop){
			var errori = false;
			var stringa = "";
			for (let i = 0; i < arrayPosizioni.length; i++) {
				var testoRisposta;
				const posFin = arrayPosizioni[i];
				var response = await this.updateModel(posFin,prop)
				if(response === 'OK'){
					testoRisposta = `Posizione ${posFin.Fipex} Associata con successo`;
				}else{
					if(JSON.parse(response.responseText).error.code === 'SY/530'){
						testoRisposta = `Errore: ${JSON.parse(err.responseText).error.message.value}`;
					}else{
						testoRisposta = `Errore`;
					}
					errori = true;
				}
				stringa = stringa + testoRisposta + "\n"
			}

			if(!errori){
				MessageBox.success(this.getView().getModel("i18n").getResourceBundle().getText("MBCreateSuccessAssociaProposta"));
			}else{
				MessageBox.warning(stringa);
			}
		},

		_getSelPositions: function() {
			var table = this.getView().byId("treeTableID");
			var listIndSelected = table.getSelectedIndices();

			var rows = table.getRows();
			var listPos = [];

			for (var i = 0; i < listIndSelected.length; i++) {
				var index = listIndSelected[i];
				var item = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData[table.getContextByIndex(index).sPath.split("/")[1]];

				//verifico se l'oggetto selezionato è di tipo Proposta
				if (item.HierarchyLevel == '0') {
					listPos.push(item);
				}
			}

			return listPos;
		},
		
		_recursiveUpdateModel: async function(positions,prop){
			this.associaProposte(positions,prop);
		},

		updateModel: function(position, prop) {
			var sIdProposta = prop.IdProposta;
			var sKeycodepr = prop.Key_Code;
			var oModel = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV");
			var sFipex = position.Fipex;
			var oEntry = {
				Fipex: sFipex,
				Idproposta: sIdProposta
			};

			var sPath = "/PropostaSet(Keycodepr='" + sKeycodepr + "')";

			return new Promise(function (resolve, reject) {
				oModel.update(sPath, oEntry, {
					success: function (oData) {
						var response = oData
						resolve('OK')
					},
					error: function (err) {
						resolve(err)
					},
				})
			})

		},

		_setUseBatch: function(bUseBatch) {
			var oModel = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV");
			oModel.setUseBatch(bUseBatch);
		},

		_rowSelProps: function(event) {
			var that = this;

			var aSelected = this._getSelectedItemsProps();

			if (aSelected.length > 0) {
				// mi prendo la proprietà che mi interessa
				var aRows = [];

				for (var i = 0; i < aSelected.length; i++) {
					// var sPosFin = this.getView().getModel().getProperty(aSelectedPath[i]).Posfin;
					var sIdPosFin = aSelected[i].Fipex;
					var sIdProposta = aSelected[i].IdProposta;
					// var sCodiFincode = this.getView().getModel().getProperty(aSelectedPath[i]).Fincode;
					var sIter = aSelected[i].Iter;
					var sCodIter = aSelected[i].CodIter;
					var sTipo = aSelected[i].TipologiaProposta;
					var sEsitoControllo = aSelected[i].EsitoControlli;
					var sNickname = aSelected[i].Nickname;
					var sAut = aSelected[i].Autorizzazioni;

					var sFikrs = aSelected[i].Fikrs;
					var sAnnoFipex = aSelected[i].AnnoFipex;
					var sFase = aSelected[i].Fase;
					var sReale = aSelected[i].Reale;
					var sVersione = aSelected[i].Versione;
					var sEos = aSelected[i].Eos;
					var sCodiceAmmin = aSelected[i].CodiceAmmin;
					var sKeycodepr = aSelected[i].KeyCode;
					var sDatbis = aSelected[i].Datbis;
					var sFipex = aSelected[i].Fipex;

					var oData = {
						"IdPosfin": sIdPosFin,
						"IdProposta": sIdProposta,
						// "CodiFincode": sCodiFincode,
						// "Posfin": sPosFin,
						"CodiceIter": sCodIter,
						"Iter": sIter,
						"Tipo": sTipo,
						"EsitoControlli": sEsitoControllo,
						"Nickname": sNickname,
						"Aut": sAut,
						"Fikrs": sFikrs,
						"AnnoFipex": sAnnoFipex,
						"Fase": sFase,
						"Reale": sReale,
						"Versione": sVersione,
						"Eos": sEos,
						"CodiceAmmin": sCodiceAmmin,
						"Keycodepr": sKeycodepr,
						"Datbis": sDatbis,
						"Fipex": sFipex
					};
					aRows.push(oData);
					that.getView().getModel("modelPageAut").setData(aRows);
					that.getView().getModel("modelPageAut").setProperty("/IdPosfin", sIdPosFin);
					/*that.getView().getModel("modelPageAut").setProperty("/Posfin", sPosFin);
					that.getView().getModel("modelPageAut").setProperty("/IdPosfin", sIdPosFin);
					that.getView().getModel("modelPageAut").setProperty("/IdProposta", sIdProposta);
					that.getView().getModel("modelPageAut").setProperty("/Iter", sIter);
					that.getView().getModel("modelPageAut").setProperty("/Tipo", sTipo);*/
				}
			}
		},

		_getSelectedItemsProps: function() {

			var aObject = Object.keys(this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData);
			var aData = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData;
			var aSelected = [],
				aValResult = [];
			for (var i = 0; i < aObject.length; i++) {
				if (aData[aObject[i]].SELECTED === true) {
					aSelected.push(aData[aObject[i]]);
				}
			}
			return aSelected;
		},

		onSelectCheckBox: function(oEvent) {
			this._resetCheckbox("ZSS4_COBI_PREN_ESAMOD_SRV", this);
			var oEl = oEvent.getSource().getBindingContext("ZSS4_COBI_PREN_ESAMOD_SRV").sPath;
			var oObjectUpdate = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData[oEl.slice(1)];
			if (oObjectUpdate.SELECTED && oObjectUpdate.SELECTED === true) {
				oObjectUpdate.SELECTED = false;
			} else {
				oObjectUpdate.SELECTED = true;
			}
		},

		handlePressOpenMenu: function(oEvent) {
			if (this.getView().byId("inputProposta").getValue()) {
				//alert("Cambiare Proposta? Se si la proposta attualmente bloccato viene sbloccata.");
			}
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var that = this;
			// create menu only once
			if (!this._menu) {
				this._menu = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.AssProp_Menu",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			// ACTIONS REPEATED EVERY TIME
			this._menu.then(function(oDialog) {
				var eDock = sap.ui.core.Popup.Dock;
				oDialog.open(that._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);

				var sTitle = that.getView().byId("idPanelForm").getHeaderText();
				var oItemMenuIdEsistente = oDialog.getAggregation("items")[0];
				var oItemMenuIdNuovo = oDialog.getAggregation("items")[1];
				if (sTitle.toUpperCase() === "CREA PROPOSTA") {
					oItemMenuIdEsistente.setVisible(false);
					oItemMenuIdNuovo.setVisible(true);
				}
				if (sTitle.toUpperCase() === "ASSOCIA PROPOSTA") {
					oItemMenuIdEsistente.setVisible(true);
					oItemMenuIdNuovo.setVisible(true);
				}
				if (sTitle.toUpperCase() === "GESTISCI PROPOSTA") {
					oItemMenuIdEsistente.setVisible(true);
					oItemMenuIdNuovo.setVisible(false);
				}
				oDialog.open(oButton);
			});
		},
		handleMenuItemPress: function(oEvent) {
			var optionPressed = oEvent.getParameter("item").getText();
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var that = this;
			//CREA IL DIALOG UNA SOLA VOLTA
			if (!this._optionIdProposta) {
				this._optionIdProposta = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.AssProp_Proposta",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._optionIdProposta.then(function(oDialog) {

				if (optionPressed.toUpperCase() === "SCEGLI PROPOSTA ESISTENTE") {
					that.getView().byId("IdProposta").setValue("");
					that.getView().byId("IdProposta").setShowValueHelp(true);
					that.getView().byId("IdProposta").setEnabled(true);
				}
				if (optionPressed.toUpperCase() === "INSERISCI PROPOSTA MANUALMENTE") {
					that.getView().byId("IdProposta").setEnabled(true);
					that.getView().byId("IdProposta").setValue("");
					that.getView().byId("IdProposta").setShowValueHelp(false);
				}
				if (optionPressed.toUpperCase() === "GENERA PROPOSTA AUTOMATICAMENTE") {
					that.getView().byId("IdProposta").setValue(300); // generato automaticamente dal backend
					that.getView().byId("IdProposta").setEditable(false);
					that.getView().byId("IdProposta").setShowValueHelp(false);
				}
				oDialog.open(oButton);
			});
		},

		onCloseDIalogProposta: function() {
			this.getView().byId("idFragment_Proposta").close();
			this.getView().byId("IdProposta").setValue('');
		},

		onPressNavToCreaID: function(oEvt) {
			var oBtn = this.getView().byId("idBtnCreaProposta");
			var sID = oBtn.getId().split("--")[2].split("idBtn")[1];
			this.oRouter.navTo("GestisciID", {
				ID: sID
			});

			/*this.oRouter.navTo("MessagePage", {
				viewName: "CreaId"
			});*/
		},

		onPressNavToNuovaPosizione: function() {
			this.oRouter.navTo("NuovaPosizioneFinanziaria");
			/*this.oRouter.navTo("MessagePage", {
				viewName: "NuovaPosizioneFinanziaria"
			});*/
		},

		onPressNavToHomeLoc: function() {
			// var oTreeTablePF = this.getView().byId("treeTablePF");
			// oTreeTablePF.unbindRows();
			this.getRouter().navTo("Home");
		},

		onPressBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("PosizioneFinanziaria", {}, true);
			}
		}
	});
});