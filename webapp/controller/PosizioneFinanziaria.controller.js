sap.ui.define([
	'zsap/com/r3/cobi/s4/esamodModEntrPosFin/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	"zsap/com/r3/cobi/s4/custadattafiltri/spese/adattafiltrispese/controls/InputAdattaFiltriSpese",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/formatter",
], function(BaseController, JSONModel, Bar, Filter, FilterOperator, MessageBox, formatter) {
	"use strict";

	return BaseController.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.controller.PosizioneFinanziaria", {
		Bar: Bar,
		formatter: formatter,

		onInit: function() {
			this.oRouter = this.getRouter();
			this.oRouter.getRoute("PosizioneFinanziaria").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(
				new JSONModel({
					visibleColonna: false,
					listaEstesa: true,
					listaRidotta: false,
				}),
				'checkModel'
			);
			this.getView().setModel(new JSONModel({}), "modelAdattaFiltri");
			this.bRendering = false;

		},

		_onRouteMatched: async function() {
			this._resetCheckbox("ZSS4_COBI_PREN_ESAMOD_SRV", this);
			await this._gestTipologiche();
			//this.getView().byId("TextAnno").setText(sap.ui.getCore().getModel("gestTipologicheModel").getData().ANNO);
			this.createModeButtonTable();
			var sModel = this.getView().getModel("modelAdattaFiltri");
			var aDataFilter = sModel.getData();
			aDataFilter.CodiceAmmin = "A020";
			sap.ui.getCore().Amm = aDataFilter.CodiceAmmin;
			sModel.refresh();

		},

		onHelp: function(oEvent, inputRef) {
			this.MatchCode.onValueHelpRequest(oEvent, inputRef, this);
		},

		onSearch: async function(isAvvioButton, pointer) {

			//this._openBusyDialog();

			var aDataFilter = this.getView().getModel("modelAdattaFiltri").getData();
			var aFilters = new Filter({
				filters: [],
				and: true
			});
			if (isAvvioButton) {
				this.filterMaxRows = "200";
			}
			var oFilterRows = new sap.ui.model.Filter("Maxrows", sap.ui.model.FilterOperator.BT, "200", (parseInt(this.filterMaxRows) - 200).toString());
			aFilters = this._getAllFilter(aFilters);
			// aFilters.aFilters.push(oFilterRows);
			var sFipex = this.getView().byId("filterBarPosFin").getValue();
			if (sFipex.length > 0) {
				aFilters.aFilters.push(new Filter('Fipex', sap.ui.model.FilterOperator.EQ, sFipex));
			}
			await this._getDataTreeTable(aFilters);

			var previewModel = this.getView().getModel("modelIsAfterAvvio").oData;

			if (isAvvioButton) {
				previewModel.enabledButtonPrev = false;
				previewModel.enabledButtonNext = true;
				previewModel.intialValue = -199;
				previewModel.beginValueM1 = 0;
				previewModel.beginValueP1 = 201;
				previewModel.finalValue = 400;
			} else {
				previewModel.intialValue = previewModel.intialValue + pointer;
				previewModel.beginValueM1 = previewModel.beginValueM1 + pointer;
				previewModel.beginValueP1 = previewModel.beginValueP1 + pointer;
				previewModel.finalValue = previewModel.finalValue + pointer;
				if (previewModel.intialValue === -199) {
					previewModel.enabledButtonPrev = false;
					previewModel.enabledButtonNext = true;
				} else {
					previewModel.enabledButtonPrev = true;
					previewModel.enabledButtonNext = true;
				}
			}
			this.getView().getModel("modelIsAfterAvvio").refresh();
			//this._closeDialog();
		},

		_getAllFilter: function(aFilter) {
			var aDataFilter = this.getView().getModel("modelAdattaFiltri").getData();
			var aElement = Object.keys(aDataFilter);
			for (let i = 0; i < aElement.length; i++) {
				if (aDataFilter[aElement[i]] !== "" || aDataFilter[aElement[i]].length !== 0) {
					aFilter.aFilters.push(new Filter(aElement[i], FilterOperator.EQ, aDataFilter[aElement[i]]))
				}
			}

			return aFilter;
		},

		_getDataTreeTable: async function(aFilters) {
			var oTable = this.getView().byId("treeTablePF");
			var oDataPosFin = this.getOwnerComponent().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").getData();
			// this.getView().getModel('ExportposFin').setData(oDataPosFin);
			var oTableBinding = oTable.getBinding();
			await oTable.bindRows({
				path: "ZSS4_COBI_PREN_ESAMOD_SRV>/ZET_AVVIOPFSet",
				parameters: {
					useServersideApplicationFilters: true,
					operationMode: 'Client',
					collapseRecursive: false,
					countMode: 'Inline',
					treeAnnotationProperties: {
						hierarchyLevelFor: 'HierarchyLevel',
						hierarchyNodeFor: 'Node',
						hierarchyParentNodeFor: 'ParentNodeId',
						hierarchyDrillStateFor: 'DrillState'
					}
				},
				filters: [aFilters],
			});

			// 		var aResult = await this._readFromDb(
			// 	'0',
			// 	"/ZET_AVVIOPFSet", aFilters.aFilters
			// );
			// this.getView().setModel(
			// 	new JSONModel(aResult),
			// 	'modelTable'
			// );

		},

		onPressPrevTreeTable: function(oEvent) {
			var filterMaxRows = this.filterMaxRows;
			if (filterMaxRows > 200) {
				this.filterMaxRows = parseInt(filterMaxRows) - 200
				this.onSearch(false, -200);
			}

		},
		onPressNextTreeTable: function(oEvent) {
			var filterMaxRows = this.filterMaxRows;

			this.filterMaxRows = parseInt(filterMaxRows) + 200;

			this.onSearch(false, 200);
		},

		createModeButtonTable: function() {
			var oModel = new JSONModel({
				enabledButtonPrev: false,
				enabledButtonNext: false,
				intialValue: -199,
				beginValueM1: 0,
				beginValueP1: 201,
				finalValue: 400
			});
			this.getView().setModel(oModel, "modelIsAfterAvvio");
		},

		onPressGestisciPosizione: function() {

			this._rowSel();
			var oModelSelPosFin = this.getOwnerComponent().getModel("modelPosFinSelected");
			var aPosFinSel = oModelSelPosFin.getData();

			if (aPosFinSel) {
				if (aPosFinSel.length > 1) {
					this._resetCheckbox("ZSS4_COBI_PREN_ESAMOD_SRV", this);
				}
				this.oRouter.navTo("GestisciPosizioneFinanziaria");
			} else {
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoGestisciPagePosFinA"));
			}
		},

		onSelect: function(oEvent) {

			var aRows = this.getView().byId("treeTablePF").getRows();
			var oEl = oEvent.getSource().getBindingContext("ZSS4_COBI_PREN_ESAMOD_SRV").sPath;
			var oObjectUpdate = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData[oEl.slice(1)];
			if (oObjectUpdate.SELECTED && oObjectUpdate.SELECTED === true) {

				oObjectUpdate.SELECTED = false;
				var aSelect = this._getNoSelectedItems();
				for (var j = 0; j < aSelect.length; j++) {
					for (var i = 0; i < aRows.length; i++) {
						if (aRows[i]._oNodeState) {
							var sTempNode = aRows[i]._oNodeState.groupID.replaceAll("/", "");
							if (sTempNode === aSelect[j].Node) {
								aRows[i].removeStyleClass("custmSelectedRows");
							}
						}
					}

				}
			} else {

				oObjectUpdate.SELECTED = true;
				var aSelect = this._getSelectedItems();

				for (var j = 0; j < aSelect.length; j++) {
					for (var i = 0; i < aRows.length; i++) {
						if (aRows[i]._oNodeState) {
							var sTempNode = aRows[i]._oNodeState.groupID.replaceAll("/", "");
							if (sTempNode === aSelect[j].Node) {
								aRows[i].addStyleClass("custmSelectedRows");
							}
						}
					}

				}

			}

		},

		_rowSel: function(event) {
			var aSelected = this._getSelectedItems();
			var PosFin = [];
			if (aSelected.length > 0) {
				// mi prendo la proprietà che mi interessa

				//ricerca per IDposfin
				for (var i = 0; i < aSelected.length; i++) {
					var sFipex = aSelected[i].Fipex;
					var sAut = aSelected[i].Autorizzazioni;
					this.sAnno = aSelected[i].AnnoFipex;
					this.sFikrs = aSelected[i].Fikrs;
					this.sFase = aSelected[i].Fase;
					this.sReale = aSelected[i].Reale;
					this.sVersione = aSelected[i].Versione;
					this.sDatbis = aSelected[i].Datbis;
					this.sFipex = aSelected[i].Fipex;
					// var sPosFinExtendedDescr = this.getView().getModel().getProperty(aSelectedPath[i]).Posfins4;
					// inizio modifica G.Modugno
					var oBj = {
						PosFin: sFipex,
						Aut: sAut,
						Datbis: this.sDatbis
					};

					PosFin.push(oBj);
					//    PosFin.push(sIdPosFin4); --> modificata da G.Modugno per aggiungere la descrizione estesa della posfin
					// fine modifica G.Modugno

				}

			}

			this.getOwnerComponent().setModel(new JSONModel(PosFin), "modelPosFinSelected");
		},

		_getSelectedItems: function() {
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
		listaEstesa: function() {

			this.getView().getModel('checkModel').setProperty('/visibleColonna', true);
			this.getView().getModel('checkModel').setProperty('/listaRidotta', true);
			this.getView().getModel('checkModel').setProperty('/listaEstesa', false);

		},

		listaRidotta: function() {

			this.getView().getModel('checkModel').setProperty('/visibleColonna', false);
			this.getView().getModel('checkModel').setProperty('/listaRidotta', false);
			this.getView().getModel('checkModel').setProperty('/listaEstesa', true);

		},

		onPressNavToDettaglioContabile: function() {
			var oBtn = this.getView().byId("idBtnDettaglioContabile");
			var sID = oBtn.getText();
			//LOGICA PER CONTROLLO: SELEZIONE DI UNA POSFIN / DA MODIFICARE

			this._rowSel();
			var aModelSelPosFin = this.getView().getModel("modelPosFinSelected").getData();

			if (aModelSelPosFin === undefined) {
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoDettaglioContabile"));
			} else {
				if (aModelSelPosFin.length === 1) {
					var arrSelected = this._getSelectedItems();
					this.getOwnerComponent().setModel(new JSONModel(arrSelected), "modelDettaglioContabile");

					this.oRouter.navTo("DettaglioContabile", {
						ID: sID,
					});
				} else {
					MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoDettaglioContabile"));
				}
			}
		},
		onPressNavToDettaglioAnagrafica: function() {
			var oBtn = this.getView().byId("idBtnDettaglioContabile");
			var sID = oBtn.getText();
			//LOGICA PER CONTROLLO: SELEZIONE DI UNA POSFIN / DA MODIFICARE

			this._rowSel();
			var aModelSelPosFin = this.getView().getModel("modelPosFinSelected").getData();

			if (aModelSelPosFin === undefined) {
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoDettaglioContabile"));
			} else {
				if (aModelSelPosFin.length === 1) {
					var arrSelected = this._getSelectedItems();
					this.getOwnerComponent().setModel(new JSONModel(arrSelected), "modelSelected");

					this.oRouter.navTo("DettaglioAnagraficoID", {
						ID: sID,
					});
				} else {
					MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoDettaglioContabile"));
				}
			}
		},
		onNavNuovaPosFin: function() {
			this.oRouter.navTo("NuovaPosFin");
		},
	});

});