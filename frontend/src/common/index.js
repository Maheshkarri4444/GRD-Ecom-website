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
    logout: {
      url: `${backapi}/logout`,
      method: "POST",
    },
    editPorfile: {
      url: `${backapi}/api/edit-profile`,
      method:"PUT",
    }

}

export default Allapi;
