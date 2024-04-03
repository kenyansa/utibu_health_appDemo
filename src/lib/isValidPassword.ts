
export async function isValidPassword(
    password: string,
    hashedPassword: string
  ) {
    return (await hashPassword(password)) === hashedPassword
  }
  
  async function hashPassword(password: string) {
    const arrayBuffer = await crypto.subtle.digest(  //the SHA-512 algorithm changes plain text password to an encrypted string
      "SHA-512",
      new TextEncoder().encode(password)
    )
  
    return Buffer.from(arrayBuffer).toString("base64") //the algorithm shortens it to 64 bits
  }
  