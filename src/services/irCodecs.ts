/**
 * Microsecond on/off timings for Android ConsumerIrManager.transmit (38–40 kHz carrier).
 * NEC: 32-bit LSB first after9ms/4.5ms header (common consumer IR).
 */

export function nec32Pattern(code: number): number[] {
  const out: number[] = [9000, 4500];
  for (let i = 0; i < 32; i++) {
    const bit = (code >>> i) & 1;
    out.push(560);
    out.push(bit ? 1690 : 560);
  }
  out.push(560);
  return out;
}

/** Sony SIRC 12-bit (40 kHz typical; 38 kHz often still received). */
export function sirc12Pattern(command: number, address: number): number[] {
  const data = (command & 0x7f) | ((address & 0x1f) << 7);
  const out: number[] = [2400, 600];
  for (let i = 0; i < 12; i++) {
    const bit = (data >>> i) & 1;
    out.push(600);
    out.push(bit ? 1200 : 600);
  }
  out.push(600);
  return out;
}
