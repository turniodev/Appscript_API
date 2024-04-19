const API_POST =
  "https://docs.google.com/forms/d/e/1FAIpQLSdE8rBntRin6gwMG9re8TRlQTmprOxt95_mS3RcoL7iVtC5sg/formResponse";
let allUser = [];
document.addEventListener("DOMContentLoaded", () => {
  getAllUser();
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm");
  const forgot = document.getElementById("forgot");
  const signUpBtn = document.getElementById("signup_btn");
  const loginBtn = document.getElementById("login_btn");
  const forgotBtn = document.getElementById("forgot_btn");
  const changeBtn = document.getElementById("change_btn");

  changeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    changePassword();
  });

  forgotBtn &&
    forgotBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (forgot.value) {
        forgotPassword(forgot.value);
      } else {
        alert("Vui lòng nhập Email");
      }
    });
  loginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (email.value && password.value) {
      logIn(email.value, password.value);
    } else {
      alert("Vui lòng nhập đầy đủ thông tin");
    }
  });
  signUpBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (name.value && email.value && password.value && confirm.value) {
      if (password.value === confirm.value) {
        alert("Đủ điều kiện");
        const check = allUser.find((u) => u.email === email.value);
        if (check) {
          alert("Email đã tồn tại");
        } else {
          const newUser = {
            name: name.value,
            email: email.value,
            password: password.value,
            userdata: {
              gender: "male",
              age: 22,
            },
          };
          signUp(newUser);
        }
      } else {
        alert("2 cái mk ko trùng khớp");
      }
    } else {
      alert("Vui lòng nhập đầy đủ thông tin");
    }
  });
});
// Fetch dữ liệu
async function getAllUser() {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbyAH8FIcDzuTkCzkmttaa2P5nN6wh3i9-So30uW-MiRumFr9VVGPSGlJ_IhYq04ZzHl/exec"
  );
  const data = await response.json();
  return (allUser = data.data);
}
//  Đăng ký user
async function signUp(newUser) {
  const formData = new FormData();
  formData.append("entry.1940451093", newUser.name);
  formData.append("entry.1258956908", newUser.email);
  formData.append("entry.1425250550", newUser.password);
  formData.append("entry.137548399", JSON.stringify(newUser.userdata));
  fetch(API_POST, {
    method: "POST",
    body: formData,
    mode: "no-cors",
  });
}
//  Đăng nhập
async function logIn(email, password) {
  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbyAH8FIcDzuTkCzkmttaa2P5nN6wh3i9-So30uW-MiRumFr9VVGPSGlJ_IhYq04ZzHl/exec?email=${email}&password=${password}`
  );
  const data = await response.json();
  console.log(data);
  localStorage.setItem("user", JSON.stringify(data.data.user));
}
//  Quên mật khẩu
async function forgotPassword(email) {
  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbyAH8FIcDzuTkCzkmttaa2P5nN6wh3i9-So30uW-MiRumFr9VVGPSGlJ_IhYq04ZzHl/exec?forgot=${email}`
  );
  const data = await response.json();
  console.log(data.data.status);
  if (data.data.status == "success") {
    window.location.href = "/change_pass.html";
    localStorage.setItem("email", email);
  }
}
//  Xác thực OTP đổi mật khẩu
async function changePassword() {
  const email = localStorage.getItem("email");
  const code = document.getElementById("code");
  const changeNewPassword = document.getElementById("change_new_password");
  const changeConfirmPassword = document.getElementById(
    "change_confirm_password"
  );
  if (changeNewPassword.value === changeConfirmPassword.value) {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbyAH8FIcDzuTkCzkmttaa2P5nN6wh3i9-So30uW-MiRumFr9VVGPSGlJ_IhYq04ZzHl/exec?email=${email}&code=${code.value}&changepassword=${changeNewPassword.value}`
    );
    const data = await response.json();
    console.log(data);
  } else {
    alert("2 cái mk ko trùng khớp");
  }
}
async function updateUser(user, action) {
  const formData = new FormData();
  formData.append("entry.1940451093", user.name);
  formData.append("entry.1258956908", user.email);
  formData.append("entry.137548399", JSON.stringify(user.userdata));
  if (action === "PUT") {
    formData.append("entry.886208951", user.ID);
  } else if (action === "DELETE") {
    formData.append("entry.423263338", user.ID);
  }
  fetch(API_POST, {
    method: "POST",
    body: formData,
    mode: "no-cors",
  });
}

const activeUser = JSON.parse(localStorage.getItem("user"));
