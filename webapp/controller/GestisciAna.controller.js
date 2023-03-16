sap.ui.define([
	'zsap/com/r3/cobi/s4/esamodModEntrPosFin/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/formatter",
	"sap/ui/core/Fragment",
], function(BaseController, JSONModel, Filter, FilterOperator, MessageBox, formatter, Fragment) {
	"use strict";

	return BaseController.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.controller.GestisciAna", {
		formatter: formatter,
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("GestisciAna").attachMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: async function() {
			this.setModelContHeader();
			this.getView().byId("TextAnno").setText(new Date().getFullYear() + 1);
			await this._getDatiAnagrafica();
		},

		setModelContHeader: function() {
			var oSelectedItem = this.getOwnerComponent().getModel("modelNavAna").getData()[0];
			if (oSelectedItem.IdProposta === undefined || oSelectedItem.IdProposta === "0" || oSelectedItem.IdProposta.length === 0) {
				this.getView().byId("WorkFlow").setEnabled(false);
				this.getView().byId("Note").setEnabled(false);
			}
			this.getView().setModel(new JSONModel(oSelectedItem), "modelHeader");
		},

		onPressIconTabBar: async function(oEvent) {
			var sSelectedTab = oEvent.getParameters().selectedKey;

			switch (sSelectedTab) {
				case 'Cassa':
					this.getView().byId('btnInfoCassaTabID').setVisible(true);
					this.getView().byId('btnInfoCompetenzaTabID').setVisible(false);
					// await this._getSchedaSacCassa();
					break;
				case 'WorkFlow':
					await this._TimelineCompiler();
					break;
				case 'Anagrafica':
					await this._getDatiAnagrafica();
					await this._AutRead();
					break;
				case 'Note':
					await this._getNota();
					break;
				case 'Competenza':
					this.getView().byId('btnInfoCassaTabID').setVisible(false);
					this.getView().byId('btnInfoCompetenzaTabID').setVisible(true);
					// await this._dataAuto();
					break;

			}

		},

		_getDatiAnagrafica: async function() {
			this._openBusyDialog();
			var sFipex = this.getView().byId("idLinkPosfinTab").getText();
			// var sIdProposta = this.getView().byId("idPropostaTabID").getText();
			var sKeycodepr, sFikrs, sAnno, sFase, sReale, sVersione, sEos;

			var aModelPosFin = this.getView().getModel("modelHeader").getData();

			var isEmptyOData = Object.keys(aModelPosFin).length == 0;

			var sPosfin;

			sFipex = aModelPosFin.Fipex;
			sPosfin = aModelPosFin.Fipex;
			sKeycodepr = aModelPosFin.Keycodepr;
			sFikrs = aModelPosFin.Fikrs;
			sAnno = aModelPosFin.AnnoFipex;
			sFase = aModelPosFin.Fase;
			sReale = aModelPosFin.Reale;
			sVersione = aModelPosFin.Versione;
			sEos = aModelPosFin.Eos;

			var sPathPF = "/PosFinSet(Fikrs='" + sFikrs + "',Anno='" + sAnno + "',Fase='" + sFase + "',Reale='" + sReale + "',Versione='" +
				sVersione + "',Fipex='" + sFipex + "',Eos='" + sEos + "')";

			var that = this;
			try {
				var aRes = await this.readFromDb("2", sPathPF, [], [], "");
				this.getView().setModel(new JSONModel(aRes), "modelAnagraficaPf");

			} catch (e) {
				MessageBox.error(e.responseText);
			}
			this._closeDialog();

		},

		_TimelineCompiler: async function() {
			this._openBusyDialog();

			var aModelPosFin = this.getView().getModel("modelHeader").getData();

			var sEos = "E";
			var sAmm = sap.ui.getCore().getModel("gestTipologicheModel").getData().Prctr;
			var aFilters = [];
			aFilters = [
				new Filter({
					path: "IdProposta",
					operator: FilterOperator.EQ,
					value1: aModelPosFin.IdProposta
				}),
				new Filter({
					path: "Eos",
					operator: FilterOperator.EQ,
					value1: sEos
				}),
				new Filter({
					path: "Amministrazione",
					operator: FilterOperator.EQ,
					value1: sAmm
				})
			];

			try {
				var aRes = await this._readFromDb("4", "/WorkFlowSet", aFilters, [], "");
				this.getView().setModel(new JSONModel(aRes), "modelTimeLineWorkFlow")
			} catch (errorResponse) {

				MessageBox.error(this.getResourceBundle().getText("NessunDato"));

			}
			this._closeDialog();
		},
		_getNota: async function() {

			this._openBusyDialog();

			var aData = this.getView().getModel("modelHeader").getData();
			try {
				var aRes = await this._readFromDb("4", "/PropostaSet(Keycodepr='" + aData.KeyCode + "')", [], [], "");
				this.getView().setModel(new JSONModel(aRes), "modelNote")
				if (aRes.Idnota !== "0000000000") {
					this.getView().byId("idInputScegliNoteIDProposta").setValue(aRes.Idnota);
					this.getView().byId("idNota").setEditable(false);
				} else {
					this.getView().byId("idInputScegliNoteIDProposta").setEditable(false);
					this.getView().byId("idInputScegliNoteIDProposta").setValue("");

				}
				var aRes = await this.readFromDb("4", "/ZES_NOTE_IDSet", [], [], "");
				this.getView().setModel(new JSONModel(aRes), "modelListaIdNote");

			} catch (e) {

			}
			this._closeDialog();

		},

		onLiveWriteNota: function(oEvent) {
			var sText = oEvent.getParameter("newValue");
			if (sText.length > 0) {
				this.getView().byId("idInputScegliNoteIDProposta").setValue(null);
				this.getView().byId("idInputScegliNoteIDProposta").setEditable(false);

			}
		},
		onSaveNota: async function(oEvt) {
			this._openBusyDialog();

			var sTestoNuovaNota = this.getView().byId("idNota").getValue();
			var sIdNota = this.getView().byId("idInputScegliNoteIDProposta").getValue();
			var aData = this.getView().getModel("modelHeader").getData();;

			if (sTestoNuovaNota) {

				var oEntry = {
					Idnota: sIdNota,
					Fikrs: aData.Fikrs,
					Anno: aData.AnnoFipex,
					Fase: aData.Fase,
					Reale: aData.Reale,
					Versione: aData.Versione,
					Eos: aData.Eos,
					Idproposta: aData.IdProposta,
					Testonota: sTestoNuovaNota,
					Keycodepr: aData.KeyCode
				};
				var sPath = "/PropostaSet(Keycodepr='" + aData.KeyCode + "')";
				try {
					await this.modifyRecord("4", sPath, oEntry);
					MessageBox.success(this.getResourceBundle().getText("MBCreateSuccessPagTabNota"));
				} catch (e) {
					MessageBox.error(e.responseText);
				}
			} else {
				MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("MBCreateTestoMancantePagTabNota"));
			}
			this._closeDialog();
		},

		onPressResettaNote: function() {
			//MESSAGGIO DI AVVISO
			this.getView().byId("idInputScegliNoteIDProposta").setValue(null);
			this.getView().byId("idInputScegliNoteIDProposta").setEditable(true);

			this.getView().byId("idNota").setValue(null);
			this.getView().byId("idNota").setEditable(true);
		},

		onPressNavToInvioAllaValidazione: function(oEvt) {
			var sBtnText = oEvt.getSource().getText();

			var oDataModel = this._getDbModel("2");
			var that = this;
			if (sBtnText.toUpperCase() === this.getResourceBundle().getText("RevocaValid").toUpperCase()) {
				MessageBox.warning(this.getResourceBundle().getText("MBTestoPopupRevocaValid"), {
					icon: MessageBox.Icon.WARNING,
					title: this.getResourceBundle().getText("RevocaValid"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.NO,
					onClose: function(oAction) {
						if (oAction === MessageBox.Action.YES) {
							var sIdProposta = that.getView().getModel("modelHeader").getData().IdProposta; //KEYCODE
							oDataModel.callFunction("/RevocaValidazione", {
								method: "GET",
								urlParameters: {
									"IdProposta": sIdProposta
								}, // function import parameters        
								success: function(oData, oResponse) {
									MessageBox.success(that.getResourceBundle().getText("MBRevocaValidSuccessPagTab"));
									var sIter = oData.Iter;
									if (sIter === "01") {
										sIter = "Proposta in lavorazione";
									}
									if (sIter === "02") {
										sIter = "Proposta inviata alla validazione";
									}

									that.onNavBackHome();
								},
								error: function(oError) {
										MessageBox.error(oError.responseText);
									} // callback function for error
							});
						}
					}
				});
			}
			if (sBtnText.toUpperCase() === this.getResourceBundle().getText("InvioValid").toUpperCase()) {
				MessageBox.warning(this.getResourceBundle().getText("MBTestoPopupInvioValid"), {
					icon: MessageBox.Icon.WARNING,
					title: this.getResourceBundle().getText("InvioValid"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.NO,
					onClose: function(oAction) {
						if (oAction === MessageBox.Action.YES) {

							//SCELTA VALIDATORE
							var oView = that.getView();
							if (!that.popupSceltaValidatore) {
								that.popupSceltaValidatore = Fragment.load({
									id: oView.getId(),
									name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.PopupSceltaValidatore",
									controller: that
								}).then(function(oDialog) {
									oView.addDependent(oDialog);

									return oDialog;
								});
							}
							that.popupSceltaValidatore.then(function(oDialog) {
								oDialog.open(oAction);
							});
						}
					}
				});
				this.getView().setModel(new JSONModel({
					Nome: "",
					Cognome: ""
				}), "modelUserSearch");
			}
		},

		onSearchUser: async function() {

			var aFilters = [];
			var oDataModel = this.getView().getModel("modelUserSearch").getData();
			var sNome = oDataModel.Nome.toUpperCase();
			var sCognome = oDataModel.Cognome.toUpperCase();
			aFilters.push(new Filter("McNamefir", FilterOperator.StartsWith, sNome));
			aFilters.push(new Filter("McNamelas", FilterOperator.StartsWith, sCognome));

			try {
				var aRes = await this.readFromDb("4", "/ZES_VALIDATORESet", aFilters, [], "");
				this.getView().setModel(new JSONModel(aRes), "modelTableVal");
			} catch (errorResponse) {
				var sDettagli = this._setErrorMex(errorResponse);
				var oErrorMessage = errorResponse.responseText;
				MessageBox.error(oErrorMessage, {
					details: sDettagli,
					initialFocus: sap.m.MessageBox.Action.CLOSE,
					styleClass: "sapUiSizeCompact"
				});

			}
			// }
		},

		onCloseDialogVal: function() {
			var oDataVal = {
				"Nome": "",
				"Cognome": ""
			};
			if (this.getView().getModel("modelUserSearch")) {
				this.getView().getModel("modelUserSearch").setData(oDataVal);
			}
			this.getView().byId("idPopupSceltaValidatore").close();
		},

		onPressConfermaValidazione: function() {
			var sIdProposta = this.getView().byId("idPropostaTabID").getText();
			var oDataModel = this._getDbModel("2");
			var sValidatore = this.getView().byId("idTableRisultatiRicercaValidatore").getSelectedItem().getBindingContext("modelTableVal").getProperty(
				"Bname");

			var that = this;
			oDataModel.callFunction("/InvioValidazione", { // function import name
				method: "GET", // http method
				urlParameters: {
					"IdProposta": sIdProposta,
					"Validatore": sValidatore
				}, // function import parameters        
				success: function(oData, oResponse) {
					MessageBox.success(that.getResourceBundle().getText("MBInvioValidSuccessPagTab"));

					var sIter = oData.Iter;
					var sCodIter;
					if (sIter === "01") {
						sIter = "Proposta in lavorazione";
						sCodIter = "01";
					}
					if (sIter === "02") {
						sIter = "Proposta inviata alla validazione";
						sCodIter = "02";
					}
					that.onCloseDialogVal();
					that.onNavBackHome();
				}, // callback function for success
				error: function(oError) {
						MessageBox.error(oError.responseText);
					} // callback function for error 
			});
		},

	});
});