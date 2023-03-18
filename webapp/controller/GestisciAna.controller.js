sap.ui.define([
	'zsap/com/r3/cobi/s4/esamodModEntrPosFin/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/formatter",
	"sap/ui/core/Fragment",
	"sap/ui/core/BusyIndicator",
], function(BaseController, JSONModel, Filter, FilterOperator, MessageBox, formatter, Fragment, BusyIndicator) {
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
			this.getView().byId("idIconTabBar").setSelectedKey("Anagrafica");
			this.setModelControlButton();
			await this._getDatiAnagrafica();
		},

		setModelControlButton: function() {
			var oObject = {
				salva: ""
			};
			this.getView().setModel(new JSONModel(oObject), "modelControlButton");
		},

		setModelContHeader: function() {
			var oSelectedItem = this.getOwnerComponent().getModel("modelNavGestisci").getData();
			this.getView().setModel(new JSONModel(oSelectedItem), "modelHeader");
		},

		onPressIconTabBar: async function(oEvent) {
			this._openBusyDialog();
			var sSelectedTab = oEvent.getParameters().selectedKey;

			switch (sSelectedTab) {
				case 'Cassa':
					this.getView().byId('btnInfoCassaTabID').setVisible(true);
					this.getView().byId('btnInfoCompetenzaTabID').setVisible(false);
					this.getView().getModel("modelControlButton").setProperty("/salva", "X");
					await this._getSchedaSacCassa();
					break;
				case 'WorkFlow':
					await this._TimelineCompiler();
					this.getView().getModel("modelControlButton").setProperty("/salva", "");
					break;
				case 'Anagrafica':
					await this._getDatiAnagrafica();
					this.getView().getModel("modelControlButton").setProperty("/salva", "");
					// await this._AutRead();
					break;
				case 'Note':
					await this._getNota();
					this.getView().getModel("modelControlButton").setProperty("/salva", "");
					break;
				case 'Competenza':
					this.getView().byId('btnInfoCassaTabID').setVisible(false);
					this.getView().byId('btnInfoCompetenzaTabID').setVisible(true);
					this.getView().getModel("modelControlButton").setProperty("/salva", "X");
					await this._dataAuto();
					break;

			}
			this._closeDialog();
			this.getView().getModel("modelControlButton").refresh();
		},

		_dataAuto: async function() {
			try {
				var aFilters = [];
				var aData = this.getView().getModel("modelHeader").getData();
				aFilters.push(new Filter("Fikrs", FilterOperator.EQ, aData.Fikrs));
				// var oFilterEos = new Filter("Eos", FilterOperator.EQ, sEos);
				aFilters.push(new Filter("Anno", FilterOperator.EQ, aData.AnnoFipex));
				aFilters.push(new Filter("Reale", FilterOperator.EQ, aData.Reale));
				aFilters.push(new Filter("Fase", FilterOperator.EQ, aData.Fase));
				aFilters.push(new Filter("Versione", FilterOperator.EQ, aData.Versione));
				aFilters.push(new Filter("Fipex", FilterOperator.EQ, aData.Fipex));
				var aRes = await this._readFromDb("0", "/ZCOBI_PREN_ASSAUTSetSet", aFilters, [], "");
				this.getView().setModel(new JSONModel(aRes), "modelAnagraficaAuto");
			} catch (e) {
				this.MesssageBoxDynamic("attenzione", JSON.parse(e.responseText).error.message.value, "", "error");
				// MessageBox.error(e);
			}
		},

		_getDatiAnagrafica: async function() {
			var sFipex = this.getView().byId("idLinkPosfinTab").getText();
			// var sIdProposta = this.getView().byId("idPropostaTabID").getText();
			var sKeycodepr, sFikrs, sAnno, sFase, sReale, sVersione, sEos;

			var aModelPosFin = this.getView().getModel("modelHeader").getData();

			var isEmptyOData = Object.keys(aModelPosFin).length == 0;

			var sPosfin;

			sFipex = aModelPosFin.Fipex;
			sPosfin = aModelPosFin.Fipex;
			sKeycodepr = aModelPosFin.KeyCode;
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
				var aRes = await this._readFromDb("0", sPathPF, [], [], "");
				this.getView().setModel(new JSONModel(aRes), "modelAnagraficaPf");
				var oObject = {
					denomC: "",
					denomA: ""
				};
				this.getView().setModel(new JSONModel(oObject), "modelControlDenom");
				var sModelControl = this.getView().getModel("modelControlDenom");
				if (parseInt(aRes.Coddenomstdcap) > 0) {
					sModelControl.setProperty("/denomC", "X");
				}
				if (parseInt(aRes.Coddenomstdpg) > 0) {
					sModelControl.setProperty("/denomA", "X");
				}
				sModelControl.refresh();
			} catch (e) {
				// MessageBox.error(JSON.parse(e.responseText).error.message.value);
				this.MesssageBoxDynamic("attenzione", JSON.parse(e.responseText).error.message.value, "", "error");
			}

		},

		_TimelineCompiler: async function() {
			//this._openBusyDialog();

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
				var aRes = await this._readFromDb("0", "/WorkFlowSet", aFilters, [], "");
				this.getView().setModel(new JSONModel(aRes), "modelTimeLineWorkFlow")
			} catch (errorResponse) {

				// MessageBox.error(this.getResourceBundle().getText("NessunDato"));
				this.MesssageBoxDynamic("attenzione", "NessunDato", "", "error");

			}
			//this._closeDialog();
		},
		_getNota: async function() {

			//this._openBusyDialog();

			var aData = this.getView().getModel("modelHeader").getData();
			try {
				var aRes = await this._readFromDb("0", "/PropostaSet(Keycodepr='" + aData.KeyCode + "')", [], [], "");
				this.getView().setModel(new JSONModel(aRes), "modelNote")
				if (aRes.Idnota !== "0000000000") {
					this.getView().byId("idInputScegliNoteIDProposta").setValue(aRes.Idnota);
					this.getView().byId("idNota").setEditable(false);
				} else {
					this.getView().byId("idInputScegliNoteIDProposta").setEditable(false);
					this.getView().byId("idInputScegliNoteIDProposta").setValue("");

				}
				var aRes = await this._readFromDb("0", "/ZES_NOTE_IDSet", [], [], "");
				this.getView().setModel(new JSONModel(aRes), "modelListaIdNote");

			} catch (e) {

			}
			//this._closeDialog();

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
					// MessageBox.success(this.getResourceBundle().getText("MBCreateSuccessPagTabNota"));
					this.MesssageBoxDynamic("opEse", "MBCreateSuccessPagTabNota", "", "success");
				} catch (e) {
					// MessageBox.error(e.responseText);
					this.MesssageBoxDynamic("attenzione", JSON.parse(e.responseText).error.message.value, "", "error");
				}
			} else {
				// MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("MBCreateTestoMancantePagTabNota"));
				this.MesssageBoxDynamic("attenzione", "MBCreateTestoMancantePagTabNota", "", "error");
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
			var oDataModel = this._getDbModel("4");
			var that = this;
			if (sBtnText.toUpperCase() === this.getResourceBundle().getText("RevocaValid").toUpperCase()) {
				MessageBox.warning(this.recuperaTestoI18n("MBTestoPopupRevocaValid"), {
					icon: MessageBox.Icon.WARNING,
					id: "MessageWarn",
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
									// MessageBox.success(that.getResourceBundle().getText("MBRevocaValidSuccessPagTab"));
									that.MesssageBoxDynamic("opEse", "MBRevocaValidSuccessPagTab", "sIterStatus", "success");
									var sIter = oData.Iter;
									if (sIter === "01") {
										sIter = "Proposta in lavorazione";
									}
									if (sIter === "02") {
										sIter = "Proposta inviata alla validazione";
									}

									// that.onPressNavToHome();
								},
								error: function(oError) {
										// MessageBox.error(JSON.parse(oError.responseText).error.message.value);
										that.MesssageBoxDynamic("attenzione", JSON.parse(oError.responseText).error.message.value, "", "error");
									} // callback function for error
							});
						}
					}
				});
				sap.ui.getCore().byId("MessageWarn").getButtons()[0].setType("Emphasized");
				sap.ui.getCore().byId("MessageWarn").getButtons()[1].setType("Emphasized");
			}
			if (sBtnText.toUpperCase() === that.getResourceBundle().getText("InvioValid").toUpperCase()) {
				MessageBox.warning(that.getResourceBundle().getText("MBTestoPopupInvioValid"), {
					icon: MessageBox.Icon.WARNING,
					id: "MessageWarn",
					title: that.getResourceBundle().getText("InvioValid"),
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.NO,
					onClose: function(oAction) {
						if (oAction === MessageBox.Action.YES) {

							//SCELTA VALIDATORE
							var oView = that.getView();
							if (!that.popupSceltaValidatore) {
								that.popupSceltaValidatore = Fragment.load({
									id: oView.getId(),
									name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.Fragment.PopupSceltaValidatore",
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
				sap.ui.getCore().byId("MessageWarn").getButtons()[0].setType("Emphasized");
				sap.ui.getCore().byId("MessageWarn").getButtons()[1].setType("Emphasized");
				that.getView().setModel(new JSONModel({
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
				var aRes = await this._readFromDb("0", "/ZES_VALIDATORESet", aFilters, [], "");
				this.getView().setModel(new JSONModel(aRes), "modelTableVal");
			} catch (errorResponse) {
				var sDettagli = this._setErrorMex(errorResponse);
				var oErrorMessage = JSON.parse(errorResponse.responseText).error.message.value;
				MessageBox.error(oErrorMessage, {
					id: "MessageError",
					details: sDettagli,
					initialFocus: sap.m.MessageBox.Action.CLOSE,
					styleClass: "sapUiSizeCompact"
				});
				sap.ui.getCore().byId("MessageError").getButtons()[0].setType("Emphasized");
				sap.ui.getCore().byId("MessageError").getButtons()[1].setType("Emphasized");

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
			var sIdProposta = this.getView().getModel("modelHeader").getProperty("/IdProposta");
			var oDataModel = this._getDbModel("4");
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
					// MessageBox.success(that.getResourceBundle().getText("MBInvioValidSuccessPagTab"));
					that.MesssageBoxDynamic("opEse", "MBInvioValidSuccessPagTab", "sIterStatus", "success");

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
					// that.onPressNavToHome();
				}, // callback function for success
				error: function(oError) {
						// MessageBox.error(oError.responseText);
						that.MesssageBoxDynamic("attenzione", JSON.parse(oError.responseText).error.message.value, "", "error");
					} // callback function for error 
			});
		},

		onPressAssociaAut: function() {

			var oView = this.getView();

			if (!this.AssociaAut) {
				this.AssociaAut = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.Fragment.AssociaAutorizzazionePopOver",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this.AssociaAut.then(function(oPopover) {
				oPopover.open();
			});

		},

		onPressChiudiAssAut: function() {
			var oPopover = this.getView().byId("AssociaAutPopover");
			oPopover.close();
			oPopover.destroy();
			oPopover = undefined;
		},

		onPressOkAssAut: async function() {
			var aDataAnag = this.getView().getModel("modelAnagraficaPf").getData();
			var aCheckAnagrafica = this.Editable;
			var sFincode = this.byId("AutorizzazioniMCD").getAutorizzazione().FINCODE
				// if (aCheckAnagrafica === true) {
			var oEntry = {
				"Fipex": aDataAnag.Codificareppf,
				"Fikrs": aDataAnag.Fikrs,
				"Anno": aDataAnag.Anno,
				"Fase": aDataAnag.Fase,
				"Reale": aDataAnag.Reale,
				"Versione": aDataAnag.Versione,
				"Fictr": this.getView().getModel("modelHeader").getData().Fictr,
				"Fincode": sFincode
			};
			try {
				await this.insertRecord("4", "/ZCOBI_PREN_ASSAUTSetSet", oEntry);
				this.MesssageBoxDynamic("opEse", "AUTOOK", "", "success");
				// MessageBox.success(this.getResourceBundle().getText("AUTOOK"));
				this.onPressChiudiAssAut();
				this.getView().getModel("modelAnagraficaPf").refresh();
				// aCheckAnagrafica = true;
				await this._getDatiAnagrafica();
				await this._dataAuto();
			} catch (e) {
				// MessageBox.warning(this.getResourceBundle().getText("ERRORFOFP"));
				this.MesssageBoxDynamic("attenzione", e, "", "warningAllert");
			}
			// } else {
			// }

		},

		onPressAvvioComp: async function() {
			var that = this;
			this.urlSac = "";
			var oModelPosFin = this.getView().getModel("modelHeader");
			var sIdProp = oModelPosFin.getData().KeyCode;
			var sPosFin = oModelPosFin.getData().Fipex;
			var sStrutt = oModelPosFin.getData().Fictr;
			var sFincode = this.getView().byId("selectCompetenza").getSelectedKey();
			var sCodIter = oModelPosFin.getData().CodIter;
			if (sCodIter === "01") {
				var sReon = "NO";
			} else {
				sReon = "SI";
			}
			// var oDati = {
			// 	// "PosFin": sPosFin,
			// 	// "IdProposta": sIdProp,
			// 	// "Autorizzazione": sAut,
			// 	"SemanticObject": "ESAMINA_MOD",
			// 	"Schermata": "E_COMPETENZA"
			// };
			// var aFilter = [];
			// aFilter.push(new Filter("SemanticObject", FilterOperator.EQ, "ESAMINA_MOD"));
			// aFilter.push(new Filter("Schermata", FilterOperator.EQ, "E_COMPETENZA"));
			try {
				// var oLink = await this._readFromDb("0", "/SacUrlSet", aFilter);
				var sEntitySet = "/SacUrlSet(SemanticObject='" + "ESAMINA_MOD" + "',Schermata='" + "E_COMPETENZA" + "')";
				var oLink = await this._readFromDb("0", sEntitySet);
				var oLinkUrl = oLink.URL + "&p_AutorizzazioneURL" + sFincode + "&p_IdPropostaURL=" + sIdProp + "&p_PosizioneURL=" + sPosFin.replaceAll(
						".", "") +
					"&p_StrutturaURL=" + sStrutt + "&p_REON=" + sReon;
				var oFrame = this.getView().byId("linkSacCompetenza");
				this.urlSac = oLinkUrl;
				var oFrameContent = oFrame.$()[0];
				oFrameContent.setAttribute("src", this.urlSac);
				// this._refresh();
			} catch (e) {
				// sap.m.MessageBox.error(this.recuperaTestoI18n("MBCreateErrorPageAut"));
				this.MesssageBoxDynamic("attenzione", "MBCreateErrorPageAut", "", "error");
			}
		},

		_getSchedaSacCassa: async function() {
			var that = this;
			this.urlSac = "";
			var oModelPosFin = this.getView().getModel("modelHeader");
			var sIdProp = oModelPosFin.getData().KeyCode;
			var sPosFin = oModelPosFin.getData().Fipex;
			var sStrutt = oModelPosFin.getData().Fictr;
			var sFincode = this.getView().byId("selectCompetenza").getSelectedKey();
			var sCodIter = oModelPosFin.getData().CodIter;
			if (sCodIter === "01") {
				var sReon = "NO";
			} else {
				sReon = "SI";
			}
			// var oDati = {
			// 	// "PosFin": sPosFin,
			// 	// "IdProposta": sIdProp,
			// 	// "Autorizzazione": sAut,
			// 	"SemanticObject": "ESAMINA_MOD",
			// 	"Schermata": "E_CASSA"
			// };
			// var aFilter = [];
			// aFilter.push(new Filter("SemanticObject", FilterOperator.EQ, "ESAMINA_MOD"));
			// aFilter.push(new Filter("Schermata", FilterOperator.EQ, "E_CASSA"));
			try {
				var sEntitySet = "/SacUrlSet(SemanticObject='" + "ESAMINA_MOD" + "',Schermata='" + "E_CASSA" + "')";
				var oLink = await this._readFromDb("0", sEntitySet);
				var oLinkUrl = oLink.URL + "&p_ID_PROP_URL=" + sIdProp + "&p_POS_FIN_URL=" + sPosFin.replaceAll(".", "") +
					"&p_ST_AM_RESP_URL=" + sStrutt + "&p_REON=" + sReon;
				var oFrame = this.getView().byId("linkSacCassa");
				this.urlSac = oLinkUrl;
				var oFrameContent = oFrame.$()[0];
				oFrameContent.setAttribute("src", this.urlSac);
				// this._refresh();
			} catch (e) {
				// sap.m.MessageBox.error(this.recuperaTestoI18n("MBCreateErrorPageAut"));
				this.MesssageBoxDynamic("attenzione", "MBCreateErrorPageAut", "", "error");
			}
		},
		//LOGICHE SALVATAGGIO VARIAZIONE ANAGRAFICA
		onSave: function() {
			var oDatiAnagraficaPFBk = this.getView().getModel("modelAnagraficaPf").getData();
			var oDatiAnagraficaPF = jQuery.extend(true, {}, oDatiAnagraficaPFBk);

			var oView = this.getView();
			var oGlobalModel = oView.getModel("ZSS4_COBI_PREN_ESAMOD_SRV");
			
			/* var sDenIntCap = oView.byId("idDenIntCap");
			var sDenRidCap = oView.byId("idDenRidCap");
			var sDenIntPG = oView.byId("idDenIntPG");
			var sDenRidPG = oView.byId("idDenRidPG"); */

			/* if (sCodStdCap === "000" && sDenIntCap.getValue() !== "" && sDenIntCap.getValue() !== undefined && sDenRidCap.getValue() !== "" &&
				sDenRidCap.getValue() !== undefined && sDenIntPG.getValue() !== "" && sDenIntPG.getValue() !== undefined && sDenRidPG.getValue() !==
				"" && sDenRidPG.getValue() !== undefined) {
				MessageBox.error(this._oResourceBundle.getText("MBErrorCodCapStd"));
			}
			if (sCodStdCap.getValue().toUpperCase() === 'STANDARD') {
				this.oModelPG80.setProperty("/capCodStd", false);
			} */

			debugger		

			if (oDatiAnagraficaPF.PosFinToPropostaNav) {
				delete oDatiAnagraficaPF.PosFinToPropostaNav;
			}
			if (oDatiAnagraficaPF.PropostaSet) {
				delete oDatiAnagraficaPF.PropostaSet;
			}

			var that = this;

			var sPathPF = "/" + oDatiAnagraficaPF.__metadata.uri.split("/")[oDatiAnagraficaPF.__metadata.uri.split("/").length - 1]
			BusyIndicator.show(0);
			//update PosFin
			oGlobalModel.update(sPathPF, oDatiAnagraficaPF, {
				success: function(oResponse, oData) {
					BusyIndicator.hide();
					// that.getView().byId("btnInvioRevocaValidazione").setEnabled(true);
					MessageBox.success(that.getResourceBundle().getText("MBPFSalvataSuccessPagTab"));
				},
				error: function(oError) {
					BusyIndicator.hide();
					MessageBox.error(oError.responseText);
				}
			});		

		},

	});
});

/*  lt --> proposta non serve??!
			//LOGICA UPDATE PROPOSTA
			var oDatiProposta = {
				Fipex: sFipex,
				Flagana: "X"
			};
			var sPathProposta = "/PropostaSet(Keycodepr='" + sKeycodepr + "')";
			oGlobalModel.update(sPathProposta, oDatiProposta, {
				success: function(oResponse, oData) {
					BusyIndicator.hide();
					// MessageBox.success(that._oResourceBundle.getText(""));
				},
				error: function(oError) {
					BusyIndicator.hide();
					MessageBox.error(oError.responseText);
				}
			});	 */	