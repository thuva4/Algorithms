    #include <string>

    #include <map>

    #include <iostream>

     

    using namespace std;

    int bitap_search(string text, string pattern)

    {

        int m = pattern.length();

        long pattern_mask[256];

        /** Initialize the bit array R **/

        long R = ~1;

        if (m == 0)

            return -1;

        if (m > 63)

        {

            cout<<"Pattern is too long!";

            return -1;

        }

     

        /** Initialize the pattern bitmasks **/

        for (int i = 0; i <= 255; ++i)

            pattern_mask[i] = ~0;

        for (int i = 0; i < m; ++i)

            pattern_mask[pattern[i]] &= ~(1L << i);

        for (int i = 0; i < text.length(); ++i)

        {

            /** Update the bit array **/

            R |= pattern_mask[text[i]];

            R <<= 1;

            if ((R & (1L << m)) == 0)

     

                return i - m + 1;

        }

        return -1;

    }

    void findPattern(string t, string p)

    {

        int pos = bitap_search(t, p);

        if (pos == -1)

            cout << "\nNo Match\n";

        else

            cout << "\nPattern found at position : " << pos;

    }

     

    int main(int argc, char **argv)

    {

     

        cout << "Bitap Algorithm Test\n";

        cout << "Enter Text\n";

        string text;

        cin >> text;

        cout << "Enter Pattern\n";

        string pattern;

        cin >> pattern;

        findPattern(text, pattern);

    }
