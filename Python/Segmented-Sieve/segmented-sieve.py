import time,bisect
from math import ceil,sqrt

_smallp = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997]

#dumpfactor controls how large the segments are. I'm not sure what the optimal value is.
def sieveSegm(stop, start = 2, dumpfactor = 0.2):
    t=time.clock()

    delta = sqrt(stop - start)

    delta = int(ceil(delta * abs(dumpfactor)))

    sep = (stop - start) // delta + 1
    if stop<1000:
        return _smallp[:bisect.bisect(_smallp,stop)+1]
    primes = sieveSegm(int(sqrt(stop)) + 1,dumpfactor=0.4)
    primes2 = sieveSegm(int(sqrt(sep) + 1),dumpfactor=0.4)
    q=len(primes2)
        # faster
    while q>0 and primes2[0] < start:
        primes2.pop(0)
        q-=1
    a = start
    while a < stop:
        if a + sep > stop:
            sep = stop - a
        stop2 = int(ceil(sqrt(a + sep)))
        b = [True] * sep
        if a < 2:
           if a == 1:
            b[0] = False
           if a == 0:
            b[:1] = [False,False]
        for c in primes:
            if c > stop2:
                break
            q = a % c
            if q != 0:
                d = a - q + c
            else:
                d = a
            while d < a + sep:
                b[d - a] = False
                d += c
        for c in xrange(sep):
             if b[c]:
                primes2.append(a+c)
        a += sep
    # remove redundant
    t=time.clock()-t
    print t
    return primes2
