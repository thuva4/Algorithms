#!/usr/bin/env perl

# populate the array with the even integers from 0 to 198
my @array = map( $_ * 2, 0 ... 100 );

# prompt the user for a search key
my $searchKey = '';
print 'Enter an integer search key: ';
chomp ( $searchKey = <STDIN> );

my $found = 0;   # $found is initially false
my $index;

for ( my $i = 0; $i < scalar @array; ++$i )
{
   if ( $array[$i] == $searchKey )
    {
        $index = $i;
        $found = 1;
        last;
    }
}

if ( $found ) {
   print "Found $searchKey at $index \n";
} else {
   print "$searchKey not found \n";
}

exit 0;
