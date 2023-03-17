sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function(JSONModel, Device, Filter, FilterOperator) {
	"use strict";

	return {

		onChange: function(oEvent, inputRef) {
			var sSelectedVal;

			if (inputRef === "Amministrazione") {
				sSelectedVal = oEvent.getParameters().value;
				if (sSelectedVal === "" || sSelectedVal === undefined) {
					this._resetInput("idCdr");
					this._resetInput("idRagioneria");
			 
				}
			}

			if (inputRef === "CentroResp") {
				sSelectedVal = oEvent.getParameters().value;
				if (sSelectedVal === "" || sSelectedVal === undefined) {
					this._resetInput("idCdr");
				}
			}

			if (inputRef === "Tipologia") {
				sSelectedVal = oEvent.getParameters().value;
				if (sSelectedVal === "" || sSelectedVal === undefined) {
					this._resetInput("idProvento");
			 
				}
			}

		 

	 

			if (inputRef === "Titolo") {
				sSelectedVal = oEvent.getParameters().value;
				if (sSelectedVal === "" || sSelectedVal === undefined) {
					this._resetInput("idProvento");
					this._resetInput("idCategoria");
					this._resetInput("idTipologia");
				}
			}

			if (inputRef === "Categoria") {
				sSelectedVal = oEvent.getParameters().value;
				if (sSelectedVal === "" || sSelectedVal === undefined) {
					this._resetInput("idTipologia");
					this._resetInput("idProvento");
				}
			}

		 
		},

		onValueHelpRequest: function(oEvent, inputRef, that) {
			var sInputValue, aOrFiltersCond, aFilters;
			var sAmminVal, sMissioneVal, sProgrammaVal;
			var sTitoloVal, sCategoriaVal, sCE2Val;
			var fAmm, fMiss, fProg, fTit, fCat, fCe2, fCap;
			var sCapitoloVal;
			var oModelConi = that.getView().getModel("modelConoVisibilita");
			var oModelGlobal = that._getDbModel("3");
			this.oModelGlobal = that._getDbModel("3");
			this.Ref = that;
			var arrayProperties = [];
			sInputValue = oEvent.getSource().getValue();
			// var oView = that.getView();

			var sAmmi = that.getView().byId("idAmm").getValue()

			if (inputRef === "idCapitoloNPFPoP") {
				sAmminVal = that.getView().byId("idAmm").getValue();

				if(!sAmminVal || sAmminVal === "") {
					MessageBox.warning(that.getResourceBundle().getText("selezionarePrimaAmm"))
					return;
				}

				if (!that.idCapitoloNPFPoP) {
					that.idCapitoloNPFPoP = this.createValueHelpDialog(
						"Capitolo",
						oModelGlobal,
						"",
						"{i18n>Capitolo}",
						"/AF_CapitoloSet",
						"Codicecapitolo",
						"Descrizionecapitolo", that);
				}

				// Create a filter for the binding
				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Codicecapitolo", FilterOperator.Contains, sInputValue),
							new Filter("Descrizionecapitolo", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				// non dovrebbe succedere ma evita il dump su BE nel caso fosse null
				aFilters = this.createAddFilter(aOrFiltersCond);
				if (sAmminVal !== undefined && sAmminVal !== "") {
					fAmm = new Filter("Prctr", FilterOperator.EQ, sAmminVal);
					aFilters.aFilters.push(fAmm);
				}
				that.idCapitoloNPFPoP.getBinding("items").filter(aFilters);
				// Open ValueHelpDialog filtered by the input's value
				that.idCapitoloNPFPoP.open(sInputValue);
			}

			if (inputRef === "Amministrazione") {

				if (!that.AmministrazioneHelpDialog) {
					that.AmministrazioneHelpDialog = this.createValueHelpDialog(
						"Amministrazione",
						oModelConi,
						"modelConoVisibilita",
						"{i18n>Amministrazione}",
						"/AF_AmministrazioneSet",
						"Prctr",
						"Descrestesa", that);
				}
				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Prctr", FilterOperator.Contains, sInputValue),
							new Filter("Descrestesa", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				that.AmministrazioneHelpDialog.getBinding("items").filter(aOrFiltersCond);
				// Open ValueHelpDialog filtered by the input's value
				that.AmministrazioneHelpDialog.open(sInputValue);
			}

			if (inputRef === "CentroResp") {
				var sAmmi = that.getView().byId("idAmm").getValue();

				arrayProperties = [{
					"property": "Prctr",
					"label": "{i18n>Amministrazione}"
				}, {
					"property": " ",
					"label": "{i18n>DescAmm}" //MANCA
				}, {
					"property": "Codicecdr",
					"label": "{i18n>CodCategoria}"
				}, {
					"property": "Descrestesa",
					"label": "{i18n>DescCdr}"
				}];
				if (!that.CentroResp) {
					that.CentroResp = this.createValueHelpTableSelectDialog(
						"CentroResp",
						oModelGlobal,
						"",
						"{i18n>Cdr}",
						"/AF_CdrSet",
						arrayProperties, that);
				}

				// Create a filter for the binding
				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Codiceazione", FilterOperator.Contains, sInputValue),
							new Filter("Descrestesa", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				// non dovrebbe succedere ma evita il dump su BE nel caso fosse null
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sAmmi !== undefined && sAmmi !== "") {
					aFilters.aFilters.push(new Filter("Prctr", FilterOperator.EQ, sAmmi));
				}

				that.CentroResp.getBinding("items").filter(aFilters);
				//Open ValueHelpDialog filtered by the input's value
				that.CentroResp.open(sInputValue);
			}
			if (inputRef === "Ragioneria") { //MANCA
				if (!that.Ragioneria) {
					that.Ragioneria = this.createValueHelpDialog(
						"Ragioneria",
						oModelGlobal,
						"modelConoVisibilita",
						"{i18n>Ragioneria}",
						"/ZCA_AF_RAGIONERIA",
						"CodiceRagioneria",
						"DescrEstesa", that);
				}

				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("CodiceRagioneria", FilterOperator.Contains, sInputValue),
							new Filter("DescrEstesa", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				that.Ragioneria.getBinding("items").filter(aOrFiltersCond);
				// Open ValueHelpDialog filtered by the input's value
				that.Ragioneria.open(sInputValue);
			}

			if (inputRef === "Titolo") {
				if (!that.Titolo) {
					that.Titolo = this.createValueHelpDialog(
						"Titolo",
						oModelGlobal,
						"",
						"{i18n>Titolo}",
						"/AF_TitoloSet",
						"Codicetitolo",
						"Descrtit", that);
				}
				// Create a filter for the binding
				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Codicemissione", FilterOperator.Contains, sInputValue),
							new Filter("Descrtit", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				that.Titolo.getBinding("items").filter(aOrFiltersCond);
				// Open Titolo filtered by the input's value
				that.Titolo.open(sInputValue);
			}

			if (inputRef === "Natura") {
				if (!that.Natura) {
					that.Natura = this.createValueHelpDialog(
						"Natura",
						oModelGlobal,
						"",
						"{i18n>Natura}",
						"/AF_NaturaSet",
						"Codicenatura",
						"Descrestesa", that);
				}
				// Create a filter for the binding
				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Codicemissione", FilterOperator.Contains, sInputValue),
							new Filter("Descrestesa", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				that.Natura.getBinding("items").filter(aOrFiltersCond);
				// Open Titolo filtered by the input's value
				that.Natura.open(sInputValue);
			}

			if (inputRef === "Capo") { //MANCA
				if (!that.Capo) {
					that.Capo = this.createValueHelpDialog(
						"Capo",
						oModelGlobal,
						"modelConoVisibilita",
						"{i18n>Ragioneria}",
						"/AF_CapoSet",
						"Numecoddettcapoent",
						"Desctipocap", that);
				}

				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("CodiceRagioneria", FilterOperator.Contains, sInputValue),
							new Filter("Numecoddettcapoent", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				that.Capo.getBinding("items").filter(aOrFiltersCond);
				// Open ValueHelpDialog filtered by the input's value
				that.Capo.open(sInputValue);
			}

			if (inputRef === "Categoria") {
				sTitolo = that.getView().byId("idTitolo").getValue();

				arrayProperties = [{
					"property": "Codicetitolo",
					"label": "{i18n>CodTitolo}"
				}, {
					"property": "Descrtit",
					"label": "{i18n>DescTitolo}"
				}, {
					"property": "Codicecategoria",
					"label": "{i18n>CodCategoria}"
				}, {
					"property": "Descrcat",
					"label": "{i18n>DescCategoria}"
				}];
				if (!that.Categoria) {
					that.Categoria = this.createValueHelpTableSelectDialog(
						"Categoria",
						oModelGlobal,
						"",
						"{i18n>Categoria}",
						"/AF_CategoriaSet",
						arrayProperties, that);
				}

				// Create a filter for the binding
				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Codiceazione", FilterOperator.Contains, sInputValue),
							new Filter("Descrcat", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				// non dovrebbe succedere ma evita il dump su BE nel caso fosse null
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sTitolo !== undefined && sTitolo !== "") {

					aFilters.aFilters.push(new Filter("Codicetitolo", FilterOperator.EQ, sTitolo));
				}

				that.Categoria.getBinding("items").filter(aFilters);
				//Open ValueHelpDialog filtered by the input's value
				that.Categoria.open(sInputValue);
			}

			if (inputRef === "Tipologia") {
				var sTitolo = that.getView().byId("idTitolo").getValue();
				var sCat = that.getView().byId("idCategoria").getValue();
				arrayProperties = [{
					"property": "Codicetitolo",
					"label": "{i18n>CodTitolo}"
				}, {
					"property": "Descrtit",
					"label": "{i18n>DescTitolo}"
				}, {
					"property": "Codicecategoria",
					"label": "{i18n>CodCategoria}"
				}, {
					"property": "Descrcat",
					"label": "{i18n>DescCategoria}"
				}, {
					"property": "Codicetipologia",
					"label": "{i18n>CodTipologia}"
				}, {
					"property": "Descrtip",
					"label": "{i18n>DescTipologia}"
				}];
				// var sTerm = oEvent.getParameter("suggestValue");

				if (!that.Tipologia) {
					that.Tipologia = this.createValueHelpTableSelectDialog(
						"Tipologia",
						oModelGlobal,
						"",
						"{i18n>Tipologia}",
						"/AF_TipologiaSet",
						arrayProperties, that);
				}

				// Create a filter for the binding
				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Codicepg", FilterOperator.Contains, sInputValue),
							new Filter("Descrtip", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				// non dovrebbe succedere ma evita il dump su BE nel caso fosse null
				// if (sAmm && sCapitolo) {
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sTitolo !== undefined && sTitolo !== "") {

					aFilters.aFilters.push(new Filter("Codicetitolo", FilterOperator.EQ, sTitolo));
				}
				if (sCat !== undefined && sCat !== "") {

					aFilters.aFilters.push(new Filter("Codicecategoria", FilterOperator.EQ, sCat));
				}
				that.Tipologia.getBinding("items").filter(aFilters);
				that.Tipologia.open(sInputValue);
			}

			if (inputRef === "Provento") {
				var sTitolo = that.getView().byId("idTitolo").getValue();
				var sCat = that.getView().byId("idCategoria").getValue();
				var sTip = that.getView().byId("idTipologia").getValue();
				arrayProperties = [{
					"property": "Codicetitolo",
					"label": "{i18n>CodTitolo}"
				}, {
					"property": "Descrtit",
					"label": "{i18n>DescTitolo}"
				}, {
					"property": "Codicecategoria",
					"label": "{i18n>CodCategoria}"
				}, {
					"property": "Descrcat",
					"label": "{i18n>DescCategoria}"
				}, {
					"property": "Codicetipologia",
					"label": "{i18n>CodTipologia}"
				}, {
					"property": "Descrtip",
					"label": "{i18n>DescTipologia}"
				}, {
					"property": "Codiceprovento",
					"label": "{i18n>CodProvento}"
				}, {
					"property": "Descrpro",
					"label": "{i18n>DescProvento}"
				}];

				if (!that.Provento) {
					that.Provento = this.createValueHelpTableSelectDialog(
						"Provento",
						oModelGlobal,
						"",
						"{i18n>Provento}",
						"/AF_ProventoSet",
						arrayProperties, that);
				}

				// Create a filter for the binding
				aOrFiltersCond =
					new Filter({
						filters: [

							new Filter("Descrpro", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				// non dovrebbe succedere ma evita il dump su BE nel caso fosse null
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sTitolo !== undefined && sTitolo !== "") {
					aFilters.aFilters.push(new Filter("Codicetitolo", FilterOperator.EQ, sTitolo));
				}

				if (sCat !== undefined && sCat !== "") {
					aFilters.aFilters.push(new Filter("Codicecategoria", FilterOperator.EQ, sCat));
				}
				if (sTip !== undefined && sTip !== "") {
					aFilters.aFilters.push(new Filter("Codicetipologia", FilterOperator.EQ, sTip));
				}
				that.Provento.getBinding("items").filter(aFilters);
				// Open ValueHelpDialog filtered by the input's value
				that.Provento.open(sInputValue);
			}

			if (inputRef === "IdProposta") {
				//
				if (!that.PropostaDialog) {
					that.PropostaDialog = this.createValueHelpDialog(
						"IdProposta",
						oModelGlobal,
						"",
						"{i18n>IDProposta}",
						"/AF_PropostaSet",
						"Idproposta",
						"Nickname", that);
				}

				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("CodiceRagioneria", FilterOperator.Contains, sInputValue),
							new Filter("Nickname", FilterOperator.Contains, sInputValue)
						],
						and: false
					});
				that.PropostaDialog.getBinding("items").filter(aOrFiltersCond);
				// Open ValueHelpDialog filtered by the input's value
				that.PropostaDialog.open(sInputValue);
			}
		},

		createAddFilter: function(aOrFiltersCond){
			return new Filter({
				filters: [
					aOrFiltersCond
				],
				and: true
			});
		},

		onValueHelpSearch: function(oEvent, inputRef, that) {
			var sValue, aOrFiltersCond, aFilters;
			sValue = oEvent.getParameter("value");
			var sAmminVal, sMissioneVal, sProgrammaVal, sTitoloVal, sCategoriaVal, sCE2Val, sCapitoloVal;
			var fAmm, fMiss, fProg, fCap, fTit, fCat, fCE2;
			if (!inputRef) {
				inputRef = oEvent.getParameters().id;
			}

			if (inputRef === "Amministrazione") {

				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Prctr", FilterOperator.Contains, sValue),
							new Filter("DescrEstesa", FilterOperator.Contains, sValue)
						],
						and: false
					});
				oEvent.getSource().getBinding("items").filter(aOrFiltersCond);
			}

			if (inputRef === "CentroResp") {

				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Codicecdr", FilterOperator.Contains, sValue),
							new Filter("DescrEstesa", FilterOperator.Contains, sValue)
						],
						and: false
					});
				oEvent.getSource().getBinding("items").filter(aOrFiltersCond);
			}

			if (inputRef === "Ragioneria") {

				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("CodiceRagioneria", FilterOperator.Contains, sValue),
							new Filter("DescrEstesa", FilterOperator.Contains, sValue)
						],
						and: false
					});
				oEvent.getSource().getBinding("items").filter(aOrFiltersCond);
			}

			if (inputRef === "Missione") {

				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Codicemissione", FilterOperator.Contains, sValue),
							new Filter("Descrestesami", FilterOperator.Contains, sValue)
						],
						and: false
					});
				oEvent.getSource().getBinding("items").filter(aOrFiltersCond);
			}

			if (inputRef === "Programma") {
				sMissioneVal = that.getView().byId("MissioneFA").getValue();

				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Codiceprogramma", FilterOperator.Contains, sValue),
							new Filter("Descrestesapr", FilterOperator.Contains, sValue)
						],
						and: false
					});
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sMissioneVal !== undefined && sMissioneVal !== "") {
					fMiss = new Filter("Codicemissione", FilterOperator.EQ, sMissioneVal);
					aFilters.aFilters.push(fMiss);
				}
				oEvent.getSource().getBinding("items").filter(aFilters);
			}

			if (inputRef === "Azione") {
				sProgrammaVal = that.getView().byId("ProgrammaFA").getValue();
				sMissioneVal = that.getView().byId("MissioneFA").getValue();
				sAmminVal = that.getView().byId("AmmFA").getValue();

				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Codiceazione", FilterOperator.Contains, sValue),
							new Filter("Descrestesaaz", FilterOperator.Contains, sValue)
						],
						and: false
					});

				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sAmminVal !== undefined && sAmminVal !== "") {
					fAmm = new Filter("Prctr", FilterOperator.EQ, sAmminVal);
					aFilters.aFilters.push(fAmm);
				}
				if (sMissioneVal !== undefined && sMissioneVal !== "") {
					fMiss = new Filter("Codicemissione", FilterOperator.EQ, sMissioneVal);
					aFilters.aFilters.push(fMiss);
				}
				if (sProgrammaVal !== undefined && sProgrammaVal !== "") {
					fProg = new Filter("Codiceprogramma", FilterOperator.EQ, sProgrammaVal);
					aFilters.aFilters.push(fProg);
				}
				oEvent.getSource().getBinding("items").filter(aFilters);
			}

			if (inputRef === "Capitolo") {
				sAmminVal = that.getView().byId("AmmFA").getValue();

				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Codicecapitolo", FilterOperator.Contains, sValue),
							new Filter("Descrizionecapitolo", FilterOperator.Contains, sValue)
						],
						and: false
					});
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sAmminVal !== undefined && sAmminVal !== "") {
					fAmm = new Filter("Prctr", FilterOperator.EQ, sAmminVal);
					aFilters.aFilters.push(fAmm);
				}
				oEvent.getSource().getBinding("items").filter(aFilters);
			}

			if (inputRef === "PG") {
				sAmminVal = that.getView().byId("AmmFA").getValue();
				sCapitoloVal = that.getView().byId("CapitoloFA").getValue();

				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Codicepg", FilterOperator.Contains, sValue),
							new Filter("Descrizionepg", FilterOperator.Contains, sValue)
						],
						and: false
					});
				// if (sAmm && sCapitolo) {	
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sAmminVal !== undefined && sAmminVal !== "") {
					fAmm = new Filter("Prctr", FilterOperator.EQ, sAmminVal);
					aFilters.aFilters.push(fAmm);
				}
				if (sCapitoloVal !== undefined && sCapitoloVal !== "") {
					fCap = new Filter("Codicecapitolo", FilterOperator.EQ, sCapitoloVal);
					aFilters.aFilters.push(fCap);
				}
				oEvent.getSource().getBinding("items").filter(aFilters);
			}

			if (inputRef === "Titolo") {

				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Codicetitolo", FilterOperator.Contains, sValue),
							new Filter("Descrtitolo", FilterOperator.Contains, sValue)
						],
						and: false
					});
				oEvent.getSource().getBinding("items").filter(aOrFiltersCond);
			}

			if (inputRef === "Categoria") {
				sTitoloVal = that.getView().byId("TitoloFA").getValue();

				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Codicecategoria", FilterOperator.Contains, sValue),
							new Filter("Descrcategoria", FilterOperator.Contains, sValue)
						],
						and: false
					});
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sTitoloVal !== undefined && sTitoloVal !== "") {
					fTit = new Filter("Codicetitolo", FilterOperator.EQ, sTitoloVal);
					aFilters.aFilters.push(fTit);
				}
				oEvent.getSource().getBinding("items").filter(aFilters);
			}

			if (inputRef === "CE2") {
				sTitoloVal = that.getView().byId("TitoloFA").getValue();
				sCategoriaVal = that.getView().byId("CategoriaFA").getValue();

				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Codiceclaeco2", FilterOperator.Contains, sValue),
							new Filter("Descrclaesco2", FilterOperator.Contains, sValue)
						],
						and: false
					});
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sTitoloVal !== undefined && sTitoloVal !== "") {
					fTit = new Filter("Codicetitolo", FilterOperator.EQ, sTitoloVal);
					aFilters.aFilters.push(fTit);
				}
				if (sCategoriaVal !== undefined && sCategoriaVal !== "") {
					fCat = new Filter("Codicecategoria", FilterOperator.EQ, sCategoriaVal);
					aFilters.aFilters.push(fCat);
				}
				oEvent.getSource().getBinding("items").filter(aFilters);
			}

			if (inputRef === "CE3") {
				sTitoloVal = that.getView().byId("TitoloFA").getValue();
				sCategoriaVal = that.getView().byId("CategoriaFA").getValue();
				sCE2Val = that.getView().byId("CE2FA").getValue();

				aOrFiltersCond =
					new Filter({
						filters: [
							//new Filter("Codiceclaeco3", FilterOperator.Contains, sValue),
							new Filter("Descrclaeco3", FilterOperator.Contains, sValue)
						],
						and: false
					});
				aFilters = new Filter({
					filters: [
						aOrFiltersCond
					],
					and: true
				});
				if (sTitoloVal !== undefined && sTitoloVal !== "") {
					fTit = new Filter("Codicetitolo", FilterOperator.EQ, sTitoloVal);
					aFilters.aFilters.push(fTit);
				}
				if (sCategoriaVal !== undefined && sCategoriaVal !== "") {
					fCat = new Filter("Codicecategoria", FilterOperator.EQ, sCategoriaVal);
					aFilters.aFilters.push(fCat);
				}
				if (sCE2Val !== undefined && sCE2Val !== "") {
					fCE2 = new Filter("Codiceclaeco2", FilterOperator.EQ, sCE2Val);
					aFilters.aFilters.push(fCE2);
				}
				oEvent.getSource().getBinding("items").filter([aFilters]);
			}

			if (inputRef === "IdProposta") {

				aOrFiltersCond =
					new Filter({
						filters: [
							// new Filter("Idproposta", FilterOperator.Contains, sValue),
							new Filter("Nickname", FilterOperator.Contains, sValue)
						],
						and: false
					});
				oEvent.getSource().getBinding("items").filter(aOrFiltersCond);
			}
		},

		onValueHelpConfirm: function(oEvent, inputRef, that) {
			var oSelectedItem, sPath;
			var sMissioneVal, sProgrammaVal, sAzioneVal;
			var sTitoloVal, sCategoriaVal, sCE2Val, sCE3Val, sIDProposta;
			var oModel = this.oModelGlobal;
			
			oSelectedItem = oEvent.getParameter("selectedItem");

			if (!inputRef) {
				inputRef = oEvent.getParameters().id;
			}

			if (inputRef === "Amministrazione") {
				// oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				this.getView().byId("idAmm").setValue(oSelectedItem.getTitle());
			}
			if (inputRef === "CentroResp") {
				// oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				sPath = oSelectedItem.getBindingContext().getPath();

				this._fillInput("idCdr", oModel.getData(sPath).Codicecdr);

			}

			if (inputRef === "Ragioneria") {
				// oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					// that._enableInput("Missione", false);
					return;
				}
				// that._enableInput("Missione", true);
				this.getView().byId("idRagioneria").setValue(oSelectedItem.getTitle());
			}

			if (inputRef === "Capo") {
				// oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					// that._enableInput("Missione", false);
					return;
				}
				// that._enableInput("Missione", true);
				this.getView().byId("idCapoNPF").setValue(oSelectedItem.getTitle());
			}

			if (inputRef === "Titolo") {
				// oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				this.getView().byId("idTitolo").setValue(oSelectedItem.getTitle());
			}

			if (inputRef === "Natura") {
				// oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				this.getView().byId("idNatura").setValue(oSelectedItem.getTitle());
			}

			if (inputRef === "Tipologia") {
				// oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					this._resetInput("idTitolo");
					this._resetInput("idCategoria");
					return;
				}
				sPath = oSelectedItem.getBindingContext().getPath();

				this._fillInput("idTitolo", oModel.getData(sPath).Codicetitolo);
				this._fillInput("idCategoria", oModel.getData(sPath).Codicecategoria);
				this._fillInput("idTipologia", oModel.getData(sPath).Codicetipologia);
			}

			if (inputRef === "Categoria") {
				// oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					this._resetInput("idTitolo");

					return;
				}
				sPath = oSelectedItem.getBindingContext().getPath();

				this._fillInput("idTitolo", oModel.getData(sPath).Codicetitolo);
				this._fillInput("idCategoria", oModel.getData(sPath).Codicecategoria);

			}

			if (inputRef === "Provento") {
				// var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				sPath = oSelectedItem.getBindingContext().getPath();
				if (!oSelectedItem) {
					this._resetInput("idTitolo");
					this._resetInput("idCategoria");
					this._resetInput("idTipologia");
					return;
				}
				this._fillInput("idTitolo", oModel.getData(sPath).Codicetitolo);
				this._fillInput("idCategoria", oModel.getData(sPath).Codicecategoria);
				this._fillInput("idTipologia", oModel.getData(sPath).Codicetipologia);
				this._fillInput("idProvento", oModel.getData(sPath).Codiceprovento);
			}

			if (inputRef === "IdProposta") {
				// var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				sPath = oSelectedItem.getBindingContext().getPath();
				//that.byId("IDProposta").setValue(oSelectedItem.getTitle());
				var sData = oModel.getData(sPath);
				sIDProposta = oModel.getData(sPath).Idproposta;
				this._fillInput("IdProposta", sIDProposta);
				var oModel = new JSONModel({
					dataGestisciProposta: sData
				});
				this.getView().setModel(oModel, "modelPathGestisciPropostaView");

			}

			/* if (inputRef === "Capitolo") {
				oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					//this._resetInput("idPGNPF");
					this.getView().getModel("modelPFCapEsistente").setData("");
					//this.getView().getModel("modelCOFOGCapEsistente").setData("");
					return;
				}
				
				sPath = oSelectedItem.getBindingContext().getPath();	
				
				
				this.getView().byId("idCapitoloNPFPoP").setValue(oSelectedItem.getBindingContext().getObject().Codicecapitolo)
				this.getView().getModel("modelPFCapEsistente").setData(oSelectedItem.getBindingContext().getObject());			
			} */

			if (inputRef === "Capitolo") {
                oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    this._resetInput("idPGNPF");
                    this.getView().getModel("modelPFCapEsistente").setData("");
                    this.getView().getModel("modelCOFOGCapEsistente").setData("");
                    return;
                }
                var oModel = this.getView().getModel("modelOperazionEsaMod");
                // var oLocalModel = this.getView().getModel("modelPFCapEsistente");
                var sCodCap = oSelectedItem.getTitle();
                var sCodAmm = this.getView().byId("idAmm").getValue();
                var aFilters;
                aFilters = [ // <-- Should be an array, not a Filter instance!
                    new Filter({ // required from "sap/ui/model/Filter"
                        path: "Codicecapitolo",
                        operator: FilterOperator.EQ, // required from "sap/ui/model/FilterOperator"
                        value1: sCodCap
                    }),
                    new Filter({ // required from "sap/ui/model/Filter"
                        path: "Prctr",
                        operator: FilterOperator.EQ, // required from "sap/ui/model/FilterOperator"
                        value1: sCodAmm
                    })
                ];
                var that = this;
                //lt inserisco un busi per evitare che clicchino senza riportare i dati di missione progr azione del capitolo
                //sap.ui.getCore().byId("idCapitoloNPFPoP").getParent().getParent().setBusy(true)
                oModel.read("/PosFinSet", {
                    filters: aFilters,
                    urlParameters: {
                        "$top": 1                       
                    },
                    success: function(oData, oResponse) {
                        //sap.ui.getCore().byId("idCapitoloNPFPoP").getParent().getParent().setBusy(false)
                        if(oData.results.length === 0){
                            console.log("recupero capitolo")
                            MessageBox.error("Non è stato possibile recuperare il dato. ")
                            return;
                        }
                        // console.log(oData);
                        that.getView().getModel("modelPFCapEsistente").setData(oData.results[0]);
						that.getView().byId("idCapitoloNPFPoP").setValue(oData.results[0].Codicecapitolo)
                        
                    },
                    error: function(oError) {
                        //sap.ui.getCore().byId("idCapitoloNPFPoP").getParent().getParent().setBusy(false)
                        MessageBox.error(oError.responseText);
                    }
                }); 
                //sap.ui.getCore().byId("idCapitoloNPFPoP").setValue(oSelectedItem.getTitle());
                // this.getView().byId("idCapitoloNPF").setValue(oSelectedItem.getTitle());
            }

			
		},

		onValueHelpClose: function(oEvent, inputRef) {},

		// onSuggestionItemSelected: function(oEvent, inputRef) {
		// 	var oSelectedItem, sPath;
		// 	var oInputAmm = that.getView().byId("Amministrazione");
		// 	var sMissioneVal, sProgrammaVal;
		// 	var sCapitoloVal, sPGVal;
		// 	var sTitoloVal, sCategoriaVal, sCE2Val, sCE3Val;

		// 	if (inputRef === "Amministrazione") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		that.byId("Amministrazione").setValue(oSelectedItem.getProperty("text"));
		// 	}

		// 	if (inputRef === "CentroResp") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oInputAmm = that.getView().byId("Amministrazione");
		// 		if (!oSelectedItem & oInputAmm.getEnabled() === "true") {
		// 			this._resetInput("Amministrazione");
		// 		}
		// 	}

		// 	if (inputRef === "Ragioneria") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oEvent.getSource().getBinding("items").filter([]);

		// 		if (!oSelectedItem) {
		// 			return;
		// 		}
		// 		that.byId("Ragioneria").setValue(oSelectedItem.getTitle());
		// 	}

		// 	if (inputRef === "Missione") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		// that.byId("Missione").setValue(oSelectedItem.getProperty("text"));	
		// 	}

		// 	if (inputRef === "Programma") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		if (!oSelectedItem) {
		// 			this._resetInput("Missione");
		// 		} else {
		// 			sPath = oSelectedItem.getBindingContext().getPath();
		// 			sMissioneVal = oModel.getData(sPath).Codicemissione;
		// 			this._fillInput("Missione", sMissioneVal);
		// 		}
		// 	}

		// 	if (inputRef === "Azione") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		if (!oSelectedItem) {
		// 			this._resetInput("Missione");
		// 			this._resetInput("Programma");

		// 		} else {
		// 			sPath = oSelectedItem.getBindingContext().getPath();
		// 			sMissioneVal = oModel.getData(sPath).Codicemissione;
		// 			sProgrammaVal = oModel.getData(sPath).Codiceprogramma;
		// 			this._fillInput("Missione", sMissioneVal);
		// 			this._fillInput("Programma", sProgrammaVal);
		// 		}
		// 	}

		// 	if (inputRef === "Capitolo") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oEvent.getSource().getBinding("items").filter([]);

		// 		if (!oSelectedItem) {
		// 			this._resetInput("PG");
		// 			return;
		// 		}
		// 		that.byId("Capitolo").setValue(oSelectedItem.getTitle());
		// 	}

		// 	if (inputRef === "PG") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oEvent.getSource().getBinding("items").filter([]);

		// 		if (!oSelectedItem) {
		// 			//this._resetInput("Amministrazione");
		// 			this._resetInput("Capitolo");
		// 			return;
		// 		}
		// 		sPath = oSelectedItem.getBindingContext().getPath();
		// 		sCapitoloVal = oModel.getData(sPath).Codicecapitolo;
		// 		sPGVal = oModel.getData(sPath).Codicepg;
		// 		this._fillInput("Capitolo", sCapitoloVal);
		// 		this._fillInput("PG", sPGVal);
		// 	}

		// 	if (inputRef === "Titolo") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oEvent.getSource().getBinding("items").filter([]);

		// 		if (!oSelectedItem) {
		// 			return;
		// 		}
		// 		that.byId("Titolo").setValue(oSelectedItem.getTitle());
		// 	}

		// 	if (inputRef === "Categoria") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oEvent.getSource().getBinding("items").filter([]);

		// 		if (!oSelectedItem) {
		// 			this._resetInput("CE2");
		// 			this._resetInput("CE3");
		// 			return;
		// 		}
		// 		sPath = oSelectedItem.getBindingContext().getPath();
		// 		sTitoloVal = oModel.getData(sPath).Codicetitolo;
		// 		// var sDescTitoloVal = oModel.getData(sPath).Descrtitolo;
		// 		sCategoriaVal = oModel.getData(sPath).Codicecategoria;
		// 		// var sDescCatVal = oModel.getData(sPath).Descrcategoria;
		// 		this._fillInput("Titolo", sTitoloVal);
		// 		this._fillInput("Categoria", sCategoriaVal);
		// 	}

		// 	if (inputRef === "CE2") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oEvent.getSource().getBinding("items").filter([]);

		// 		if (!oSelectedItem) {
		// 			this._resetInput("CE3");
		// 			return;
		// 		}
		// 		sPath = oSelectedItem.getBindingContext().getPath();
		// 		sTitoloVal = oModel.getData(sPath).Codicetitolo;
		// 		sCategoriaVal = oModel.getData(sPath).Codicecategoria;
		// 		sCE2Val = oModel.getData(sPath).Codiceclaeco2;
		// 		this._fillInput("Titolo", sTitoloVal);
		// 		this._fillInput("Categoria", sCategoriaVal);
		// 		this._fillInput("CE2", sCE2Val);
		// 	}

		// 	if (inputRef === "CE3") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oEvent.getSource().getBinding("items").filter([]);

		// 		if (!oSelectedItem) {
		// 			return;
		// 		}
		// 		sPath = oSelectedItem.getBindingContext().getPath();
		// 		sTitoloVal = oModel.getData(sPath).Codicetitolo;
		// 		sCategoriaVal = oModel.getData(sPath).Codicecategoria;
		// 		sCE2Val = oModel.getData(sPath).Codiceclaeco2;
		// 		sCE3Val = oModel.getData(sPath).Codiceclaeco3;
		// 		this._fillInput("Titolo", sTitoloVal);
		// 		this._fillInput("Categoria", sCategoriaVal);
		// 		this._fillInput("CE2", sCE2Val);
		// 		this._fillInput("CE3", sCE3Val);
		// 	}

		// 	if (inputRef === "IdProposta") {
		// 		oSelectedItem = oEvent.getParameter("selectedItem");
		// 		oEvent.getSource().getBinding("items").filter([]);
		// 		if (!oSelectedItem) {
		// 			return;
		// 		}
		// 		sPath = oSelectedItem.getBindingContext().getPath();
		// 		that.byId("IdProposta").setValue(oSelectedItem.getTitle());
		// 	}
		// },

		_resetInput: function(id) {
			this.Ref.getView().byId(id).setSelectedItem("");
			this.Ref.getView().byId(id).setValue("");
		},

		_resetEnableInput: function(id, bool) {
			this.Ref.getView().byId(id).setEnabled(bool);
			this.Ref.getView().byId(id).setSelectedItem("");
			this.Ref.getView().byId(id).setValue("");
		},

		_fillInput: function(id, sVal) {

			this.Ref.getView().byId(id).setSelectedItem(sVal);
			this.Ref.getView().byId(id).setValue(sVal);
		},

		_fillDisableInput: function(id, bool, sVal) {
			this.Ref.getView().byId(id).setEnabled(bool);
			this.Ref.getView().byId(id).setSelectedItem(sVal);
			this.Ref.getView().byId(id).setValue(sVal);
			if (bool === true) {
				// se un campo va disabilitato puliamo anche il contenuto
				this.Ref.getView().byId(id).setValue("");
			}
		},
		createValueHelpDialog: function(id, model, modelName, title, binding, titleBinding, descriptionBinding, that) {
			var oSelectDialog = {};
			var _sAggreBinding, _titleBinding, _descriptionBinding;

			var sId = id;
			if (modelName !== '') {
				_sAggreBinding = modelName + '>' + binding;
				if (titleBinding !== '') {
					_titleBinding = '{' + modelName + '>' + titleBinding + '}';
				}
				if (descriptionBinding !== '') {
					_descriptionBinding = '{' + modelName + '>' + descriptionBinding + '}';
				}
			} else {
				_sAggreBinding = binding;
				if (titleBinding !== '') {
					_titleBinding = '{' + titleBinding + '}';
				}
				if (descriptionBinding !== '') {
					_descriptionBinding = '{' + descriptionBinding + '}';
				}
			}

			oSelectDialog = new sap.m.SelectDialog(sId, {
				title: title,
				search: [this.onValueHelpSearch, that],
				confirm: [this.onValueHelpConfirm, that],
				cancel: [this.onValueHelpClose, that]
			});
			model.refresh();
			if (modelName !== '') {

				oSelectDialog.setModel(model, modelName);
			} else {
				oSelectDialog.setModel(model);
			}
			this._oResourceBundle = that.getOwnerComponent().getModel("i18n");
			oSelectDialog.setModel(this._oResourceBundle, "i18n");

			var oTemplateStandardListItem = new sap.m.StandardListItem({
				title: _titleBinding,
				description: _descriptionBinding
			});
			oSelectDialog.bindAggregation("items", _sAggreBinding, oTemplateStandardListItem);
			return oSelectDialog;
		},

		createValueHelpTableSelectDialog: function(id, model, modelName, title, aggragationBinding, arrayProperties, that) {
			var oTableSelectDialog = {};
			var oCell = [];
			var _sAggreBinding, _spropertyBinding;

			if (modelName !== '') {
				_sAggreBinding = modelName + '>' + aggragationBinding;
			} else {
				_sAggreBinding = aggragationBinding;
			}
			oTableSelectDialog = new sap.m.TableSelectDialog(id, {
				title: title,
				noDataText: "{i18n>Nessundatodisponibile}",
				search: [this.onValueHelpSearch, this],
				confirm: [this.onValueHelpConfirm, this],
				cancel: [this.onValueHelpClose, this]
			});
			if (modelName !== '') {
				oTableSelectDialog.setModel(model, modelName);
			} else {
				oTableSelectDialog.setModel(model);
			}
			this._oResourceBundle = that.getOwnerComponent().getModel("i18n");
			oTableSelectDialog.setModel(this._oResourceBundle, "i18n");
			for (var i = 0; i < arrayProperties.length; i++) {
				if (modelName !== '') {
					_spropertyBinding = '{' + modelName + '>' + arrayProperties[i].property + '}';
				} else {
					_spropertyBinding = '{' + arrayProperties[i].property + '}';
				}

				var oColumn = new sap.m.Column({
					width: "auto",
					header: new sap.m.Text({
						text: arrayProperties[i].label

					}),
					styleClass: "boldCss"
				});
				oTableSelectDialog.addColumn(oColumn);
				var cell1 = new sap.m.Text({
					text: _spropertyBinding
				});
				oCell.push(cell1);
			}
			var aColList = new sap.m.ColumnListItem({
				cells: oCell
			});
			oTableSelectDialog.bindItems(_sAggreBinding, aColList);
			return oTableSelectDialog;
		},

	};
});