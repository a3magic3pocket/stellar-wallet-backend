class Login {
  constructor() {
    const userEmailElem = document.querySelector("#user-email");
    const userPasswordElem = document.querySelector("#user-password");
    if (userEmailElem) {
      userEmailElem.value = "hello@world.net";
    }
    if (userPasswordElem) {
      userPasswordElem.value = "asdfasdfasdf";
    }
  }

  async login() {
    const loginUrl = "http://localhost:8080/auth/login";
    const userEmail = document.querySelector("#user-email").value;
    const userPassword = document.querySelector("#user-password").value;
    if (!userEmail) {
      Swal.fire({
        title: "email을 입력해주세요",
        icon: "error",
      });
      return;
    }
    if (!userPassword) {
      Swal.fire({
        title: "password를 입력해주세요",
        icon: "error",
      });
      return;
    }

    const data = {
      email: userEmail,
      password: userPassword,
    };

    try {
      const resp = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        window.location.href = "/view/main";
        return;
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      Swal.fire({
        title: "로그인 실패!",
        icon: "error",
      });
      return;
    }
  }
}

window.StellarLogin = new Login();
