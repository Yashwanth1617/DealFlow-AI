import fs from 'fs/promises'

export async function saveBufferToFile(
  filePath: string,
  buffer: Uint8Array
) {
  await fs.writeFile(filePath, buffer as any)
}
