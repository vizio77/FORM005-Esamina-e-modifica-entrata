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
			this.oResourceBundle = this.getResourceBundle();
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
		},

		//***********************GESTIONE MENU CAPITOLO************************************************
		onPressOpenMenuCapitolo: function(oEvent) {
			if (this.getView().byId("idCapitoloNPF").getValue()) {
				//alert("Cambiare N. Capitolo? Se si il numero attualmente bloccato viene sbloccato.");
				//MESSAGGIO DI AVVISO SBLOCCO DEL CAPITOLO
				/*sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("SbloccoNumCap"), {
					duration: 4000,
					width: "35em",
					my: "center center",
					at: "center center",
					autoClose: false
				});*/
				//INSERIRE CODICE PER GESTIRE LO SBLOCCO DEL CAPITOLO
			}
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
				var oItemMenuItemNuovoCapitolo = oDialog.getAggregation("items")[1];

				oItemMenuItemScegliCapitolo.setVisible(true);
				oItemMenuItemNuovoCapitolo.setVisible(true);
				oDialog.open(oButton);
			});
		},

		handleMenuItemPressCapitolo: function(oEvent) {
			var optionPressed = oEvent.getParameter("item").getText();
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var sCapView = this.getView().byId("idCapitoloNPF").getValue();
			// var sCapPopup = this.getView().byId("idCapitoloNPFPoP").getValue();
			var oDataModel = this.getView().getModel("ZSS4_COBI_PRSP_ESAMOD_SRV");
			var that = this;
			//CREA IL DIALOG UNA SOLA VOLTA
			if (!this._optionCap) {
				this._optionCap = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.PopUpScegliCapitoloNPF",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
					return oDialog;
				});
			}
			//IN QUESTA PARTE VANNO TUTTE LE CONDIZIONI CHE DEVONO ESSERE RIPETUTE TUTTE LE VOLTE CHE SI APRE IL DIALOG
			this._optionCap.then(function(oDialog) {
				//oDialog.getBinding("items");
				// Open ValueHelpDialog filtered by the input's value
				if (optionPressed.toUpperCase() === "SCEGLI CAPITOLO ESISTENTE") {
					if (!sCapView) {
						oView.byId("idCapitoloNPFPoP").setValue("");
						that.getView().byId("idCapitoloNPFPoP").setEditable(true);
						oView.byId("idCapitoloNPFPoP").setShowValueHelp(true);
						oView.byId("idCapitoloNPFPoP").setShowSuggestion(true);

						oView.byId("btnlockNumCap").setText("Scegli");

						oDialog.open(oButton);

					} else {
						MessageBox.warning(that.oResourceBundle.getText("MBCambioNumCap"), {
							icon: MessageBox.Icon.WARNING,
							title: "Cambio Capitolo",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							emphasizedAction: MessageBox.Action.NO,
							onClose: function(oAction) {
								if (oAction === MessageBox.Action.YES) {
									//INSERIRE LOGICA DI SBLOCCO PROPOSTA GIA' PRENOTATO
									//____________
									oView.byId("idCapitoloNPFPoP").setValue("");
									that.getView().byId("idCapitoloNPFPoP").setEditable(true);
									oView.byId("idCapitoloNPFPoP").setShowValueHelp(true);
									oView.byId("idCapitoloNPFPoP").setShowSuggestion(true);

									oView.byId("idCapitoloNPF").setEditable(false);
									oView.byId("idCapitoloNPF").setValue("");
									oView.getModel("modelNuovaPosFin").setProperty("/CAP", "");

									oView.byId("btnlockNumCap").setText("Scegli");

									//PULISCO TUTTI I CAMPI 
									/* oView.byId("idMissioneNPF").setValue("");
									oView.byId("idProgrammaNPF").setValue("");
									oView.byId("idAzioneNPF").setValue("");

									oView.byId("idPGNPF").setValue("");

									oView.byId("idTitoloNPF").setValue("");
									oView.byId("idCategoriaNPF").setValue("");
									oView.byId("idCE2NPF").setValue("");
									oView.byId("idCE3NPF").setValue("");
									

									// oView.byId("idTCRCNPF").setValue("");
									// oView.byId("idTCRFNPF").setValue("");

									oView.byId("idMacroAggregatoNPF").setValue("");
									//lt tipo spesa cap bloccato
				

									oView.byId("idTipoSpesaCapNPF").setSelectedKey("");
									oView.byId("idDenominazioneCapitoloIntNPF").setValue("");
									oView.byId("idDenominazioneCapitoloRidNPF").setValue("");

									oView.byId("idTipoSpesaPGNPF").setSelectedKey("");
									oView.byId("idDenominazionePGIntNPF").setValue("");
									oView.byId("idDenominazionePGRidNPF").setValue("");

									oView.getModel("modelNuovaPosFin").setProperty("/MISS", "");
									oView.getModel("modelNuovaPosFin").setProperty("/PROG", "");
									oView.getModel("modelNuovaPosFin").setProperty("/AZIO", "");
									oView.getModel("modelNuovaPosFin").setProperty("/TIT", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CAT", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CAP", "");
									oView.getModel("modelNuovaPosFin").setProperty("/PG", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CE2", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CE3", "");

									oView.getModel("modelTableCofogNPF").setProperty("/", []); */
									oDialog.open(oButton);
								}
							}

						});
					}
				}
				if (optionPressed.toUpperCase() === "INSERISCI N. CAPITOLO MANUALMENTE") {
					if (!sCapView) {
						oView.byId("idCapitoloNPFPoP").setEditable(true);
						oView.byId("idCapitoloNPFPoP").setValue("");
						oView.byId("idCapitoloNPFPoP").setType("Number");
						oView.byId("idCapitoloNPFPoP").setShowValueHelp(false);
						oView.byId("idCapitoloNPFPoP").setShowSuggestion(false);

						oView.byId("btnlockNumCap").setText("Ok");
						oDialog.open(oButton);
					} else {
						MessageBox.warning(that.oResourceBundle.getText("MBCambioNumCapitolo"), {
							icon: MessageBox.Icon.WARNING,
							title: "Cambio Num. Capitolo",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							emphasizedAction: MessageBox.Action.NO,
							onClose: function(oAction) {
								if (oAction === MessageBox.Action.YES) {
									// alert("ho cliccato ok");
									//INSERIRE LOGICA DI PULIZIA CAMPI PER CAMBIO CAPITOLO GIA' PRENOTATO
									oView.byId("idCapitoloNPFPoP").setEditable(true);
									oView.byId("idCapitoloNPFPoP").setValue("");
									oView.byId("idCapitoloNPFPoP").setType("Number");
									oView.byId("idCapitoloNPFPoP").setShowValueHelp(false);
									oView.byId("idCapitoloNPFPoP").setShowSuggestion(false);
									

									oView.byId("idCapitoloNPF").setEditable(false);
									oView.byId("idCapitoloNPF").setValue("");

									oView.byId("btnlockNumCap").setText("Ok");

									//PULISCO TUTTI I CAMPI RELATIVI ALLA PF
									oView.byId("idMissioneNPF").setValue("");
									oView.byId("idProgrammaNPF").setValue("");
									oView.byId("idAzioneNPF").setValue("");
									oView.byId("idMacroAggregatoNPF").setValue("");
									//lt resetto il tiolo spesa
									oView.byId("idTipoSpesaCapNPF").setSelectedKey("");
									oView.byId("idTitoloNPF").setValue("");
									oView.byId("idCategoriaNPF").setValue("");
									oView.byId("idMissioneNPF").setEditable(true);
									oView.byId("idProgrammaNPF").setEditable(true);
									oView.byId("idAzioneNPF").setEditable(true);
									oView.byId("idMacroAggregatoNPF").setEditable(true);
									oView.byId("idTitoloNPF").setEditable(true);
									oView.byId("idCategoriaNPF").setEditable(true);
									oView.byId("idDenominazioneCapitoloIntNPF").setEditable(true);
									oView.byId("idDenominazioneCapitoloRidNPF").setEditable(true);
									oView.byId("idTipoSpesaCapNPF").setEditable(true);



									oView.byId("idPGNPF").setValue("");
									oView.byId("idCE2NPF").setValue("");
									oView.byId("idCE3NPF").setValue("");

									// oView.byId("idTCRCNPF").setValue("");
									// oView.byId("idTCRFNPF").setValue("");


									oView.byId("idTipoSpesaCapNPF").setSelectedKey("");
									
									oView.byId("idDenominazioneCapitoloIntNPF").setValue("");
									oView.byId("idDenominazioneCapitoloRidNPF").setValue("");

									oView.byId("idTipoSpesaPGNPF").setSelectedKey("");
									oView.byId("idDenominazionePGIntNPF").setValue("");
									oView.byId("idDenominazionePGRidNPF").setValue("");

									oView.getModel("modelNuovaPosFin").setProperty("/MISS", "");
									oView.getModel("modelNuovaPosFin").setProperty("/PROG", "");
									oView.getModel("modelNuovaPosFin").setProperty("/AZIO", "");
									oView.getModel("modelNuovaPosFin").setProperty("/TIT", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CAT", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CAP", "");
									oView.getModel("modelNuovaPosFin").setProperty("/PG", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CE2", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CE3", "");
									oView.getModel("modelNuovaPosFin").setProperty("/Codicetipospcapspe", "");
									oView.getModel("modelNuovaPosFin").setProperty("/Codicetiposppspe", "");

									oDialog.open(oButton);
								}
							}
						});
					}
				}

				if (optionPressed.toUpperCase() === "GENERA N. CAPITOLO AUTOMATICAMENTE") {
					if (!sCapView) {

						//INSERIRE LOGICA GENERAZIONE CAP AUTOMATICA
						oDataModel.callFunction("/GeneraCapitolo", { // function import name
							method: "GET", // http method
							urlParameters: {
								// CodiceCapitolo : sCapPopup
							}, // function import parameters        
							success: function(oData, oResponse) {
								that._Cap = oResponse.data.CodiceCapitolo;

								that.getView().byId("idCapitoloNPFPoP").setValue(that._Cap); // generato automaticamente dal backend
								that.getView().byId("idCapitoloNPFPoP").setEditable(false);
								that.getView().byId("idCapitoloNPFPoP").setShowValueHelp(false);
								that.getView().byId("idCapitoloNPFPoP").setShowSuggestion(false);

								that.getView().byId("btnlockNumCap").setText("Prenota");

								oDialog.open(oButton);
							}, // callback function for success
							error: function(oError) {
									MessageBox.error(oError.responseText);
								} // callback function for error
						});

					} else {
						MessageBox.warning(that.oResourceBundle.getText("MBCambioNumCapitolo"), {
							icon: MessageBox.Icon.WARNING,
							title: "Cambio Num. Capitolo",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							emphasizedAction: MessageBox.Action.NO,
							onClose: function(oAction) {
								if (oAction === MessageBox.Action.YES) {

									//LOGICA DI PULIZIA CAMPI PER CAMBIO CAPITOLO GIA' PRENOTATO
									oView.byId("idCapitoloNPFPoP").setEditable(false);
									oView.byId("idCapitoloNPFPoP").setValue("");
									// oView.byId("idCapitoloNPFPoP").setType("Number");
									oView.byId("idCapitoloNPFPoP").setShowValueHelp(false);
									oView.byId("idCapitoloNPFPoP").setShowSuggestion(false);

									oView.byId("idCapitoloNPF").setEditable(false);
									oView.byId("idCapitoloNPF").setValue("");

									oView.byId("btnlockNumCap").setText("Prenota");

									//PULISCO TUTTI I CAMPI RELATIVI ALLA PF
									oView.byId("idMissioneNPF").setValue("");
									oView.byId("idProgrammaNPF").setValue("");
									oView.byId("idAzioneNPF").setValue("");

									oView.byId("idPGNPF").setValue("");

									oView.byId("idTitoloNPF").setValue("");
									oView.byId("idCategoriaNPF").setValue("");
									oView.byId("idCE2NPF").setValue("");
									oView.byId("idCE3NPF").setValue("");

									// oView.byId("idTCRCNPF").setValue("");
									// oView.byId("idTCRFNPF").setValue("");

									oView.byId("idMacroAggregatoNPF").setValue("");

									oView.byId("idTipoSpesaCapNPF").setSelectedKey("");
									oView.byId("idDenominazioneCapitoloIntNPF").setValue("");
									oView.byId("idDenominazioneCapitoloRidNPF").setValue("");

									oView.byId("idTipoSpesaPGNPF").setSelectedKey("");
									oView.byId("idDenominazionePGIntNPF").setValue("");
									oView.byId("idDenominazionePGRidNPF").setValue("");

									oView.getModel("modelNuovaPosFin").setProperty("/MISS", "");
									oView.getModel("modelNuovaPosFin").setProperty("/PROG", "");
									oView.getModel("modelNuovaPosFin").setProperty("/AZIO", "");
									oView.getModel("modelNuovaPosFin").setProperty("/TIT", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CAT", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CAP", "");
									oView.getModel("modelNuovaPosFin").setProperty("/PG", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CE2", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CE3", "");

									oView.getModel("modelTableCofogNPF").setProperty("/", []);

									//LOGICA GENERAZIONE CAP AUTOMATICA
									oDataModel.callFunction("/GeneraCapitolo", { // function import name
										method: "GET", // http method
										urlParameters: {
											// CodiceCapitolo: sCapPopup
										}, // function import parameters        
										success: function(oData, oResponse) {
											that._Cap = oResponse.data.CodiceCapitolo;

											that.getView().byId("idCapitoloNPFPoP").setValue(that._Cap); // generato automaticamente dal backend
											that.getView().byId("idCapitoloNPFPoP").setEditable(false);
											that.getView().byId("idCapitoloNPFPoP").setShowValueHelp(false);
											that.getView().byId("idCapitoloNPFPoP").setShowSuggestion(false);

											that.getView().byId("btnlockNumCap").setText("Prenota");

											oDialog.open(oButton);
										}, // callback function for success
										error: function(oError) {
												MessageBox.error(oError.responseText);
											} // callback function for error
									});
								}
							}
						});
					}
				}
			});
		},

		onPressLockNumCap: function(e) {
			var sCapitoloSel = this.getView().byId("idCapitoloNPFPoP").getValue();
			// var sCapView = this.getView().byId("idCapitoloNPF").getValue();
			var sBtnPressed = e.getSource().getText();
			// var oButton = e.getSource();
			var oView = this.getView();

			var oLocalModel = oView.getModel("modelPFCapEsistente");
			var oDataModel = this.getView().getModel("ZSS4_COBI_PRSP_ESAMOD_SRV");

			//CASO SCELTA CAP ESISTENTE
			if (sBtnPressed.toUpperCase() === "SCEGLI") {
				oView.byId("idCapitoloNPF").setValue(sCapitoloSel);
				oView.getModel("modelNuovaPosFin").setProperty("/CAP", sCapitoloSel);
				oView.byId("idCapitoloNPF").setEditable(false);

				//BLOCCO MODIFICHE A TUTTI I CAMPI RELATIVI AL CAP
				/* oView.byId("idMissioneNPF").setEditable(false);
				oView.byId("idProgrammaNPF").setEditable(false);
				oView.byId("idAzioneNPF").setEditable(false);

				oView.byId("idTitoloNPF").setEditable(false);
				oView.byId("idCategoriaNPF").setEditable(false);
				oView.byId("idCE2NPF").setEditable(true);
				oView.byId("idCE3NPF").setEditable(true);

				oView.byId("idMacroAggregatoNPF").setEditable(false);
				oView.byId("idDenominazioneCapitoloIntNPF").setEditable(false);
				oView.byId("idDenominazioneCapitoloRidNPF").setEditable(false);
				//lt tipo spesa cap bloccato
				oView.byId("idTipoSpesaCapNPF").setEditable(false);

				oView.byId("colEliminaNPF").setVisible(false);
				oView.byId("idAggiungiRiga").setEnabled(false);
				oView.getModel("modelNuovaPosFin").setProperty("/EDITPERCENT", false);


				// modelCOFOGCapEsistente
				oView.byId("idMissioneNPF").setValue(oLocalModel.getData("/PosFin").Codicemissione);
				oView.getModel("modelNuovaPosFin").setProperty("/MISS", oLocalModel.getData("/PosFin").Codicemissione);
				oView.byId("idProgrammaNPF").setValue(oLocalModel.getData("/PosFin").Codiceprogramma);
				oView.getModel("modelNuovaPosFin").setProperty("/PROG", oLocalModel.getData("/PosFin").Codiceprogramma);
				oView.byId("idAzioneNPF").setValue(oLocalModel.getData("/PosFin").Codiceazione);
				oView.getModel("modelNuovaPosFin").setProperty("/AZIO", oLocalModel.getData("/PosFin").Codiceazione);

				oView.byId("idTitoloNPF").setValue(oLocalModel.getData("/PosFin").Codicetitolo);
				oView.getModel("modelNuovaPosFin").setProperty("/TIT", oLocalModel.getData("/PosFin").Codicetitolo);
				oView.byId("idCategoriaNPF").setValue(oLocalModel.getData("/PosFin").Codicecategoria);
				oView.getModel("modelNuovaPosFin").setProperty("/CAT", oLocalModel.getData("/PosFin").Codicecategoria);

				// oView.byId("idTCRCNPF").setValue(oLocalModel.getData("/PosFin").Numetcrcspe);
				// oView.byId("idTCRFNPF").setValue(oLocalModel.getData("/PosFin").Numetcrfspe);

				//lt metto posizione di spesa
				oView.byId("idMacroAggregatoNPF").setSelectedKey(oLocalModel.getData("/PosFin").Codicetiposppspe);

				oView.byId("idMacroAggregatoNPF").setValue(oLocalModel.getData("/PosFin").Numemacspe);

				//lt inserisco come valore... 
				//oView.byId("idTipoSpesaCapNPF").setValue(oLocalModel.getData("/PosFin").Codicetipospcapspe);
				oView.byId("idTipoSpesaCapNPF").setSelectedKey(oLocalModel.getData("/PosFin").Codicetipospcapspe); */
				oView.byId("idDenominazioneCapitoloIntNPF").setValue(oLocalModel.getData("/PosFin").Descrizionecapitolo);
				oView.byId("idDenominazioneCapitoloRidNPF").setValue(oLocalModel.getData("/PosFin").Descrbrevecap);
		
				oView.byId("NPF_dialogCapitolo").close();

			}

			//CASO SCELTA CAP AUTOMATICA
			if (sBtnPressed.toUpperCase() === "PRENOTA") {

				//METODO CHE GESTISCE IL BLOCCO DEL CAPITOLO SCELTO

				this.getView().byId("idCapitoloNPF").setValue(sCapitoloSel);
				this.getView().byId("idCapitoloNPF").setEditable(false);
				oView.getModel("modelNuovaPosFin").setProperty("/CAP", sCapitoloSel);

				//SBLOCCO MODIFICHE A TUTTI I CAMPI RELATIVI AL CAP
				oView.byId("idMissioneNPF").setEditable(true);
				oView.byId("idProgrammaNPF").setEditable(true);
				oView.byId("idAzioneNPF").setEditable(true);

				oView.byId("idTitoloNPF").setEditable(true);
				oView.byId("idCategoriaNPF").setEditable(true);
				oView.byId("idCE2NPF").setEditable(true);
				oView.byId("idCE3NPF").setEditable(true);

				oView.byId("idMacroAggregatoNPF").setEditable(true);
				oView.byId("idDenominazioneCapitoloIntNPF").setEditable(true);
				oView.byId("idDenominazioneCapitoloRidNPF").setEditable(true);

				oView.byId("idTipoSpesaCapNPF").setEditable(true);

				oView.byId("colEliminaNPF").setVisible(true);
				oView.byId("idAggiungiRiga").setEnabled(true);
				oView.getModel("modelNuovaPosFin").setProperty("/EDITPERCENT", true);

				this.getView().byId("NPF_dialogCapitolo").close();
			}

			var that = this;
			//CASO SCELTA CAP MANUALE
			if (sBtnPressed.toUpperCase() === "OK") {

				if (sCapitoloSel) {
					//LOGICA GENERAZIONE CAP MANUALE
					oDataModel.callFunction("/CreaCapitoloMan", { // function import name
						method: "GET", // http method
						urlParameters: {
							CodiceCapitolo: sCapitoloSel
						}, // function import parameters        
						success: function(oData, oResponse) {
							that._Cap = oResponse.data.CodiceCapitolo;

							that.getView().byId("idCapitoloNPF").setValue(that._Cap); // generato automaticamente dal backend
							that.getView().byId("idCapitoloNPF").setEditable(false);
							that.getView().getModel("modelNuovaPosFin").setProperty("/CAP", sCapitoloSel);

							//SBLOCCO MODIFICHE A TUTTI I CAMPI RELATIVI AL CAP
							oView.byId("idMissioneNPF").setEditable(true);
							oView.byId("idProgrammaNPF").setEditable(true);
							oView.byId("idAzioneNPF").setEditable(true);

							oView.byId("idTitoloNPF").setEditable(true);
							oView.byId("idCategoriaNPF").setEditable(true);
							oView.byId("idCE2NPF").setEditable(true);
							oView.byId("idCE3NPF").setEditable(true);

							oView.byId("idMacroAggregatoNPF").setEditable(true);
							oView.byId("idDenominazioneCapitoloIntNPF").setEditable(true);
							oView.byId("idDenominazioneCapitoloRidNPF").setEditable(true);

							oView.byId("idTipoSpesaCapNPF").setEditable(true);

							oView.byId("colEliminaNPF").setVisible(true);
							oView.byId("idAggiungiRiga").setEnabled(true);
							oView.getModel("modelNuovaPosFin").setProperty("/EDITPERCENT", true);

							that.getView().byId("NPF_dialogCapitolo").close();

						}, // callback function for success
						error: function(oError) {
							//lt parso il messaggio e lo mando all'utente... 
							if(JSON.parse(oError.responseText).error.code === 'SY/530'){
								//mando un warning... non un errore....
								MessageBox.warning(JSON.parse(oError.responseText).error.message.value)
							}else{
								MessageBox.error(oError.responseText);
							}
							} // callback function for error
					});
				}
			}
		},

		onPressCloseScegliCapitoloNPF: function() {
			this.getView().byId("NPF_dialogCapitolo").close();
		},
		//lt torno indietro e prima di farlo resetto lo pseudo modello
		tornaIndietro: function(oEvent){
			//this.getOwnerComponent().setModel(models.getHeaderModelNuovaPosFin(), "modelNuovaPosFin");
			//lt resetto il modello quando torno indietro
			//this.resetFields();
			this.onNavBack();
		},
	});
});