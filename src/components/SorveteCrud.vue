<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>Lista de Sorvetes</h1>
          <v-data-table dense :headers="headers" :items="sorvetes" item-key="id" class="elevation-1" :search="search">
            <template v-slot:top>
              <v-text-field
                v-model="search"
                label="Pesquisa"
                class="mx-4"
              ></v-text-field>

            <v-toolbar flat>
              <v-toolbar-title>Sorvetes</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="700px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Novo Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">SorveteCrud</span>
                  </v-card-title>

                 <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.id"
                              label="Id"
                              type="number"
                                                         
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="8">
                            <v-text-field
                              v-model="editedItem.sabor"
                              label="Sabor"
                               
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.linha"
                              label="Linha"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.tamanho"
                              label="Tamanho"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.preco"
                              label="Preço"
                              type="number"
                              placeholder="00.00"
                              prefix="R$"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="editedItem.fornecedor"
                              :items="fornecedores"
                              label="Fornecedor"
                              item-text="descricao"
                              item-value="id"
                              return-value
                            ></v-select>
                          </v-col>                                                    
                        </v-row>
                      </v-container>
                    </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          
          <template v-slot:[`item.fornecedor`]="{ item }">
            {{ descricao(item.fornecedor) }}
          </template>

          <template v-slot:[`item.preco`]="{ item }">
           R${{item.preco}}
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>


          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>

import axios from "axios";
export default{
  name: "SorveteCrud",
  data: () => ({
    search:"",
    dialog:false,
 
      headers: [
        {text: "ID", value: "id"},
        {text: "Sabor", value: "sabor"},
        {text: "Linha", value: "linha"},
        {text: "Tamanho", value: "tamanho"},
        {text: "Preço", value: "preco"},
        {text: "Fornecedor", value: "fornecedor"},
        {text: "Actions", value: "actions", sortable: false },
      ],
      sorvetes:[],
      fornecedores:[],
      editedIndex: -1,
      editedItem: {
        id: 0,
        sabor: "",
        linha: "",
        tamanho: "",
        preco: "",
        fornecedor: "",      
      },
    defaultItem: {
        id: 0,
        sabor: "",
        linha: "",
        tamanho: "",
        preco: "",
        fornecedor: "",   
    },
    
    }),
    methods: {
      descricao(id) {
        var descricao= this.fornecedores.find((x) => x.id === id);
        descricao = descricao ? descricao.descricao : "Fornecedor Desconhecido";
        return descricao;
      },
      inicializa(){
        axios("http://localhost:3000/sorvetes")
        .then((response)=>{
          this.sorvetes =response.data;
        })
      .catch((error)=> console.log(error));
       axios("http://localhost:3000/fornecedores")
        .then((response)=>{
          this.fornecedores =response.data;
        })
      .catch((error)=> console.log(error));
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save(){
      if (this.editedIndex > -1) {

        axios
          .put(
            "http://localhost:3000/sorvetes/" + this.editedItem.id,
            this.editedItem
          )
          .then((response) => {
            console.log(response);
            Object.assign(this.sorvetes[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => console.log(error));
      } else {
        axios
          .post("http://localhost:3000/sorvetes", this.editedItem)
          .then((response) => {
            console.log(response);
            this.sorvetes.push(this.editedItem);
            this.close();
          })
          .catch((error) => console.log(error));
      }
    },
    editItem(item) {
      this.editedIndex = this.sorvetes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.sorvetes.indexOf(item);
      confirm("Deseja apagar este item?") &&
        axios
          .delete("http://localhost:3000/sorvetes/" + item.id)
          .then((response) => {
            console.log(response.data);
            this.sorvetes.splice(index, 1);
          })
          .catch((error) => console.log(error));
    },
  },
  created(){
    this.inicializa();
  },
  
};

</script>