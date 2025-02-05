<template>
  <div class="flex flex-col justify-center items-center mt-28 mb-8">
    <!-- Form box -->
    <div class="form-box w-full max-w-sm p-6 rounded-lg shadow-lg mb-6 max-md:w-5/6">
      <header>Login Yuk</header>
      <div class="input-box">
        <input
          v-model="username"
          type="text"
          class="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Username"
        />
        <i class="bx bx-user absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-400"></i>
      </div>
      <div class="input-box">
        <input
          v-model="password"
          type="password"
          class="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Password"
        />
        <i class="bx bx-lock-alt absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-400"></i>
      </div>
      <div class="input-box">
        <select
          v-model="role"
          class="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled selected>Select Role</option>
          <option value="admin">Admin</option>
          <option value="operator">Kru</option>
        </select>
        <i class="bx bx-user-circle absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-400"></i>
      </div>
      <button
        @click="login"
        class="submit w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Sign In
      </button>
    </div>
    <p class="italic text-gray-400 text-sm mx-auto text-center">
      "Jangan banyak dipikir, tapi dikerjakan!"
    </p>
    <p class="italic text-gray-400 text-sm mx-auto text-center">-Gemilang</p>
  </div>
</template>

<script>
import Swal from "sweetalert2";

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
        Swal.fire({
          title: "Error!",
          text: "Username ama Password gabole kosong woi.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
          },
        });
        return;
      }

      if (!this.role) {
        Swal.fire({
          title: "Error!",
          text: "Role nya dipilih dulu dongg!",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
          },
        });
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            role: this.role,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.user.role !== this.role) {
            Swal.fire({
              title: "Error!",
              text: `Username "${this.username}" dan role "${this.role}" ga sesuai nih.`,
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                popup: "rounded-xl",
                confirmButton: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
              },
            });
            return;
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("username", data.user.username);

          Swal.fire({
            title: "Success!",
            text: "Gokil udh login cuy!",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "rounded-xl",
              confirmButton: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
            },
          }).then(() => {
            this.$router.push({
              path: data.user.role === "admin" ? "/admin/home" : "/HomePageOperator",
            });
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: data.message || "Ente gabisa login.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "rounded-xl",
              confirmButton: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
            },
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        Swal.fire({
          title: "Error!",
          text: "Internet ente ampas, cek koneksi, jgn pke indihome.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
          },
        });
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
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
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
