/**
 * @author JustBrandonLim
 *
 * @returns {string} The generated password with at least 1 uppercase, 1 lowercase and 1 special symbol characters
 */
export function GeneratePassword(): string {
  var characters = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  var generatedPassword = "";
  for (var i = 0; i <= 8; i++) {
    var randomNumber = Math.floor(Math.random() * characters.length);
    generatedPassword += characters.substring(randomNumber, randomNumber + 1);
  }

  var pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");

  if (!pattern.test(generatedPassword)) {
    return GeneratePassword();
  }

  return generatedPassword;
}
