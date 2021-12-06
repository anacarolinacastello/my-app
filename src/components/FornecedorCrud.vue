<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>Lista de Fornecedores</h1>
        <v-data-table
          dense
          :headers="headers"
          :items="fornecedores"
          item-key="id"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Pesquisa"
              class="mx-4"
            ></v-text-field>

            <v-toolbar flat>
              <v-toolbar-title>Fornecedores</v-toolbar-title>

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
                    <span class="headline">FornecedorCrud</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="8">
                          <v-text-field
                            v-model="editedItem.id"
                            label="ID"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="8">
                          <v-text-field
                            v-model="editedItem.descricao"
                            label="Nome"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.contato"
                            label="Contato"
                            v-mask="'(##)#####-####'"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.endereco"
                            label="Endereço"
                            append-icon="mdi-map-marker"
                          ></v-text-field>
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

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"
              >mdi-pencil</v-icon
            >
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'FornecedorCrud',
  data: () => ({
    search: '',
    dialog: false,

    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nome', value: 'descricao' },
      { text: 'Contato', value: 'contato' },
      { text: 'Endereço', value: 'endereco' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    fornecedores: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      descricao: '',
      contato: '',
      endereco: ''
    },
    defaultItem: {
      id: 0,
      descricao: '',
      contato: '',
      endereco: ''
    }
  }),
  methods: {
    inicializa() {
      axios('http://localhost:3000/fornecedores')
        .then(response => {
          this.fornecedores = response.data;
        })
        .catch(error => console.log(error));
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        axios
          .put(
            'http://localhost:3000/fornecedores/' + this.editedItem.id,
            this.editedItem
          )
          .then(response => {
            console.log(response);
            Object.assign(this.fornecedores[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch(error => console.log(error));
      } else {
        axios
          .post('http://localhost:3000/fornecedores', this.editedItem)
          .then(response => {
            console.log(response);
            this.fornecedores.push(this.editedItem);
            this.close();
          })
          .catch(error => console.log(error));
      }
    },
    editItem(item) {
      this.editedIndex = this.fornecedores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.fornecedores.indexOf(item);
      confirm('Deseja apagar este item?') &&
        axios
          .delete('http://localhost:3000/fornecedores/' + item.id)
          .then(response => {
            console.log(response.data);
            this.fornecedores.splice(index, 1);
          })
          .catch(error => console.log(error));
    }
  },
  created() {
    this.inicializa();
  }
};
</script>
