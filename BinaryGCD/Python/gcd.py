def find_gcd(u,v):
    if(u == v):
        return(u)
    if(u == 0):
        return(v);
    if(v== 0):
        return(u)
    if(u%2 == 0):
        if(v%2 == 0):
            return(2*find_gcd(u//2,v//2))
        else:
            return(find_gcd(u//2,v))
    elif(u%2 == 1):
        if (v%2 == 0):
            return(find_gcd(u,v//2))
        else:
            if(u>=v):
                return(find_gcd((u-v)//2,v))
            else:
                return(find_gcd((v-u)//2,u))

