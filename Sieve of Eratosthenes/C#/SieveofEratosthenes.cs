using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSharpAlgorithms
{

    public class SieveofEratosthenes
    {
        private readonly List<int> _primes = new List<int>();
        
        public List<int> GetPrimes(int n)
        {
            _primes.Add(2);

            for (var i = 3; i <= n; i++)
            {
                var isPrime = false;

                foreach (var p in _primes)
                {
                    if (i % p == 0)
                    {
                        isPrime = false;
                        break;
                    }
                    isPrime = true;
                }

                if (isPrime)
                {
                    _primes.Add(i);
                }
            }
            return _primes;
        }

    }

}
