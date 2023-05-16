<template>
  <!DOCTYPE html>
  <html>
  <head>
    <title>Sign Up</title>

  </head>
  <body>
  <div class="container">
    <h2>Sign Up</h2>
    <form>
      <div class="input-group">
        <label for="username">Username:</label>
        <input type="text" id="username" required>
      </div>
      <div class="input-group">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" id="password" required>
      </div>
      <button class="btn" type="submit">Sign Up</button>
    </form>
  </div>
  </body>
  </html>

</template>

<script>
export default {
  name: "SignUp"
}
</script>

<style scoped>

body {
  font-family: Arial, sans-serif;
  background-color: #f2f2f2;
}

.container {
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}

</style>