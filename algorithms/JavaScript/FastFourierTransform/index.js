/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
function icfft(amplitudes) {
  const N = amplitudes.length;
  const iN = 1 / N;

  // conjugate if imaginary part is not 0
  for (let i = 0; i < N; ++i) {
    if (amplitudes[i] instanceof Complex) {
      amplitudes[i].im = -amplitudes[i].im;
    }
  }

  // apply fourier transform
  amplitudes = cfft(amplitudes);

  for (let i = 0; i < N; ++i) {
    // conjugate again
    amplitudes[i].im = -amplitudes[i].im;
    // scale
    amplitudes[i].re *= iN;
    amplitudes[i].im *= iN;
  }
  return amplitudes;
}

function cfft(amplitudes) {
  const N = amplitudes.length;
  if (N <= 1) return amplitudes;

  const hN = N / 2;
  let even = [];
  let odd = [];
  even.length = hN;
  odd.length = hN;
  for (let i = 0; i < hN; ++i) {
    even[i] = amplitudes[i * 2];
    odd[i] = amplitudes[i * 2 + 1];
  }
  even = cfft(even);
  odd = cfft(odd);

  const a = -2 * Math.PI;
  for (let k = 0; k < hN; ++k) {
    if (!(even[k] instanceof Complex)) even[k] = new Complex(even[k], 0);
    if (!(odd[k] instanceof Complex)) odd[k] = new Complex(odd[k], 0);
    const p = k / N;
    const t = new Complex(0, a * p);
    t.cexp(t).mul(odd[k], t);
    amplitudes[k] = even[k].add(t, odd[k]);
    amplitudes[k + hN] = even[k].sub(t, even[k]);
  }
  return amplitudes;
}

module.exports = { icfft };
