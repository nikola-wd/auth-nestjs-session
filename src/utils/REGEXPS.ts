// TODO: Test email regexp

// TODO: Make the password accept . , ; :
const REGEXSPS = {
  Username: /^[a-z0-9_.]+$/,
  Email: /^\S+@\S+\.\S+$/,
  Password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
};

export { REGEXSPS };
