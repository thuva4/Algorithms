use integer;

# populate the array with the integers from 0 to 100
for ( $i = 0; $i <= 100; ++$i )
{
    $array[$i] = 1 * $i;
}

# prompt the user for a search key
print "Enter an integer search key: ";
chomp ( $searchKey = <STDIN> );

$left = 0;
$right = scalar @array - 1;
$found = 0;

while ( ($left + 1) < $right )
{
    $mid = $left + ($right - $left)/2;

    if ( $array[$mid] == $searchKey )
    {
        $found = 1;
        last;
    }

    if ( $searchKey < $array[$mid] )
    {
        $right = $mid;
    }
    else
    {
        $left = $mid;
    }
}

if ( $found )   # $found == 1
{
    print "Found $searchKey at $mid \n";
}
else            # $found == 0
{
    print "$searchKey not found \n";
}
