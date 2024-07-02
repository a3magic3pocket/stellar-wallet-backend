class Login {
  rootUrl;
  constructor() {
    this.rootUrl = "http://localhost:8080";
    const userEmailElem = document.querySelector("#user-email");
    const userPasswordElem = document.querySelector("#user-password");
    if (userEmailElem) {
      userEmailElem.value = "hello@world.net";
    }
    if (userPasswordElem) {
      userPasswordElem.value = "asdfasdfasdf";
    }
  }

  #validate(email, password) {
    if (!email) {
      Swal.fire({
        title: "email을 입력해주세요",
        icon: "error",
      });
      return false;
    }
    if (!password) {
      Swal.fire({
        title: "password를 입력해주세요",
        icon: "error",
      });
      return false;
    }

    return true;
  }

  async signUp() {
    const url = `${this.rootUrl}/user`;
    let userEmail = document.querySelector("#user-email").value;
    let userPassword = document.querySelector("#user-password").value;
    const isOk = this.#validate(userEmail, userPassword);
    if (!isOk) {
      return;
    }

    const data = {
      email: userEmail,
      password: userPassword,
    };
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        Swal.fire({
          title: "회원가입 성공!",
          icon: "success",
        });
        return;
      }

      const respData = await resp.json();
      const duplicatedMessage = "the email address is already registered";
      if (respData.message && respData.message === duplicatedMessage) {
        Swal.fire({
          title: "이미 가입한 이메일입니다",
          icon: "error",
        });
        return;
      }

      throw new Error("failed to sing up");
    } catch (error) {
      console.error("error", error);
      Swal.fire({
        title: "회원가입 실패!",
        icon: "error",
      });
      return;
    }
  }

  async login() {
    const url = `${this.rootUrl}/auth/login`;
    const userEmail = document.querySelector("#user-email").value;
    const userPassword = document.querySelector("#user-password").value;
    const isOk = this.#validate(userEmail, userPassword);
    if (!isOk) {
      return;
    }

    const data = {
      email: userEmail,
      password: userPassword,
    };
    try {
      const resp = await fetch(url, {
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

      throw new Error("failed to login");
    } catch (error) {
      console.error("error", error);
      Swal.fire({
        title: "로그인 실패!",
        icon: "error",
      });
      return;
    }
  }
}

window.StellarLogin = new Login();
