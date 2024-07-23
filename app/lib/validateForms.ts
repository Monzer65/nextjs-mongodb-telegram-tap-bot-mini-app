export function validateEmail(email: string) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function validatePassword(password: string) {
  const pattern = /^.{6,}$/;
  return pattern.test(password);
}
