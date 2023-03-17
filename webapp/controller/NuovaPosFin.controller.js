sap.ui.define([
	'zsap/com/r3/cobi/s4/esamodModEntrPosFin/controller/BaseController',
	"sap/ui/core/syncStyleClass",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/MatchCode",
	"zsap/com/r3/cobi/s4/esamodModEntrPosFin/model/models",

], function(BaseController, syncStyleClass, JSONModel, Fragment, Filter, FilterOperator, MessageBox, MatchCode, models) {
	"use strict";

	return BaseController.extend("zsap.com.r3.cobi.s4.esamodModEntrPosFin.controller.NuovaPosFin", {
		MatchCode: MatchCode,
		onInit: function() {

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.oRouter = this.getRouter();
			this.oDataModel = this.getModel();
			this.oResourceBundle = this.getResourceBundle();
			this.oRouter.getRoute("NuovaPosFin").attachMatched(this._onRouteMatched, this);
		},
		//lt match dell'oggetto e vado a resettare il modello
		_onRouteMatched: async function() {	
			this._gestTipologiche();	
			//lt resetto i campi per sicurezza
			this.resetFields();
		},
		resetFields: function(oEvent){
			var oView = this.getView();
			var arrayNoEdit = [ "idPGNPF",
								"idCapitoloNPF",
								"idIDPropostaNPF",
								"idNickNameNPF",
								"idIterNPF"
							];

			var arrayFieldsVis = [							 
							//"idAmm",
							"idCdr",
							"idRagioneria",	
							"idNatura",
							"idCapitoloNPF",
							"idPGNPF",
							"idTitolo",
							"idCategoria",
							"idTipologia",
							"idProvento",
							"idCapoNPF",
							"idDenominazioneCapitoloIntNPF",
							"idDenominazioneCapitoloRidNPF",
							"idDenominazionePGIntNPF",
							"idDenominazionePGRidNPF",
							"idIDPropostaNPF",
							"idNickNameNPF",
							"idIterNPF",
							]
				//var i = 0
			arrayFieldsVis.forEach(el => {
				//i = i+1;
				//console.log(i)
				oView.byId(el).setValue("");
				if(arrayNoEdit.indexOf(el) === -1){
					oView.byId(el).setEditable(true);
				}
			});
			var oModelNuovaPosFin = this.getOwnerComponent().getModel("modelNuovaPosFin");
			oModelNuovaPosFin.setProperty("/AMM", "020")
			oModelNuovaPosFin.setProperty("/DESCAMM", "MINISTERO DELL'ECONOMIA E DELLE FINANZE")
			
			//oView.byId("idAmminNPF").setValue("A020");
			//oView.byId("idCdr").setValue("0001");
			//oView.byId("idRagioneria").setValue("0840");
			
			
			oView.getModel("modelNuovaPosFin").setProperty("/MISS", "");
			oView.getModel("modelNuovaPosFin").setProperty("/PROG", "");
			oView.getModel("modelNuovaPosFin").setProperty("/AZIO", "");
			oView.getModel("modelNuovaPosFin").setProperty("/TIT", "");
			oView.getModel("modelNuovaPosFin").setProperty("/CAT", "");
			oView.getModel("modelNuovaPosFin").setProperty("/CAP", "");
			oView.getModel("modelNuovaPosFin").setProperty("/PG", "");
			oView.getModel("modelNuovaPosFin").setProperty("/CE2", "");
			oView.getModel("modelNuovaPosFin").setProperty("/CE3", "");
			oView.getModel("modelNuovaPosFin").setProperty("/CDR", "");
			oView.getModel("modelNuovaPosFin").setProperty("/DESCCDR", "");
			oView.getModel("modelNuovaPosFin").setProperty("/RAG", "");
			oView.getModel("modelNuovaPosFin").setProperty("/DESCRAG", "");

		},
		//lt torno indietro e prima di farlo resetto lo pseudo modello
		tornaIndietro: function(oEvent){
			this.getOwnerComponent().setModel(models.getHeaderModelNuovaPosFin(), "modelNuovaPosFin");
			//lt resetto il modello quando torno indietro
			this.resetFields();
			this.onNavBack();
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
			var oDataModel = this.getView().getModel("modelOperazionEsaMod");
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
									
									oView.byId("idTitolo").setEditable(true);
									oView.byId("idCategoria").setEditable(true);
									oView.byId("idCapoNPF").setEditable(true);
									
									
									oView.byId("idTitolo").setValue("");
									oView.byId("idCategoria").setValue("");
									oView.byId("idCapoNPF").setValue("");
									
									oView.byId("idDenominazioneCapitoloIntNPF").setEditable(true);
									oView.byId("idDenominazioneCapitoloRidNPF").setEditable(true);
									
									oView.getModel("modelNuovaPosFin").setProperty("/CAP", "");
									oView.getModel("modelNuovaPosFin").setProperty("/TIT", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CAT", "");

									oView.byId("btnlockNumCap").setText("Scegli");

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

									oView.byId("idTitolo").setEditable(true);
									oView.byId("idCategoria").setEditable(true);
									oView.byId("idCapoNPF").setEditable(true);
									
									
									oView.byId("idTitolo").setValue("");
									oView.byId("idCategoria").setValue("");
									oView.byId("idCapoNPF").setValue("");
									
									oView.byId("idDenominazioneCapitoloIntNPF").setEditable(true);
									oView.byId("idDenominazioneCapitoloRidNPF").setEditable(true);
									
									oView.getModel("modelNuovaPosFin").setProperty("/TIT", "");
									oView.getModel("modelNuovaPosFin").setProperty("/CAT", "");
									oView.byId("btnlockNumCap").setText("Prenota");

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
			var oDataModel = this.getView().getModel("modelOperazionEsaMod");

			//CASO SCELTA CAP ESISTENTE
			if (sBtnPressed.toUpperCase() === "SCEGLI") {
				oView.byId("idCapitoloNPF").setValue(sCapitoloSel);
				oView.getModel("modelNuovaPosFin").setProperty("/CAP", sCapitoloSel);
				oView.byId("idCapitoloNPF").setEditable(false);


				oView.byId("idTitolo").setEditable(false);
				oView.byId("idCategoria").setEditable(false);
				oView.byId("idCapoNPF").setEditable(false);
				
				
				oView.byId("idTitolo").setValue(oLocalModel.getData("/PosFin").Codicetitolo);
				oView.getModel("modelNuovaPosFin").setProperty("/TIT", oLocalModel.getData("/PosFin").Codicetitolo);
				oView.byId("idCategoria").setValue(oLocalModel.getData("/PosFin").Codicecategoria);
				oView.getModel("modelNuovaPosFin").setProperty("/CAT", oLocalModel.getData("/PosFin").Codicecategoria);
				oView.byId("idCapoNPF").setValue(oLocalModel.getData("/PosFin").Numecoddettcapoent);

				oView.byId("idDenominazioneCapitoloIntNPF").setEditable(false);
				oView.byId("idDenominazioneCapitoloRidNPF").setEditable(false);

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
				oView.byId("idCategoria").setEditable(true);
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
							oView.byId("idTitolo").setEditable(true);
							oView.byId("idCategoria").setEditable(true);
							oView.byId("idCapoNPF").setEditable(true);
							
							
							oView.byId("idTitolo").setValue("");
							oView.byId("idCategoria").setValue("");
							oView.byId("idCapoNPF").setValue("");
							
							
							oView.byId("idDenominazioneCapitoloIntNPF").setEditable(true);
							oView.byId("idDenominazioneCapitoloRidNPF").setEditable(true);
							
							oView.getModel("modelNuovaPosFin").setProperty("/TIT", "");
							oView.getModel("modelNuovaPosFin").setProperty("/CAT", "");
							

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

		//***********************GESTIONE MENU PG************************************************

		onPressOpenMenuPG: function(oEvent) {

			if (this.getView().byId("idPGNPF").getValue()) {

				//INSERIRE CODICE PER GESTIRE LO SBLOCCO DEL PG
			}
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var that = this;
			// create menu only once
			if (!this._menuPG) {
				this._menuPG = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.MenuPGNPF",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
					return oDialog;
				});
			}
			// ACTIONS REPEATED EVERY TIME
			this._menuPG.then(function(oDialog) {

				var eDock = sap.ui.core.Popup.Dock;
				oDialog.open(that._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);

				// var oItemMenuItemScegliPG = this._menuPG.getAggregation("items")[0];
				var oItemMenuItemNuovoPG = oDialog.getAggregation("items")[0];

				// oItemMenuItemScegliPG.setVisible(true);
				oItemMenuItemNuovoPG.setVisible(true);
				oDialog.open(oButton);
			});
		},

		handleMenuItemPressPG: function(oEvent) {
			var optionPressed = oEvent.getParameter("item").getText();
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var oDataModel = this.getView().getModel("modelOperazionEsaMod");
			var sPGVal = this.getView().byId("idPGNPF").getValue();
			var that = this;
			//CREA IL DIALOG UNA SOLA VOLTA
			if (!this._optionPG) {
				this._optionPG = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.PopUpScegliPGNPF",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
					return oDialog;
				});
			}
			//IN QUESTA PARTE VANNO TUTTE LE CONDIZIONI CHE DEVONO ESSERE RIPETUTE TUTTE LE VOLTE CHE SI APRE IL DIALOG
			this._optionPG.then(function(oDialog) {

				if (optionPressed.toUpperCase() === "INSERISCI N. ARTICOLO MANUALMENTE") {
					if (!sPGVal) {
						oView.byId("idPGNPFPoP").setEditable(true);
						oView.byId("idPGNPFPoP").setValue("");

						oView.byId("btnlockNumPG").setText("Scegli");
						oDialog.open(oButton);
					} else {
						MessageBox.warning(that.oResourceBundle.getText("MBCambioNumPG"), {
							icon: MessageBox.Icon.WARNING,
							title: "Cambio PG",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							emphasizedAction: MessageBox.Action.NO,
							onClose: function(oAction) {
								if (oAction === MessageBox.Action.YES) {
									//INSERIRE LOGICA DI SBLOCCO PROPOSTA GIA' PRENOTATO
									//____________
									oView.byId("idPGNPFPoP").setEditable(true);
									oView.byId("idPGNPFPoP").setValue("");
									oView.byId("idPGNPFPoP").setType("Number");
									oView.byId("idPGNPF").setEditable(false);
									oView.byId("idPGNPF").setValue("");

									oView.byId("btnlockNumPG").setText("Scegli");

									oDialog.open(oButton);
								}
							}
						});
					}
				}
				if (optionPressed.toUpperCase() === "GENERA N. ARTICOLO AUTOMATICAMENTE") {
					var sCap = oView.byId("idCapitoloNPF").getValue();
					//LOGICA DI CONTROLLO CAMBIO PG GIA' INSERITO
					if (sPGVal === "" || sCap === "") {
						//LOGICA PER GENERARE NUOVO PG AUTOMATICAMENTE
						oDataModel.callFunction("/GeneraPG", { // function import name
							method: "GET", // http method
							urlParameters: {
								"CodiceCapitolo": that.getView().byId("idCapitoloNPF").getValue()
							}, // function import parameters        
							success: function(oData, oResponse) {
								that._PG = oResponse.data.CodicePg;

								that.getView().byId("idPGNPFPoP").setValue(that._PG); // generato automaticamente dal backend
								that.getView().byId("idPGNPFPoP").setEditable(false);

								that.getView().byId("btnlockNumPG").setText("Prenota");

								oDialog.open(oButton);
							}, // callback function for success
							error: function(oError) {
									MessageBox.error(oError.responseText);
								} // callback function for error
						});
					} else {
						MessageBox.warning(that.oResourceBundle.getText("MBCambioNumPG"), {
							icon: MessageBox.Icon.WARNING,
							title: "Cambio PG",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							emphasizedAction: MessageBox.Action.NO,
							onClose: function(oAction) {
								if (oAction === MessageBox.Action.YES) {
									//INSERIRE LOGICA DI SBLOCCO PROPOSTA GIA' PRENOTATO
									//____________
									that.getView().byId("idPGNPFPoP").setValue(""); // generato automaticamente dal backend
									that.getView().byId("idPGNPFPoP").setEditable(false);

									that.getView().byId("idPGNPF").setValue("");
									that.getView().byId("idPGNPF").setEditable(false);

									that.getView().byId("btnlockNumPG").setText("Prenota");
									if (sCap) {
										oDataModel.callFunction("/GeneraPG", { // function import name
											method: "GET", // http method
											urlParameters: {
												"CodiceCapitolo": that.getView().byId("idCapitoloNPF").getValue()
											}, // function import parameters        
											success: function(oData, oResponse) {
												that._PG = oResponse.data.CodicePg;

												that.getView().byId("idPGNPFPoP").setValue(that._PG); // generato automaticamente dal backend
												that.getView().byId("idPGNPFPoP").setEditable(false);

												that.getView().byId("btnlockNumPG").setText("Prenota");

												oDialog.open(oButton);
											}, // callback function for success
											error: function(oError) {
													MessageBox.error(oError.responseText);
												} // callback function for error
										});
									}
								}
							}
						});
					}
				}
			});
		},

		onPressLockNumPG: function(e) {
			var sPGSel = this.getView().byId("idPGNPFPoP").getValue();
			var sBtnPressed = e.getSource().getText();
			// var sPrctr = this.getView().byId("idAmminNPF").getValue();
			// var sPgView = this.getView().byId("idPGNPF");
			var oDataModel = this.getView().getModel("modelOperazionEsaMod");
			var that = this;

			if (sBtnPressed.toUpperCase() === "SCEGLI") {
				//CASO SCELTA PROPOSTA MANUALE
				var sCap = this.getView().byId("idCapitoloNPF").getValue();
				//LOGICA DI CONTROLLO ID SCELTO
				if (sCap) {
					oDataModel.callFunction("/CreaPGManualmente", { // function import name
						method: "GET", // http method
						urlParameters: {
							"CodicePg": sPGSel,
							"CodiceCapitolo": that.getView().byId("idCapitoloNPF").getValue()
						}, // function import parameters        
						success: function(oData, oResponse) {
							// console.log(oResponse.statusText);
							that._CodicePg = oResponse.data.CodicePg;
							that.getView().byId("idPGNPFPoP").setValue(that._CodicePg); // generato automaticamente dal backend
							that.getView().byId("idPGNPFPoP").setEditable(false);
							// that.getView().getModel("modelNuovaPosFin").setProperty("PG", that._PG);

							that.getView().byId("idPGNPF").setValue(that._CodicePg);
							that.getView().byId("idPGNPF").setEditable(false);
							that.getView().byId("idPGNPFPoP").setValue("");
							that.getView().getModel("modelNuovaPosFin").setProperty("/PG", that._CodicePg);
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
					//LOGICA DI BLOCCO PG DA INSERIRE

					this.getView().byId("NPF_dialogScegliPG").close();
				}
			}
			if (sBtnPressed.toUpperCase() === "PRENOTA") {
				var sNumPGCreato = this.getView().byId("idPGNPFPoP").getValue();

				//INSERIRE METODO CHE GESTISCE IL BLOCCO DEL PG SCELTO

				this.getView().byId("idPGNPF").setValue(sNumPGCreato);
				this.getView().byId("idPGNPF").setEditable(false);
				this.getView().getModel("modelNuovaPosFin").setProperty("/PG", sNumPGCreato);

				this.getView().byId("NPF_dialogScegliPG").close();
			}
		},

		onPressCloseScegliPGNPF: function() {
			this.getView().byId("NPF_dialogScegliPG").close();
		},

		/* 
		PROPOSTA
		*/
		handlePressOpenMenu: function(oEvent) {
			if (this.getView().byId("idIDPropostaNPF").getValue()) {
				//alert("Cambiare Proposta? Se si la proposta attualmente bloccato viene sbloccata.");
			}
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var that = this;
			// create menu only once
			if (!this._menu) {
				this._menu = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.GestisciID_idPropostaMenu",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
					return oDialog;
				});
			}
			// ACTIONS REPEATED EVERY TIME
			this._menu.then(function(oDialog) {
				//oDialog.getBinding("items");
				// Open ValueHelpDialog filtered by the input's value
				var eDock = sap.ui.core.Popup.Dock;
				oDialog.open(that._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);

				//var sTitle = that.getView().byId("idPanelForm").getHeaderText();
				var sTitle = "CREA PROPOSTA"; //lt inserisco la creazione perchè in creazione
				var oItemMenuIdEsistente = oDialog.getAggregation("items")[0];
				var oItemMenuIdNuovo = oDialog.getAggregation("items")[1];
				if (sTitle.toUpperCase() === "CREA PROPOSTA") {
					oItemMenuIdEsistente.setVisible(true);// inserisco anche la gestione a true
				}
				oDialog.open(oButton);
			});
		},

		handleMenuItemPress: function(oEvent) {
			var optionPressed = oEvent.getParameter("item").getText();
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var oDataModel = this.getView().getModel("modelOperazionEsaMod");
			var sIdProposta = this.getView().byId("idIDPropostaNPF").getValue();
			var that = this;
			//CREA IL DIALOG UNA SOLA VOLTA
			if (!this._optionIdProposta) {
				this._optionIdProposta = Fragment.load({
					id: oView.getId(),
					name: "zsap.com.r3.cobi.s4.esamodModEntrPosFin.view.fragment.GestisciID_inputIDProposta",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
					return oDialog;
				});
			}
			//IN QUESTA PARTE VANNO TUTTE LE CONDIZIONI CHE DEVONO ESSERE RIPETUTE TUTTE LE VOLTE CHE SI APRE IL DIALOG
			this._optionIdProposta.then(function(oDialog) {
				//oDialog.getBinding("items");
				// Open ValueHelpDialog filtered by the input's value

				if (optionPressed.toUpperCase() === "SCEGLI PROPOSTA ESISTENTE") {
					if (!sIdProposta) {
						that.getView().byId("IdProposta").setValue("");
						that.getView().byId("IdProposta").setShowValueHelp(true);
						that.getView().byId("IdProposta").setEnabled(true);
						that.getView().byId("btnlockId").setText("Ok");
						oDialog.open(oButton);
					} else {
						MessageBox.warning(that.oResourceBundle.getText("MBCambioNumProposta"), {
							icon: MessageBox.Icon.WARNING,
							title: "Cambio Proposta",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							emphasizedAction: MessageBox.Action.NO,
							onClose: function(oAction) {
								if (oAction === MessageBox.Action.YES) {
									//INSERIRE LOGICA DI SBLOCCO PROPOSTA GIA' PRENOTATO
									//____________
									that.getView().byId("IdProposta").setValue("");
									that.getView().byId("IdProposta").setShowValueHelp(true);
									that.getView().byId("IdProposta").setEnabled(true);
									that.getView().byId("btnlockId").setText("Ok");

									oDialog.open(oButton);
								}
							}
						});
					}
				}
				if (optionPressed.toUpperCase() === "INSERISCI PROPOSTA MANUALMENTE") {
					if (!sIdProposta) {
						that.getView().byId("IdProposta").setEnabled(true);
						that.getView().byId("IdProposta").setValue("");
						that.getView().byId("IdProposta").setShowValueHelp(false);
						that.getView().byId("btnlockId").setText("Scegli");
						oDialog.open(oButton);
					} else {
						MessageBox.warning(that.oResourceBundle.getText("MBCambioNumProposta"), {
							icon: MessageBox.Icon.WARNING,
							title: "Cambio Proposta",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							emphasizedAction: MessageBox.Action.NO,
							onClose: function(oAction) {
								if (oAction === MessageBox.Action.YES) {
									//INSERIRE LOGICA DI SBLOCCO PROPOSTA GIA' PRENOTATO
									//____________
									that.getView().byId("idIDPropostaNPF").setValue("");
									that.getView().byId("idNickNameNPF").setValue("");
									//lt
									//that.getView().byId("idNota").setValue("");
									that.getView().byId("idIterNPF").setSelectedItem(null);
									//that.getView().byId("idTablePosFinGestisciID").unbindAggregation("items");
									that.getView().byId("btnlockId").setText("Scegli");

									oDialog.open(oButton);
								}
							}
						});
					}
				}
				if (optionPressed.toUpperCase() === "GENERA PROPOSTA AUTOMATICAMENTE") {
					var oModel = models.getModelDefaultGeneraIdProposta();
					var oData = oModel.getData();
					// var listFilters = [];
					// listFilters.push(new Filter("Fikrs", FilterOperator.EQ, oData.Fikrs));
					// listFilters.push(new Filter("Anno", FilterOperator.EQ, oData.Anno));
					// listFilters.push(new Filter("Fase", FilterOperator.EQ, oData.Fase));
					// listFilters.push(new Filter("Reale", FilterOperator.EQ, oData.Reale));
					// listFilters.push(new Filter("Versione", FilterOperator.EQ, oData.Versione));
					// listFilters.push(new Filter("Prctr", FilterOperator.EQ, oData.Prctr));
					var newPrctr = "'" + oData.Prctr + "'";
					//LOGICA DI CONTROLLO CAMBIO ID GIA' INSERITO
					if (!sIdProposta) {
						//LOGICA PER GENERARE NUOVA ID AUTOMATICAMENTE
						oDataModel.read("/GeneraIdProposta", { // function import name
							method: "GET", // http method
							urlParameters: {
								"Prctr": newPrctr
							},
							success: function(oData, oResponse) {
								that._Id = oResponse.data.Idproposta;
								that.Keycode = oResponse.data.Keycodepr;
								// console.log(that._Id);
								that.getView().byId("IdProposta").setValue(that._Id); // generato automaticamente dal backend
								that.getView().byId("IdProposta").setEnabled(false);
								that.getView().byId("IdProposta").setShowValueHelp(false);
								that.getView().byId("btnlockId").setText("Prenota");

								oDialog.open(oButton);
							}, // callback function for success
							error: function(oError) {
									MessageBox.error(oError.responseText);
								} // callback function for error
						});
					} else {
						MessageBox.warning(that.oResourceBundle.getText("MBCambioNumProposta"), {
							icon: MessageBox.Icon.WARNING,
							title: "Cambio Proposta",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							emphasizedAction: MessageBox.Action.NO,
							onClose: function(oAction) {
								if (oAction === MessageBox.Action.YES) {
									//INSERIRE LOGICA DI SBLOCCO PROPOSTA GIA' PRENOTATO
									//____________
									that.getView().byId("idIDPropostaNPF").setValue("");
									that.getView().byId("idNickNameNPF").setValue("");
									//lt
									//that.getView().byId("idNota").setValue("");
									that.getView().byId("idIterNPF").setSelectedItem(null);
									//that.getView().byId("idTablePosFinGestisciID").unbindAggregation("items");

									var oModel = models.getModelDefaultGeneraIdProposta();
									var oData = oModel.getData();

									var newPrctr = "'" + oData.Prctr + "'";
									//LOGICA DI CONTROLLO CAMBIO ID GIA' INSERITO

									oDataModel.callFunction("/GeneraIdProposta", { // function import name
										method: "GET", // http method
										urlParameters: {
											"Prctr": newPrctr
										},
										success: function(oData, oResponse) {
											that._Id = oResponse.data.Idproposta;
											that.Keycode = oResponse.data.Keycodepr;
											that.getView().byId("IdProposta").setValue(that._Id); // generato automaticamente dal backend
											// that.getView().byId("IdProposta").setEditable(false);
											that.getView().byId("IdProposta").setShowValueHelp(false);
											that.getView().byId("btnlockId").setText("Prenota");
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

		lockId: async function(oEvt) {
			var sBtnText = oEvt.getSource().getText();
			var sIdPropostaInserito = this.getView().byId("IdProposta").getValue();
			var oDataModel = this.getView().getModel("modelOperazionEsaMod");
			var that = this;
			var aDataTipo = sap.ui.getCore().getModel("gestTipologicheModel").getData();
			if (sBtnText === "Ok") {
				this.getView().byId("idIDPropostaNPF").setValue(sIdPropostaInserito);
				this.getView().byId("idFragment_GestisciID_InputIdProposta").close();
				this.getView().byId("IdProposta").setValue("");

				var oModelGestisciProposta = this.getView().getModel("modelPathGestisciPropostaView").getData("dataGestisciProposta").dataGestisciProposta;
				if (!!oModelGestisciProposta) {
					var oKeyCode = oModelGestisciProposta.Keycode;

					//GET testo Nota
					var aFilters = [new Filter("Keycodepr", FilterOperator.EQ, oKeyCode)];
                    aFilters.push(new Filter("Anno", FilterOperator.EQ, aDataTipo.ANNO));
                    aFilters.push(new Filter("Fase", FilterOperator.EQ, aDataTipo.FASE));
                    aFilters.push(new Filter("Reale", FilterOperator.EQ, aDataTipo.REALE_RIF));
                    //aFilters.push(new Filter("Versione", FilterOperator.EQ, aDataTipo.Versione));
                    //aFilters.push(new Filter("Fikrs", FilterOperator.EQ, aDataTipo.Fikrs));
                    
					aFilters.push(new Filter("Eos", FilterOperator.EQ, "E"));


					var aRes = await this.readFromDb("2", "/PropostaSet", aFilters, [], "");
					// var aFilters = [new Filter("Idproposta", FilterOperator.EQ, oKeyCode)];
					oDataModel.read("/PropostaSet", { // function import name
						filters: aFilters, // function import parameters        
						success: function(oData, oResponse) {
							var oNota = "";
							var response;
							if (oData.results.length > 0) {
								oNota = oData.results[0].Testonota;
								response = oData.results[0]
							}

							//Gestione Input
							var oNickname = oModelGestisciProposta.Nickname;
							this.getView().byId("idNickNameNPF").setValue(oNickname);
							this.getView().getModel("modelChangeControlsStatus").setProperty("/Visible", true);
							this.getView().byId("idNickNameNPF").setEditable(false);
							var oIter = oModelGestisciProposta.Iter;

							if(response){
								//lt chiedere se va bene così
								oIter = response.Desciter
								this.Keycode = response.Keycodepr
							}
							
							this.getView().byId("idIterNPF").setSelectedKey("01");
							this.getView().byId("idIterNPF").setValue(oIter);
							//lt
							//this.getView().byId("idNota").setValue(oNota);

							this.getView().getModel("modelChangeControlsStatus").setProperty("/Enable", true);

						}.bind(this), // callback function for success
						error: function(oError) {
								MessageBox.error(JSON.parse(oError.responseText).error.message.value);
								this.getView().byId("idIDPropostaNPF").setValue("");
								this.getView().byId("IdProposta").setValue("");
								this.getView().getModel("modelChangeControlsStatus").setProperty("/Enable", false);
								this.getView().getModel("modelChangeControlsStatus").setProperty("/Editable", false);
							}.bind(this) // callback function for error
					});
					//this.getView().byId("idNota").setEditable(true);
				}
			}

			if (sBtnText === "Prenota") {
				//CASO SCELTA PROPOSTA AUTOMATICA
				//LOGICA DI BLOCCO ID DA INSERIRE
				this.getView().getModel("modelChangeControlsStatus").setProperty("/Enable", true);
				this.getView().getModel("modelChangeControlsStatus").setProperty("/Editable", true);

				this.getView().byId("IdProposta").setValue("");
				this.getView().byId("idIDPropostaNPF").setValue(sIdPropostaInserito);

				//GESTIONE ITER IN LAVORAZIONE (STATO DEFAULT) 
				this.getView().getModel("modelChangeControlsStatus").setProperty("/Iter", false);
				this.getView().byId("idIterNPF").setValue("Proposta in lavorazione");
				this.getView().byId("idIterNPF").setSelectedKey("01");

				this.getView().byId("idFragment_GestisciID_InputIdProposta").close();

			}

			if (sBtnText === "Scegli") {
				//CASO SCELTA PROPOSTA MANUALE
				//LOGICA DI CONTROLLO ID SCELTO
				if (sIdPropostaInserito) {
					oDataModel.callFunction("/CreaIdPropostaManualmente", { // function import name
						method: "GET", // http method
						urlParameters: {
							"Idproposta": sIdPropostaInserito
						}, // function import parameters        
						success: function(oData, oResponse) {
							// console.log(oResponse.statusText);
							that._Id = oResponse.data.Idproposta;
							that.Keycode = oResponse.data.Keycodepr;
							that.getView().byId("idIDPropostaNPF").setValue(that._Id); // generato automaticamente dal backend
							// that.getView().byId("IdProposta").setEditable(false);

							that.getView().byId("IdProposta").setShowValueHelp(false);
							//LOGICA DI BLOCCO ID DA INSERIRE
							this.getView().byId("idIDPropostaNPF").setValue(sIdPropostaInserito);
							this.getView().byId("IdProposta").setValue(sIdPropostaInserito);
							this.getView().getModel("modelChangeControlsStatus").setProperty("/Enable", true);
							this.getView().getModel("modelChangeControlsStatus").setProperty("/Editable", true);

							//GESTIONE ITER IN LAVORAZIONE (STATO DEFAULT) 
							this.getView().getModel("modelChangeControlsStatus").setProperty("/Iter", false);
							this.getView().byId("idIterNPF").setValue("Proposta in lavorazione");
							this.getView().byId("idIterNPF").setSelectedKey("01");
						}.bind(this), // callback function for success
						error: function(oError) {
								MessageBox.error(JSON.parse(oError.responseText).error.message.value);
								this.getView().byId("idIDPropostaNPF").setValue("");
								this.getView().byId("IdProposta").setValue("");
								this.getView().getModel("modelChangeControlsStatus").setProperty("/Enable", false);
								this.getView().getModel("modelChangeControlsStatus").setProperty("/Editable", false);
							}.bind(this) // callback function for error
					});

					this.getView().byId("idFragment_GestisciID_InputIdProposta").close();
				}

			}
			//GESTIRE LOGICA CAMBIO ID SE GIA' INSERITO --> prenderla da gestione capitolo anagrafica
			/*var oModelChangeControlsStatus = this.getView().getModel("modelChangeControlsStatus");
			if (sIdProposta) {
				oModelChangeControlsStatus.setProperty("/Enable", true);
				oModelChangeControlsStatus.setProperty("/Visible", true);
				oModelChangeControlsStatus.setProperty("/Editable", true);
				// this.getView().byId("openMenu").setEnabled(true);

				// this.getView().byId("idIDPropostaNPF").setValue(sIdPropostaInserito);
				// this.getView().byId("idFragment_GestisciID_InputIdProposta").close();
				this.getView().byId("IdProposta").setValue("");
			} else {
				oModelChangeControlsStatus.setProperty("/Enable", false);
				oModelChangeControlsStatus.setProperty("/Visible", false);
				oModelChangeControlsStatus.setProperty("/Editable", false);
				// this.getView().byId("openMenu").setEnabled(true);
			}*/

		},

		close: function() {
			var sIdProposta = this.getView().byId("idIDPropostaNPF").getValue();
			var oModelChangeControlsStatus = this.getView().getModel("modelChangeControlsStatus");
			if (sIdProposta) {
				oModelChangeControlsStatus.setProperty("/Enable", true);
				oModelChangeControlsStatus.setProperty("/Visible", true);
				oModelChangeControlsStatus.setProperty("/Editable", true);
				this.getView().byId("openMenu").setEnabled(true);

			} else {
				oModelChangeControlsStatus.setProperty("/Enable", false);
				oModelChangeControlsStatus.setProperty("/Visible", false);
				oModelChangeControlsStatus.setProperty("/Editable", false);
				this.getView().byId("openMenu").setEnabled(true);
			}
			this.getView().byId("idFragment_GestisciID_InputIdProposta").close();
			this.getView().byId("IdProposta").setValue("");
			this.getView().byId("idIDPropostaNPF").setValue("");
		},

		//GESTIONE SALVATAGGIO DATI AL SALVA DI NPF
		onPressSalvaNPF: function(e) {
				var oView = this.getView();
				var that = this;
				var oGlobalModel = oView.getModel("modelOperazionEsaMod");		
				
				
				//POSIZIONE FINANZIARIA
				var sPosFin = oView.byId("idPopPosFin").getText();
				var sAmministrazione = oView.byId("idAmm").getValue();
				var sAmmin = sAmministrazione.substring(1);
				var sCdr = oView.byId("idCdr").getValue();
				var sRagioneria = oView.byId("idRagioneria").getValue();
				var sNatura = oView.byId("idNatura").getValue();
				var sCapitolo = oView.byId("idCapitoloNPF").getValue();
				var sPg = oView.byId("idPGNPF").getValue();
				var sTitolo = oView.byId("idTitolo").getValue();
				var sCategoria = oView.byId("idCategoria").getValue();
				var sTipologia = oView.byId("idTipologia").getValue();
				var sCodiceprovento = oView.byId("idProvento").getValue();
				var sCapo = oView.byId("idCapoNPF").getValue();
				var sDenominazioneCapitoloInt = oView.byId("idDenominazioneCapitoloIntNPF").getValue();
				var sDenominazioneCapitoloRid = oView.byId("idDenominazioneCapitoloRidNPF").getValue();
				var sDenominazionePGInt = oView.byId("idDenominazionePGIntNPF").getValue();
				var sDenominazionePGRid = oView.byId("idDenominazionePGRidNPF").getValue();

				//PROPOSTA
				var sProposta = oView.byId("idIDPropostaNPF").getValue();
				var sKeycodepr = this.Keycode;
				var sTipo, sIter;
				if(oView.byId("idIterNPF").getVisible()) {
					sIter = oView.byId("idIterNPF").getSelectedKey();
				} else {
					sIter = "01";
				}
				var sNickName = oView.byId("idNickNameNPF").getValue();

				//lt uso il modello gestTipologiche perchè è recyoerato dal servizio.
				//eliminare il modelDefaultPosFinToPropostaNav perchè creato hardcoded
				var aDataTipo = sap.ui.getCore().getModel("gestTipologicheModel").getData();
				
				var aDatiProp = [{
					Fikrs: aDataTipo.Fikrs,
					Anno: aDataTipo.ANNO,
					Fase: aDataTipo.FASE,
					Versione: aDataTipo.Versione,
					Fipex: sPosFin,
					Eos: "E",
					Idproposta: sProposta,
					Keycodepr: sKeycodepr,
					Prctr: aDataTipo.Prctr,
					Reale:aDataTipo.REALE_RIF,
					Iter: sIter,
					Nickname: sNickName,
				}];				
							

				var oDati = {
					Fikrs: "S001",
					Anno: "",
					Fase: "DLB",
					Reale: "",
					Versione: "P",
					Fipex: sPosFin,
					Eos: "E",
					Codicenatura: sNatura,
					Prctr: sAmministrazione,
					Codiceammin: sAmmin,
					Codicecdr: sCdr,
					Codiceragioneria: sRagioneria,
					Codicecapitolo: sCapitolo,
					Codicepg: sPg,
					Codicetitolo: sTitolo,
					Codicecategoria: sCategoria,					
					Codiceprovento: sCodiceprovento,
					Numecoddettcapoent: sCapo,
					Descrizionecapitolo: sDenominazioneCapitoloInt,
					Descrbrevecap: sDenominazioneCapitoloRid,
					Codicetipologia: sTipologia,
					Descrizionepg: sDenominazionePGInt,
					Descrbrevepg: sDenominazionePGRid,
					PosFinToPropostaNav: aDatiProp
				};
				

				if(!this.checkFieldsRequired(oDati, aDatiProp[0])) return;
				
				oGlobalModel.create("/PosFinSet", oDati, {
					success: function(oData, oResponse) {
						//lt faccio comparire un messagebox e poi resetto il modello.
						sap.m.MessageBox.success(that.oResourceBundle.getText("MBCreateSuccessPF", [oData.Fipex]), {
							actions: [MessageBox.Action.CLOSE],
							emphasizedAction: "Manage Products",
							onClose: function (sAction) {
								that.resetFields();
							}
						});

					}.bind(this),
					error: function(oError) {
						sap.m.MessageBox.error(that.oResourceBundle.getText("MBCreateError"));
					}
				});
			
			},

		
			checkFieldsRequired: function(oDatiPos, oDatiProp){
				var ritorno = true;
				const fieldsToCheckPos = [ 
					{ field : "Prctr"  					,label : "Amministrazione"}, 
					{ field : "Codicecdr"  				,label : "CdR"}, 
					{ field : "Codiceragioneria"  		,label : "Ragioneria"},
					{ field : "Codicenatura"  		    ,label : "Natura"}, 
					{ field : "Codicecapitolo"  		,label : "Capitolo"},
					{ field : "Codicepg"  				,label : "Pg"}, 
					{ field : "Codicetitolo"  			,label : "Titolo"},
					{ field : "Codicecategoria"  		,label : "Categoria"}, 
					{ field : "Codicetipologia"  		,label : "Tipologia"}, 
					{ field : "Codiceprovento"  	    ,label : "Provento"},
					{ field : "Descrizionecapitolo"  	,label : "Denominazione Capitolo integrale"},
					{ field : "Descrbrevecap"  			,label : "Denominazione Capitolo ridotta"},
					{ field : "Descrbrevepg"  			,label : "Denominazione PG ridotta"},
					{ field : "Descrizionepg"  			,label : "Denominazione PG integrale"}, 
				];
				const fieldsToCheckProp = [ 
					{ field : "Idproposta"  			,label : "Proposta"}, 
					{ field : "Nickname"  				,label : "NickName"}, 
					{ field : "Iter"  					,label : "Iter Proposta"},					
				];

				var message = ""
				fieldsToCheckPos.forEach(el => {
						if(!oDatiPos[el.field]){
							message = message + "\n" + el.label
						}				
				});

				fieldsToCheckProp.forEach(el => {
						if(!oDatiProp[el.field]){
							message = message + "\n" + el.label
						}				
				});

				if(message !== ""){		
					message = `${this.oResourceBundle.getText("MBListaCampiObb")} ${message}`
					sap.m.MessageBox.warning(message);
					ritorno = false
				}

				return ritorno;
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