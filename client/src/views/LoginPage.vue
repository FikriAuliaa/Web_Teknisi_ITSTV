<template>
  <div class="min-h-screen flex flex-col">
    <!-- Login Section -->
    <div class="min-h-screen flex flex-col justify-center items-center">
      <!-- Form box -->
      <div class="form-box">
        <header>Login</header>
        <div class="input-box">
          <input
            v-model="username"
            type="text"
            class="input-field"
            placeholder="Username"
          />
          <i class="bx bx-user"></i>
        </div>
        <div class="input-box">
          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="Password"
          />
          <i class="bx bx-lock-alt"></i>
        </div>
        <div class="input-box">
          <select v-model="role" class="input-field">
            <option value="" disabled selected>Select Role</option>
            <option value="admin">Admin</option>
            <option value="operator">Crew</option>
          </select>
          <i class="bx bx-user-circle"></i>
        </div>
        <button @click="login" class="submit">Sign In</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      role: "",
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        alert("Username and Password cannot be empty.");
        return;
      }
      if (!this.role) {
        alert("Please select a role.");
        return;
      }

      try {
        console.log("Login payload:", {
          username: this.username,
          password: this.password,
          role: this.role,
        });

        // Menggunakan URL dari .env
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        const response = await fetch(`${API_BASE_URL}auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Penting untuk cookies/sesi
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            role: this.role,
          }),
        });

        const data = await response.json();

        console.log("Server response:", data);

        if (response.ok) {
          if (data.user.role !== this.role) {
            alert(
              `Username "${this.username}" and role "${this.role}" do not match.`
            );
            return;
          }

          // Store token and user info
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("username", data.user.username);

          alert("Login successful!");

          // Redirect to role-specific route
          this.$router.push({
            path: data.user.role === "admin" ? "/admin" : "/HomePageOperator",
          });
        } else {
          alert(data.message || "Login failed.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Network error. Please check your connection.");
      }
    },
  },
};
</script>

<style scoped>
/* Styling Login Page */
body {
  font-family: "Poppins", sans-serif;
}

.form-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin: 50px auto;
}

.form-box header {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #333;
  font-weight: 700;
}

.input-box {
  position: relative;
  margin-bottom: 1rem;
  text-align: left;
}

.input-box input,
.input-box select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  transition: all 0.3s ease;
}

.input-box input:focus,
.input-box select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.input-box i {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none;
}

.submit {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.submit:hover {
  background: linear-gradient(45deg, #0056b3, #003d80);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
