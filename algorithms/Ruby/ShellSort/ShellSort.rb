#Shell Sort implementation(Diminishing Increment Sort)
#Time-complexity: O(n^2), In-place
#will be using Knuth series :3n+1

def shell_sort(a)
    n=a.length
    h=1
    
    while (h<n/3)  #for computing increment factor "h"
        h= (3*h)+1
    end
    
    while h>=1
    # Logic of insertion sort with inrement steps of "h"
        for i in h...n
            j=i
            while j>=h
                if a[j-h]>a[j]
                    temp=a[j]
                    a[j]=a[j-h]
                    a[j-h]=temp
                end
                j-=h
            end
        end
        h/=3
    end
    
    return a
    
end

puts(shell_sort([0,5,4,7,1,8,9,3,7,1,4,2,8,6]))
