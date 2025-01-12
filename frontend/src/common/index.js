const backapi = "http://localhost:4000";

const Allapi = {
    signup: {
        url: `${backapi}/api/signup`,
        method: "POST",
      },
    login: {
      url: `${backapi}/api/login`,
      method: "POST",
    },

}

export default Allapi;
