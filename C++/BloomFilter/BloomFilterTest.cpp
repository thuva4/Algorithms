#include "BloomFilter.h"
#include <stdlib.h>
#include <iostream>
#include <vector>
#include <string>
#include <set>

int main()
{
    int n = 20;
    float p = 0.05;
    BloomFilter<std::string> bloomf(n, p);
    
    std::cout << "Size of bit array: " << bloomf.size << "\n";
    std::cout << "False positive Probability: " << bloomf.probability << "\n";
    std::cout << "Number of hash functions: " << bloomf.hashCount << "\n";
 
    std::vector<std::string> present_words = {"abound","abounds","abundance","abundant","accessable",
                "bloom","blossom","bolster","bonny","bonus","bonuses",
                "coherent","cohesive","colorful","comely","comfort",
                "gems","generosity","generous","generously","genial"};
    std::vector<std::string> absent_words = {"bluff","cheater","hate","war","humanity",
               "racism","hurt","nuke","gloomy","facebook",
               "geeksforgeeks","twitter"};
               
    std::set<std::string> word_present(present_words.begin(), present_words.end());
    std::set<std::string> word_absent(absent_words.begin(), absent_words.end());

    for(auto item = word_present.begin(); item != word_present.end(); ++item)
        bloomf.add(*item);
        
    std::set<std::string> test_words(word_absent);
    
    for(int i = 0; i < 10; ++i)
        test_words.insert(present_words[rand() % present_words.size()]);

    for(auto item = test_words.begin(); item != test_words.end(); ++item)
    {
        if(bloomf.check(*item))
        {
            if(word_absent.find(*item) != word_absent.end())
                std::cout << *item << " is a false positive!\n";
            else
                std::cout << *item << " is probably present!\n";
        }
        else
            std::cout << *item << " is definitely not present!\n";
    }
}
