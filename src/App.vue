<template>

  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/sorvetes">Sorvetes</router-link> |
      <router-link to="/fornecedores">Fornecedores</router-link> 
    </div>
    <div data-app>
      <router-view />
    </div>
  </div>
</template>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 20px;
  
  background-color: #2c3e50;

  a {
   
    color: rgb(255, 255, 255);
    text-decoration: none;
    padding: 10px;

    &.router-link-exact-active {
      color: #42b983;

    }

  }
  
}

</style>
