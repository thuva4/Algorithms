//FINDING ONE SOLUTION FOR ax + by =c
// LINEAR DIOPHANTINE EQUATIONS

ll euclid(ll a,ll b,ll &x,ll &y)
{
    if(a==0)
    {
        x=0;
        y=1;
        return b;
    }
    ll x1,y1;
    ll d=euclid(b%a,a,x1,y1);
    x=y1-(b/a)*x1;
    y=x1;
    return d;
}

ll find_one_soln(ll a,ll b,ll c,ll &x0, ll &y0, ll &g)
{
    g=euclid(abs(a),abs(b),x0,y0);
    if(c%g)
        return 0;
    x0 *=c/g;
    y0 *=c/g;
    if(a<0) 
        x0=-x0;
    if(b<0)
        y0=-y0;
    return 1;
}

int main()
{
    ll q=1;
    CASES
    {
        
        ll a,b,c;
        SC3(a,b,c);
        ll x0,y0,g;
        ll z=find_one_soln(a,b,c,x0,y0,g);
        if(z==1)
        {
            printf("Case %lld: Yes\n",q);
            //PF3(x0,y0,g);
        }
        else
        {
            printf("Case %lld: No\n",q);
        }
        q++;
    }
}
