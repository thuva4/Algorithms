#include <cmath>
#include <functional>
#include <vector>
template <class T>
class BloomFilter
{
public:
    /*
        items (int)  : Number of items expected to be stored in bloom filter
        prob (float) : False Positive probability in decimal
    */
    BloomFilter(unsigned int items, float prob)
    {
        probability = prob;
        size = getSize(items, prob);
        hashCount = getHashCount(size, items);
        bitArray = std::vector<int> (size, 0);
    }
    
    void add(T item)
    {
        for(int i = 1; i <= hashCount; ++i)
        {
            bitArray[(i * hasher(item)) % size]++;
        }
    }
    
    void remove(T item)
    {
        for(int i = 1; i <= hashCount; ++i)
        {
            if(bitArray[(i * hasher(item)) % size] > 0)
                bitArray[(i * hasher(item)) % size]--;
        }
    }
    
    bool check(T item)
    {
        for(int i = 1; i <= hashCount; ++i)
        {
            if(bitArray[(i * hasher(item)) % size] == 0)
                return false;
        }
        return true;
    }
    
    float probability;
    unsigned int size, hashCount;
private:
    std::vector<int> bitArray;
    std::hash<T> hasher;
    unsigned int getSize(int n, float p)
    {
        /*
            Return the size of bit array(m) to used using following formula
            -(n * lg(p)) / (lg(2)^2)
            n (int)   : Number of items expected to be stored in filter
            p (float) : False positive probability in decimal
        */
        return (unsigned int)((-n * std::log10(p)) / pow(std::log10(2), 2));
    }
    
    unsigned int getHashCount(unsigned int m, unsigned int n)
    {
        /*
            Return the hash function(k) to be used using following formula
            (m/n) * lg(2)
     
            m (int) : size of bit array
            n (int) : number of items expected to be stored in filter
        */
        return (int)((m/n) * log10(2));
    }
};
