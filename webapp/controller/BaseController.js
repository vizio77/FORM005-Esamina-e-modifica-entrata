sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/SelectDialog",
	"sap/m/TableSelectDialog",
	"sap/ui/core/Fragment",
	"sap/ui/core/syncStyleClass",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/FilterOperator",

], function(Controller, History, SelectDialog, TableSelectDialog, Fragment, syncStyleClass, MessageBox, Filter, JSONModel, FilterOperator) {
	"use strict";
	return Controller.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.controller.BaseController", {

		_readFromDb: function(sDbSource, sEntitySet, aFilters, aSorters) {
			var aReturn = this._getDbOperationReturn();
			var oModel = this._getDbModel(sDbSource);
			return new Promise(function(resolve, reject) {
				oModel.read(sEntitySet, {
					filters: aFilters,
					sorters: aSorters,
					success: function(oData) {
						aReturn.returnStatus = true;
						if (oData.results === undefined) {
							aReturn.data = oData;
						} else {
							aReturn.data = oData.results;
						}

						resolve(aReturn.data);
						// return resolve(aReturn.data);
					},
					error: function(e) {
						aReturn.returnStatus = false;
						reject(e);
						// return reject(e);
					}
				});
			});
		},

		modifyRecord: function(sDbSource, sEntitySet, oRecord) {
			var aReturn = this._getDbOperationReturn();
			var oModel = this._getDbModel(sDbSource);
			// Leggo il modello da SAP
			return new Promise(function(resolve, reject) {
				oModel.update(sEntitySet, oRecord, {
					success: function(oData) {
						aReturn.returnStatus = true;
						return resolve(aReturn.returnStatus);
					},
					error: function(e) {
						aReturn.returnStatus = false;
						return resolve(aReturn.returnStatus);
						// return reject(e);
					}
				});
			});
		},

		insertRecord: function(sDbSource, sEntitySet, oRecord) {
			var aReturn = this._getDbOperationReturn();
			var oModel = this._getDbModel(sDbSource);
			return new Promise(function(resolve, reject) {
				oModel.create(sEntitySet, oRecord, {
					success: function(oData) {
						if (sEntitySet === "/SacUrlSet") {
							return resolve(oData);
						} else {
							aReturn.returnStatus = true;
							return resolve(aReturn.returnStatus);
						}
					},
					error: function(e) {
						/* if (oData.Belnr) {
							return oData.Belnr;
						} else { */
						aReturn.returnStatus = false;
						aReturn.message = JSON.parse(e.responseText).error.message.value;
						return reject(aReturn);
						/* } */
					}
				});
			});
		},
		onPressNavToHome: function() {
			this.oRouter = this.getRouter();
			this.oRouter.navTo("PosizioneFinanziaria");
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		_remove: function(arr, what) {
			var found = arr.indexOf(what);

			while (found !== -1) {
				arr.splice(found, 1);
				found = arr.indexOf(what);
			}
		},
		onPressShowPopOverHeaderNuovaPosFin: function(e) {
			var sBtn = e.getSource();
			var oView = this.getView();
			var sID = e.getSource().getId();
			var sBtnText = sID.split("--")[1];

			if (!this._PopOverHeader) {
				this._PopOverHeader = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.PopOverHeaderNuovaPosFinLinks",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oPopover);
					return oPopover;
				});
			}

			this._PopOverHeader.then(function(oPopover) {
				// Open ValueHelpDialog filtered by the input's value
				oPopover.openBy(sBtn);
			});
			if (sBtnText === "idPopPosFinSnap" || sBtnText === "idPopPosFin") {
				this.getView().byId("idBoxPosFin").setVisible(true);
				this.getView().byId("idBoxStruttAmmCen").setVisible(false);
				this.getView().byId("idPopHeader").setTitle(this.getView().getModel("i18n").getResourceBundle().getText("TitleHeaderPosFin"));
			}
			if (sBtnText === "idPopStrAmmCenSnap" || sBtnText === "idPopStrAmmCen") {
				this.getView().byId("idBoxPosFin").setVisible(false);
				this.getView().byId("idBoxStruttAmmCen").setVisible(true);
				this.getView().byId("idPopHeader").setTitle(this.getView().getModel("i18n").getResourceBundle().getText("TitleHeaderStruAmmCen"));
			}

		},

		getMessageBoxWarning: function(sText) {
			MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText(sText), {
				id: "messageWarning"
			});
			sap.ui.getCore().byId("messageWarning").getButtons()[0].setType("Emphasized");

		},

		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		recuperaTestoI18n: function(testoDaRecuperare) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(testoDaRecuperare);
		},

		// formatterPosFin: function(sValue) {
		// 	if (sValue === "" || sValue === null || sValue === undefined) {
		// 		return "";
		// 	} else {
		// 		return sValue.replaceAll(".", "");
		// 	}
		// },

		// formatterAmm: function(sValue) {
		// 	if (sValue === "" || sValue === null || sValue === undefined) {
		// 		return "";
		// 	} else {
		// 		return sValue.replaceAll("A", "");
		// 	}
		// },

		_openBusyDialog: function(sText) {
			sap.ui.getCore()._dialog = sap.ui.xmlfragment("zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.BusyDialog", this);
			if (sText) {
				sap.ui.getCore()._dialog.setText(sText);
			}
			this.getView().addDependent(sap.ui.getCore()._dialog);
			sap.ui.getCore()._dialog.open();
		},
		_closeDialog: function() {
			try {
				if (sap.ui.getCore()._dialog) {
					sap.ui.getCore()._dialog.close();
					sap.ui.getCore()._dialog.destroy();
				}
			} catch (error) {
				//Popup già chiusa
			}
		},

		_setErrorMex: function(error) {
			var messaggio;
			try {
				//messaggio JSON
				var errorObj = JSON.parse(error.responseText);
				messaggio = errorObj.error.message.value;
			} catch (e) {
				try {
					//messaggio XML
					var oXmlData = error.responseText;
					var oXMLModel = new sap.ui.model.xml.XMLModel();
					oXMLModel.setXML(oXmlData);
					var tabMex = oXMLModel.getData().all;
					for (var i = 0; i < tabMex.length; i++) {
						var value = tabMex[i];
						if (value.tagName === "h1") {
							messaggio = value.innerHTML;
						}
					}
					if (!messaggio) {
						for (var j = 0; j < tabMex.length; j++) {
							var value = tabMex[j];
							if (value.tagName === "message") {
								messaggio = value.innerHTML;
							}
						}
					}
				} catch (e2) {
					messaggio = this.getResourceBundle().getText("error");
				}
			}
			return messaggio;
		},
		getModel: function() {
			return this.getOwnerComponent().getModel();
		},

		_getDbOperationReturn: function() {
			return {
				returnStatus: false,
				data: [],
			};
		},
		_getDbModel: function(sDbSource) {
			var sServiceURL;
			switch (sDbSource) {
				case '0':
					return this.getOwnerComponent().getModel('ZSS4_COBI_PREN_ESAMOD_SRV');
					break;
				case '1':
					return this.getOwnerComponent().getModel('modelGestTipologicheSRV');
					break;
				case '2':
					return this.getOwnerComponent().getModel('modelOperazionEsaMod');
					break;
				case '3':
					return this.getOwnerComponent().getModel('FiltriEntrate');
					break;				
			}
		},

		navToProposta: function(){
			this.navToAppLaunchpad("Z_S4_ESMPROPS")
		},

		navToAppLaunchpad: function(sSemanticOb) {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: sSemanticOb,
					action: "display"
				}
			})) || "";
			// l'hash viene usato per navigare alla nuova app
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: hash
				}
			});

		},

		recuperaTestoI18n: function(testoDaRecuperare) {
			return this.getOwnerComponent()
				.getModel('i18n')
				.getResourceBundle()
				.getText(testoDaRecuperare);
		},

		_refreshModel: function(oModel) {
			oModel.setData([]);
		},

		_resetCheckbox: function(sModel) {
			var aObject = Object.keys(this.getView().getModel(sModel).oData);
			var aData = this.getView().getModel(sModel).oData;

			for (var i = 0; i < aObject.length; i++) {
				aData[aObject[i]].SELECTED = false;
			}
			this.getView().getModel(sModel).refresh(true);
		},

		onNavBack: function(oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("PosizioneFinanziaria", {}, true /*no history*/ );
			}
		},

		onNavBack: function(oEvent) {
			this.oRouter.navTo("PosizioneFinanziaria");
			//window.location.reload();

		},
		setLinkSac: function(url, sId) {
			this.getView().setBusy(true);
			// var aData = this.getView().getModel(modelData).getData();
			// this.getView().setModel(new JSONModel(aData), newModel);
			var oFrame = this.getView().byId(sId);
			var oFrameContent = oFrame.$()[0];
			// var newUrl = objSac.urlSac + "&IdPropostaURL=" + aData.Proposta;
			oFrameContent.setAttribute("src", url);
			// this.getView().getModel(newModel).refresh();
			this.getView().setBusy(false);
		},
		_gestTipologiche: async function() {
			var that = this;
			try {
				var aRes = await this._readFromDb("1", "/ZES_FOTO_ANNO_SET(TYPE_KEY='SCH_AMM')", [], [], "");
				aRes.Fikrs = "S001";
				if (this.getView().getModel("modelAdattaFiltri")) {
					aRes.Prctr = this.getView().getModel("modelAdattaFiltri").getData().CodiceAmmin;
				} else {
					aRes.Prctr = "A020"
				}

				aRes.Versione = "P";
				sap.ui.getCore().setModel(new JSONModel(aRes), "gestTipologicheModel");
			} catch (errorResponse) {
				var sDettagli = that._setErrorMex(errorResponse);
				var oErrorMessage = errorResponse.responseText;
				MessageBox.error(oErrorMessage, {
					details: sDettagli,
					initialFocus: sap.m.MessageBox.Action.CLOSE,
					styleClass: "sapUiSizeCompact"
				});
				MessageBox.error(oErrorMessage);
			}
		},

		onPressInformations: function(event, view) {
			var oButton = event.getSource();
			var oInfoModel = new JSONModel();
			var sRootPath = jQuery.sap.getModulePath("zsap.com.r3.cobi.s4.esamodModEntrPosFin");
			var filepath;

			if (view === 'competenza') {
				filepath = sRootPath + "/data/infoCompentenza.json";
				oInfoModel.loadData(filepath, false);
			}
			if (view === 'cassa') {
				filepath = sRootPath + "/data/infoCassa.json";
				oInfoModel.loadData(filepath, false);
			}
			if (view === 'dettContPosFin') {
				filepath = sRootPath + "/data/infoDettaglioContPF.json";
				oInfoModel.loadData(filepath, false);
			}
			if (view === 'dettContIdProposta') {
				filepath = sRootPath + "/data/infoDettaglioContID.json";
				oInfoModel.loadData(filepath, false);
			}

			if (!this._oDialogInfo) {
				this._oDialogInfo = sap.ui.xmlfragment(
					"zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.Information", this);
				//	this._oDialogUff.bindElement("localModel");  INUTILE
				this.getView().addDependent(this._oDialogInfo); // --> questa fa si che i model globali siano visibili sul fragment

			}
			this._oDialogInfo.setModel(oInfoModel, "infoModel");
			this._oDialogInfo.openBy(oButton);

		},
		onPressChiudiInfoPopOver: function() {
			var oPopover = sap.ui.getCore().byId("InfoPopover");
			oPopover.close();
		},

		handleValueHelp: async function(oEvent, sId) {
			// this._openBusyDialog();
			var oView = this.oView,
				myTemplate,
				myPath,
				searchField = [],
				that = this,
				aFilter = [];
			switch (sId) {
				case 'Amm':
					var arrDassSet = await this._readFromDb("1", "/ZCA_AF_AMMIN", [], [], "");
					var sTitleDialog = "{i18nL>cercaAmministrazione}";
					this.getView().setModel(new JSONModel(arrDassSet), "oMatchcodeModel");
					break;
				case 'Note':
					var aFilter = [];
					var sAmmin = sap.ui.getCore().Amm;
					aFilter.push(new Filter("Prctr", sap.ui.model.FilterOperator.EQ, sAmmin));
					aFilter.push(new Filter("Attributo", sap.ui.model.FilterOperator.EQ, "E"));
					aFilter.push(new Filter("Attributo", sap.ui.model.FilterOperator.EQ, "G"));
					var arrDassSet = await this._readFromDb("2", "/ZES_ELENCO_NOTESet", aFilter, []);
					var sTitleDialog = "{i18nL>cercaNota}";
					this.getView().setModel(new JSONModel(arrDassSet), "oMatchcodeModel");
					// var oObjectList = this._setObjectList("IdNota", "TestoNota");
			}

			myPath = "oMatchcodeModel>/";
			switch (sId) {
				case "Amm":
					var sTit = "Prctr";
					var sDescr = "DescBreve";
					break;
				case "Note":
					var sTit = "IdNota";
					var sDescr = "TestoNota";
					break;
			}
			searchField.push(sTit, sDescr);
			myTemplate = new sap.m.StandardListItem({
				title: "{oMatchcodeModel>" + sTit + "}",
				description: "{oMatchcodeModel>" + sDescr + "}",
			});
			var oValueHelpDialog = new sap.m.SelectDialog({

				title: sTitleDialog,

				items: {
					path: myPath,
					template: myTemplate
				},

				contentHeight: "60%",
				confirm: function(oConfirm) {
					var titolo = oConfirm.getParameter("selectedItem").getTitle();

					switch (sId) {
						case 'Amm':
							var oModelAdattaFiltri = that.oView.getModel("modelAdattaFiltri");
							var aDataModelAdattaFiltri = oModelAdattaFiltri.getData();
							aDataModelAdattaFiltri.CodiceAmmin = titolo;
							oModelAdattaFiltri.refresh();
							break;
						case 'Note':
							var sIdNota = oConfirm.getParameter("selectedItem").getTitle();
							var sInputNota = that.getView().byId("idInputScegliNoteIDProposta");
							sInputNota.setValue(sIdNota);
							var sTestoNota = oConfirm.getParameter("selectedItem").getDescription();
							var sTextArea = that.getView().byId("idNota");
							sTextArea.setValue(sTestoNota);
							that.getView().byId("idNota").setEditable(false);
							// var oModelAdattaFiltri = that.oView.getModel("modelAdattaFiltri");
							// var aDataModelAdattaFiltri = oModelAdattaFiltri.getData();
							// aDataModelAdattaFiltri.CodiceAmmin = titolo;
							// oModelAdattaFiltri.refresh();
							break;
					}

				},
				search: function(oSearch) {
					var V = oSearch.getParameter("value");
					var h = searchField; // campi su cui cercare
					var k;
					if (h instanceof Array) {
						var l = [];
						for (var i = 0; i < h.length; i++) {
							if (h[i] !== "") {
								var s = new sap.ui.model.Filter(h[i], sap.ui.model.FilterOperator.Contains, V);
								l.push(s);
							}
						}
						k = new sap.ui.model.Filter(l, false);
					}
					oSearch.getSource().getBinding("items").filter([k]);
				},
				cancel: function(oCancel) {},

			});

			//gestione emphasized dei bottoni
			var oButton = oValueHelpDialog.getAggregation("_dialog").getEndButton();
			if (oButton) {
				sap.ui.getCore().byId(oButton.sId).setType("Emphasized");
			}
			var oButton = oValueHelpDialog.getAggregation("_dialog").getBeginButton();
			if (oButton) {
				sap.ui.getCore().byId(oButton.sId).setType("Emphasized");
			}
			oView.addDependent(oValueHelpDialog);
			// this._closeBusyDialog();
			oValueHelpDialog.open();
		},

		MesssageBoxDynamic: function(sTitle, sText, sMod, option) {
			var that = this;
			var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
			if (option === "warningFull" || option === "warningAllert") {
				sap.m.MessageBox.warning(
					that.recuperaTestoI18n(sText), {
						id: "messageWarningFull",
						title: that.recuperaTestoI18n(sTitle),
						actions: [MessageBox.Action.OK, "Annulla"],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function(sAction) {
							if (sAction === "OK") {} else if (sAction === "Annulla") {}
						}
					}
				);
			} else if (option === "success") {
				sap.m.MessageBox.success(
					that.recuperaTestoI18n(sText), {
						title: that.recuperaTestoI18n(sTitle),
						id: "succMess",
						actions: [MessageBox.Action.OK],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function(sAction) {
							if (sAction === "OK") {
								if (sMod === "sIterStatus") {
									that.onPressNavToHome("Reload");
								}
							}
						}
					}
				);
			} else if (option === "error") {
				sap.m.MessageBox.error(
					that.recuperaTestoI18n(sText), {
						title: that.recuperaTestoI18n(sTitle),
						id: "errorMess",
						actions: [MessageBox.Action.OK],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function(sAction) {
							if (sAction === "OK") {}
						}
					}
				);
			}
			if (option === "warningFull") {
				sap.ui.getCore().byId("messageWarningFull").getButtons()[0].setType("Emphasized");
				sap.ui.getCore().byId("messageWarningFull").getButtons()[1].setType("Emphasized");
			} else if (option === "warningAllert") {
				sap.ui.getCore().byId("messageWarningFull").getButtons()[0].setType("Emphasized");
				sap.ui.getCore().byId("messageWarningFull").getButtons()[1].setVisible(false);
			} else if (option === "success") {
				sap.ui.getCore().byId("succMess").getButtons()[0].setType("Emphasized");
			} else {
				sap.ui.getCore().byId("errorMess").getButtons()[0].setType("Emphasized");
			}
		}

	});
});