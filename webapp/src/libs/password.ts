// noinspection SpellCheckingInspection

/**
 * @author JustBrandonLim
 *
 * @returns {string} The generated password with at least 1 uppercase, 1 lowercase and 1 special symbol characters
 */

// Generate Password function takes in parameters of uppercase, lowercase, numerical, symbols and passwordLength
export function GeneratePassword(uppercase: boolean, lowercase: boolean, numerical: boolean, symbol: boolean, passwordLength: number): string {
  // declare an array of characters based on the users input
  let characters = "";
  if (numerical) characters += "0123456789";
  if (lowercase) characters += "abcdefghijklmnopqrstuvwxyz";
  if (uppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (symbol) characters += "!@#$%^&*()";

  let generatedPassword = "";


  // generate a random number based on the length of passoword that the user requested.
  while (generatedPassword.length < passwordLength) {
    let randomNumber = Math.floor(Math.random() * characters.length);
    generatedPassword += characters.substring(randomNumber, randomNumber + 1);
  }

  // check password if it fits what the user has requested
  let patternStr = "^";
  if (lowercase) patternStr += "(?=.*[a-z])";
  if (uppercase) patternStr += "(?=.*[A-Z])";
  if (numerical) patternStr += "(?=.*\\d)";
  if (symbol) patternStr += "(?=.*[-+_!@#$%^&*()])";
  patternStr += ".+$";

  let pattern = new RegExp(patternStr);

  if (!pattern.test(generatedPassword)) {
    return GeneratePassword(uppercase, lowercase, numerical, symbol, passwordLength);
  }

  return generatedPassword;
}
