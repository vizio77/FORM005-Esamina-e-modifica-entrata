sap.ui.define([
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/controller/BaseController",
	'sap/ui/model/json/JSONModel',
	'sap/ui/export/Spreadsheet',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/formatter",
	"sap/ui/core/BusyIndicator"
], function(BaseController, JSONModel, Spreadsheet, Filter, FilterOperator, MessageBox, formatter, BusyIndicator) {
	"use strict";

	return BaseController.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.controller.GestisciPosizioneFinanziaria", {
		formatter: formatter,

		onInit: function() {
			this.oRouter = this.getRouter();
			this.oRouter.getRoute("GestisciPosizioneFinanziaria").attachMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			//this.oRouter.getTarget("GestisciPosizioneFinanziaria").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		},

		_onRouteMatched: function(oEvent) {

			this.sRouterParameter = oEvent.getParameters().name;
			this.getView().byId("TextAnno").setText(sap.ui.getCore().getModel("gestTipologicheModel").getData().ANNO);
			this._getAvvioPfId();
		},

		_getAvvioPfId: function() {
			var oTreeTablePos = this.getView().byId("treeTablePFID");

			//Deleto le precedenti row prima di inserire le nuove
			oTreeTablePos.unbindRows();

			var oIdPosFinSel = this.getView().getModel("modelPosFinSelected").getData();
			var aPosFinSel = oIdPosFinSel.IdPosfin;
			var oSet = {
				one: false,
				enabled: true
			}
			if (aPosFinSel.length === 1) {
				oSet = {
					one: true,
					enabled: false
				}
			}

			this.getView().setModel(new JSONModel(oSet), "modelOneRow")
			var aFilters = new Filter({
				filters: [],
				and: false
			});
			if (aPosFinSel) {
				for (var i = 0; i < aPosFinSel.length; i++) {
					aPosFinSel[i].PosFin = aPosFinSel[i].PosFin.replaceAll(".", "");
					var filFipex = new Filter("Fipex", FilterOperator.EQ, aPosFinSel[i].PosFin);
					aFilters.aFilters.push(filFipex);
				}
			}

			BusyIndicator.show(0);
			var that = this;

			oTreeTablePos.bindRows({
				path: "ZSS4_COBI_PREN_ESAMOD_SRV>/ZET_AVVIOPF_IDSet",
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
				events:{
					//dataReceived : this.onDataReceived.bind(this)
					dataReceived : function(oEvent) {
						var isSingleRow= that.getView().getModel("modelOneRow").getData().one;
						var oModelTreeTable = that.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV");
						var oTable = that.getView().byId("treeTablePFID")
						if(isSingleRow){
							if(oEvent.getParameter("data")){
								if(!!oEvent.getParameter("data").results[0]){
									var path = oEvent.getParameter("data").results[0].__metadata.uri.split("/").pop();
									oModelTreeTable.oData[path].SELECTED = true;
									oTable.mAggregations.rows[0].mAggregations.cells[0].setSelected(true);
									oTable.mAggregations.rows[0].mAggregations.cells[0].setEnabled(false);
								}
								
							}
						}else{
							/* if(oEvent.getParameter("data") && oEvent.getParameter("data").results.length > 0){
								var i = 0
								oEvent.getParameter("data").results.forEach(el => {

									if(el.HierarchyLevel === "0"){

										var path = el.__metadata.uri.split("/").pop();
										oModelTreeTable.oData[path].SELECTED = false;
										if(oTable.mAggregations){
											oTable.mAggregations.rows[i].mAggregations.cells[0].setSelected(false);
											oTable.mAggregations.rows[i].mAggregations.cells[0].setEnabled(true);
										}
										i = i+1									
									}
								});
							} */
							//deseleziono le celle
							oTable.clearSelection()
						}
						BusyIndicator.hide();
					}
				}
			});

		},

		stopBusy: function(oEvent){
			BusyIndicator.hide();
		},

		onNavBackToPosFin: function() {
			this._resetCheckbox("posFinPropostaModel");
			this.oRouter.navTo("PosizioneFinanziaria");
		},

		_getSelectedItems: function() {
			var aObject = Object.keys(this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData);
			var aData = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData;
			var aSelected = [],
				aValResult = [];
			for (var i = 0; i < aObject.length; i++) {
				if (aObject[i].includes("ZET_AVVIOPF_IDSet") && aData[aObject[i]].SELECTED === true) {
					aSelected.push(aData[aObject[i]]);
				}
			}

			return aSelected;
		},
		_getNoSelectedItems: function() {
			var aObject = Object.keys(this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData);
			var aData = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData;
			var aSelected = [],
				aValResult = [];
			for (var i = 0; i < aObject.length; i++) {
				if (aData[aObject[i]].SELECTED === false) {
					aSelected.push(aData[aObject[i]]);
				}
			}

			return aSelected;
		},

		onSelectCheckBox: function(oEvent) {
			//this._resetCheckbox("modelTreeTable", this);
			var oEl = oEvent.getSource().getBindingContext("ZSS4_COBI_PREN_ESAMOD_SRV").sPath;
			var oObjectUpdate = this.getView().getModel("ZSS4_COBI_PREN_ESAMOD_SRV").oData[oEl.slice(1)];
			if (oObjectUpdate.SELECTED && oObjectUpdate.SELECTED === true) {
				oObjectUpdate.SELECTED = false;
			} else {
				oObjectUpdate.SELECTED = true;
			}
		},

		onSelect: function(oEvent) {

			var aRows = this.getView().byId("treeTablePFID").getRows();
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

		onPressNavToTabGestisci: function() {
			this._rowSel();
			var aModelPageTab = this.getView().getModel("modelPosFinSelected").getData();
			var oModelSelPosFin = this.getView().getModel("modelPosFinSelected");
			oModelSelPosFin.setData();
			this._refreshModel(oModelSelPosFin);

			var aSelected = this._getSelectedItems();

			if(this._getSelectedItems().length === 0){	
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("selezionaSoloUnaRiga"));
				return;
			}

			if(this._getSelectedItems().length > 1){	
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("selezionaSoloUnaRiga"));
				return;
			}

			var conProposta = $.grep(this._getSelectedItems(), function (n, i) {
				return n.IdProposta !== "" && n.IdProposta !== "0";
			});

			if(conProposta.length === 0){
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("noPossibileGestioneNoAssociazione", [aSelected[0].Fipex]));
				return;
			}

			if (aSelected.length === 0) {
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoAutPagePosFinId"));
			} else {
				var sIdProposta = aSelected[0].Idproposta;
				var sCodIter = aSelected[0].CodiceIter;
				this.getOwnerComponent().setModel(new JSONModel(aSelected[0]), "modelNavGestisci");

				// if (aModelPageTab.length === 1 && sIdProposta !== "" && sIdProposta !== undefined && sIdProposta !== "0000000000" && sIdProposta !==
				// 	"0" && sCodIter === "01") {
					this._resetCheckbox("ZSS4_COBI_PREN_ESAMOD_SRV", "treeTablePFID");
					this.oRouter.navTo("GestisciAna");
				// } else {
				// 	MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoAutPagePosFinId"));
				// }
			}

		},

		_rowSel: function(event) {
			var that = this;

			var aSelected = this._getSelectedItems();

			if (aSelected.length > 0) {
				// mi prendo la proprietà che mi interessa
				var aRows = [];
				for (var i = 0; i < aSelected.length; i++) {
					// var sPosFin = this.getView().getModel().getProperty(aSelectedPath[i]).Posfin;
					var sIdPosFin = aSelected[i].Fipex;
					var sIdProposta = aSelected[i].KeyCode;
					// var sCodiFincode = this.getView().getModel().getProperty(aSelectedPath[i]).Fincode;
					var sIter = aSelected[i].Iter;
					var sCodIter = aSelected[i].CodIter;
					var sTipo = aSelected[i].TipologiaProposta;
					var sNickname = aSelected[i].Nickname;

					var sFikrs = aSelected[i].Fikrs;
					var sAnnoFipex = aSelected[i].AnnoFipex;
					var sFase = aSelected[i].Fase;
					var sReale = aSelected[i].Reale;
					var sVersione = aSelected[i].Versione;
					var sEos = aSelected[i].Eos;
					var sCodiceAmmin = aSelected[i].CodiceAmmin;
					var sKeycodepr = aSelected[i].IdProposta;
					var sDatbis = aSelected[i].Datbis;
					var sFipex = aSelected[i].Fipex;
					var sAut = aSelected[i].Autorizzazioni;

					var oData = {
						"IdPosfin": sIdPosFin,
						"IdProposta": sIdProposta,
						// "CodiFincode": sCodiFincode,
						// "Posfin": sPosFin,
						"CodiceIter": sCodIter,
						"Iter": sIter,
						"Tipo": sTipo,
						"Nickname": sNickname,
						"Fikrs": sFikrs,
						"AnnoFipex": sAnnoFipex,
						"Fase": sFase,
						"Reale": sReale,
						"Versione": sVersione,
						"Eos": sEos,
						"CodiceAmmin": sCodiceAmmin,
						"Keycodepr": sKeycodepr,
						"Datbis": sDatbis,
						"Fipex": sFipex,
						PosFin: sFipex,
						Aut: sAut
				 
					};
					aRows.push(oData);

				}
				that.getView().getModel("modelPageAut").setData(aRows);
				that.getView().getModel("modelPosFinSelected").setProperty("/IdPosfin", aRows);;
				this.getOwnerComponent().setModel(new JSONModel(aRows), "modelNavAna");				
			}
		},

		onPressNavToAssociaID: function(oEvt) {
			//LOGICA CONTROLLO SELEZIONE 1 O + POSFIN

			var oModelSelPosFin = this.getView().getModel("modelPosFinSelected");
			oModelSelPosFin.setData();
			this._refreshModel(oModelSelPosFin);
			this._rowSel();
			var oPosFinSel = oModelSelPosFin.getData("IdPosfin");
			var aPosFinSel = oPosFinSel.IdPosfin;

			if(aPosFinSel){
				for (var i = 0; i < aPosFinSel.length; i++) {
					if (aPosFinSel[i]["IdProposta"] !== '0') {
						MessageBox.warning("Posizioni con proposte già associate. Non è possibile procedere.");
						return;
					}
				}
			} else {
				MessageBox.warning("Selezionare una Posizione.");
				return;
			}

			var rowSelected = this._getSelectedItems();

			if (rowSelected) {
				//this._resetCheckbox("modelTreeTable", this);
				//this.getOwnerComponent().setModel(aPosFinSel,"selPosModel");
				this.oRouter.navTo("AssociaProposta");

			} else {
				MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("MBTastoGestisciPagePosFinA"));
			}
		},

		downloadExcel: function(dataSource) {
			var aCols = [{
				label: "Amministrazione",
				property: "Amm",
				type: "string"
			}, {
				label: "Cdr",
				property: "Cdr",
				type: "string"
			}, {
				label: "Posizione Finanziaria",
				property: "PosFinanziaria",
				type: "string"
			}, {
				label: "Autorizzazioni",
				property: "autorizzazioni",
				type: "string"
			}, {
				label: "Proposta",
				property: "Proposta",
				type: "string"
			}, {
				label: "Nickname Proposta",
				property: "Nickname",
				type: "string"
			}, {
				label: "Iter",
				property: "Iter",
				type: "string"
			}, {
				label: "Esito Controllo",
				property: "EsitoControlli",
				type: "string"
			}, {
				label: "Tipo Variazione",
				property: "TipoVariazione",
				type: "string"
			}, {
				label: "Var. Proposta Competenza 2023",
				property: "VarPropCompetenza2023",
				type: "string"
			}, {
				label: "Var. Proposta Competenza 2024",
				property: "VarPropCompetenza2024",
				type: "string"
			}, {
				label: "Var. Proposta Competenza 2025",
				property: "VarPropCompetenza2025",
				type: "string"
			}, {
				label: "Var. Proposta Cassa 2023",
				property: "VarPropCassaTot2023",
				type: "string"
			}, {
				label: "Var. Proposta Cassa 2024",
				property: "VarPropCassaTot2024",
				type: "string"
			}, {
				label: "Var. Proposta Cassa 2025",
				property: "VarPropCassaTot2025",
				type: "string"
			}];

			var oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: dataSource,
				fileName: "EsaModEPosFinProposta.xlsx"
			};

			new Spreadsheet(oSettings).build();
		},

		onTableExport: function() {
			const flatten = (array) => array.flatMap(({
				Amm,
				Cdr,
				PosFinanziaria,
				autorizzazioni,
				Proposta,
				Nickname,
				Iter,
				EsitoControlli,
				TipoVariazione,
				VarPropCompetenza2023,
				VarPropCompetenza2024,
				VarPropCompetenza2025,
				VarPropCassaTot2023,
				VarPropCassaTot2024,
				VarPropCassaTot2025,
				categories
			}) => [{
					Amm,
					Cdr,
					PosFinanziaria,
					autorizzazioni,
					Proposta,
					Nickname,
					Iter,
					EsitoControlli,
					TipoVariazione,
					VarPropCompetenza2023,
					VarPropCompetenza2024,
					VarPropCompetenza2025,
					VarPropCassaTot2023,
					VarPropCassaTot2024,
					VarPropCassaTot2025,
				},
				...flatten(categories || [])
			]);

			this.downloadExcel(flatten(this.getView().getModel("posFinPropostaModel").getData()));
		},

	});
});